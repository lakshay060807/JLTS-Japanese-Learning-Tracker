import crypto from 'crypto';
import path from 'path';
import dns from 'dns';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dns.setServers(['8.8.8.8', '8.8.4.4']);

dotenv.config();

const app = express();
// backend/server.js
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://jlts-japanese-learning-tracker-uo56.vercel.app' // <--- PASTE YOUR FRONTEND URL HERE
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json());

const PORT = 5000;

// Connect to MongoDB
console.log('Using Mongo URI:', process.env.MONGO_URI ? 'Defined' : 'UNDEFINED');
const mongoURI = process.env.MONGO_URI;
if (mongoURI && !mongoURI.includes('jlpt_tracker')) {
  console.log('NOTICE: Connecting to MongoDB (Checking for jlpt_tracker in URI...)');
}

mongoose.connect(mongoURI, {
  family: 4,
  dbName: 'jlpt_tracker', // Ensuring the correct database is used as requested
  serverSelectionTimeoutMS: 5000
})
  .then(() => {
    console.log('Successfully connected to MongoDB Cluster (jlpt_tracker)');
  })
  .catch((err) => {
    console.error('CRITICAL: MongoDB connection failed on serverless startup:', {
      error: err.message,
      uri: mongoURI ? mongoURI.split('@')[0] + '@...' : 'MISSING' // Masked for security
    });
  });

// Models
const sessionSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  durationInSeconds: { type: Number, required: true }
});
const Session = mongoose.model('Session', sessionSchema);

const userSchema = new mongoose.Schema({
  currentStreak: { type: Number, default: 0 },
  lastStudyDate: { type: String, default: null },
  progress: {
    hiragana: { type: Number, default: 0 },
    katakana: { type: Number, default: 0 },
    kanji: { type: Number, default: 0 },
  },
  masteredHiragana: { type: [String], default: [] },
  masteredKatakana: { type: [String], default: [] },
  masteredKanji: { type: [String], default: [] }
});
const User = mongoose.model('User', userSchema);

// Helper to get or create the single user document
async function getUser() {
  let user = await User.findOne();
  if (!user) {
    user = new User({
      progress: { hiragana: 0, katakana: 0, kanji: 0 },
      masteredHiragana: [],
      masteredKatakana: [],
      masteredKanji: []
    });
    await user.save();
  }
  return user;
}

// GET /api/user/streak - Get user streak information, progress, and total time
app.get('/api/user/streak', async (req, res) => {
  try {
    const user = await getUser();

    // Calculate total study time directly from the database
    const result = await Session.aggregate([
      { $group: { _id: null, total: { $sum: "$durationInSeconds" } } }
    ]);
    const totalStudyTime = result.length > 0 ? result[0].total : 0;

    res.json({
      currentStreak: user.currentStreak,
      lastStudyDate: user.lastStudyDate,
      progress: user.progress,
      masteredHiragana: user.masteredHiragana,
      masteredKatakana: user.masteredKatakana,
      masteredKanji: user.masteredKanji,
      totalStudyTime
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server Error' });
  }
});

// POST /api/user/hiragana - Toggle hiragana mastery
app.post('/api/user/hiragana', async (req, res) => {
  try {
    const { character } = req.body;
    const user = await getUser();

    const index = user.masteredHiragana.indexOf(character);
    if (index > -1) {
      user.masteredHiragana.splice(index, 1);
    } else {
      user.masteredHiragana.push(character);
    }

    user.progress.hiragana = Math.round((user.masteredHiragana.length / 46) * 100);
    await user.save();
    res.json({ success: true, masteredHiragana: user.masteredHiragana, progress: user.progress });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server Error' });
  }
});

// POST /api/user/katakana - Toggle katakana mastery
app.post('/api/user/katakana', async (req, res) => {
  try {
    const { character } = req.body;
    const user = await getUser();

    const index = user.masteredKatakana.indexOf(character);
    if (index > -1) {
      user.masteredKatakana.splice(index, 1);
    } else {
      user.masteredKatakana.push(character);
    }

    user.progress.katakana = Math.round((user.masteredKatakana.length / 46) * 100);
    await user.save();
    res.json({ success: true, masteredKatakana: user.masteredKatakana, progress: user.progress });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server Error' });
  }
});

// POST /api/user/kanji - Toggle kanji mastery
app.post('/api/user/kanji', async (req, res) => {
  try {
    const { character } = req.body;
    const user = await getUser();

    const index = user.masteredKanji.indexOf(character);
    if (index > -1) {
      user.masteredKanji.splice(index, 1);
    } else {
      user.masteredKanji.push(character);
    }

    user.progress.kanji = Math.round((user.masteredKanji.length / 100) * 100);
    await user.save();
    res.json({ success: true, masteredKanji: user.masteredKanji, progress: user.progress });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server Error' });
  }
});

// POST /api/user/reset-streak - Reset user streak
app.post('/api/user/reset-streak', async (req, res) => {
  try {
    const user = await getUser();
    user.currentStreak = 0;
    user.lastStudyDate = null;
    await user.save();
    res.json({ success: true, currentStreak: 0 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server Error' });
  }
});

// GET /api/sessions - Get all sessions (sorted newest first)
app.get('/api/sessions', async (req, res) => {
  try {
    const sessions = await Session.find().sort({ date: -1 });
    res.json(sessions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server Error' });
  }
});

// POST /api/sessions - Create or update a session for the day
app.post('/api/sessions', async (req, res) => {
  try {
    const { durationInSeconds } = req.body;

    if (!durationInSeconds || durationInSeconds <= 0) {
      return res.status(400).json({ error: 'Invalid duration' });
    }

    const now = new Date();

    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
    const [{ value: mo }, , { value: da }, , { value: ye }] = formatter.formatToParts(now);
    const todayStr = `${ye}-${mo}-${da}`; // YYYY-MM-DD in IST

    // Calculate IST start and end bounds natively into Date objects
    const startOfDay = new Date(`${todayStr}T00:00:00+05:30`);
    const endOfDay = new Date(`${todayStr}T23:59:59.999+05:30`);

    // Find if a session already exists for today
    let todaySession = await Session.findOne({
      date: { $gte: startOfDay, $lt: endOfDay }
    });

    let isUpdate = false;

    if (todaySession) {
      // Update existing session
      todaySession.durationInSeconds += durationInSeconds;
      todaySession.date = now; // update timestamp
      await todaySession.save();
      isUpdate = true;
    } else {
      // Create new session
      todaySession = new Session({
        date: now,
        durationInSeconds
      });
      await todaySession.save();

      // Manage Streak
      const user = await getUser();

      if (user.lastStudyDate) {
        // Evaluate the previously tracked study date properly into an IST Date object
        const lastDate = new Date(`${user.lastStudyDate}T00:00:00+05:30`);

        const diffTime = Math.abs(startOfDay.getTime() - lastDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
          user.currentStreak += 1;
        } else if (diffDays > 1) {
          user.currentStreak = 1;
        }
      } else {
        user.currentStreak = 1;
      }
      user.lastStudyDate = todayStr;
      await user.save();
    }

    res.json({ session: todaySession, isUpdate });
  } catch (err) {
    console.error('ERROR in POST /api/sessions (Study Session Log):', {
      error: err.message,
      stack: err.stack,
      body: req.body
    });
    res.status(500).json({ error: 'Server Error', message: err.message });
  }
});

// DELETE /api/sessions/:id - Delete a session
app.delete('/api/sessions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const session = await Session.findByIdAndDelete(id);

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server Error' });
  }
});
// Conditional listen for local development
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
  });
}

export default app;
