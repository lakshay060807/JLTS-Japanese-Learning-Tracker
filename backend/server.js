/* global process */
import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

// backend/server.js

const allowedOrigins = [
  "https://jlts-japanese-learning-tracker-uo56.vercel.app",
  "https://jlts-japanese-learning-tracker-uo56-aag080k55.vercel.app",
  "http://localhost:5173"
];

// backend/server.js

app.use(cors({
  origin: function (origin, callback) {
    // Allow local development
    if (!origin || origin.includes('localhost') || origin.includes('127.0.0.1')) {
      return callback(null, true);
    }

    // Allow ANY Vercel deployment of your project
    if (origin.includes('.vercel.app')) {
      return callback(null, true);
    }

    // Otherwise block it for security
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

const PORT = 5000;

// Initialize Supabase
if (!process.env.SUPABASE_URL) {
  console.error('Missing Supabase URL');
}

let supabase;
try {
  const supabaseUrl = process.env.SUPABASE_URL || '';
  const supabaseKey = process.env.SUPABASE_ANON_KEY || '';
  // Only try to initialize if variables exist to avoid crashing the serverless function cold start
  if (supabaseUrl && supabaseKey) {
    supabase = createClient(supabaseUrl, supabaseKey);
  }
} catch (err) {
  console.error('Supabase initialization error:', err.message);
}

// Helper to get or create the single user document using Supabase
async function getUser() {
  // Assuming a table 'users' with a single row. We'll find the first one.
  const { data: users, error } = await supabase.from('users').select('*').limit(1);
  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching user:', error);
  }

  if (!users || users.length === 0) {
    // Default user structure if table is empty or missing
    return {
      id: 1,
      currentStreak: 0,
      lastStudyDate: null,
      progress: { hiragana: 0, katakana: 0, kanji: 0 }
    };
  }
  return users[0];
}

// GET /api/user/streak - Get user streak information, progress, and total time
app.get('/api/user/streak', async (req, res) => {
  try {
    const user = await getUser();

    // Calculate total study time
    const { data: sessions } = await supabase.from('sessions').select('durationInSeconds');
    const totalStudyTime = sessions ? sessions.reduce((sum, s) => sum + (s.durationInSeconds || 0), 0) : 0;

    // Fetch masteries
    const { data: masteries } = await supabase.from('mastery').select('character, type').eq('mastered', true);
    const masteredHiragana = [];
    const masteredKatakana = [];
    const masteredKanji = [];

    if (masteries) {
      masteries.forEach(m => {
        if (m.type === 'hiragana') masteredHiragana.push(m.character);
        if (m.type === 'katakana') masteredKatakana.push(m.character);
        if (m.type === 'kanji') masteredKanji.push(m.character);
      });
    }

    res.json({
      currentStreak: user.currentStreak,
      lastStudyDate: user.lastStudyDate,
      progress: user.progress || { hiragana: 0, katakana: 0, kanji: 0 },
      masteredHiragana,
      masteredKatakana,
      masteredKanji,
      totalStudyTime
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server Error' });
  }
});

// Helper for mastery routes
async function toggleMastery(character, type, totalCount) {
  // Check if it already exists
  const { data: existing } = await supabase
    .from('mastery')
    .select('mastered')
    .eq('character', character)
    .eq('type', type)
    .maybeSingle();

  const isCurrentlyMastered = existing ? existing.mastered : false;
  const newMasteredState = !isCurrentlyMastered;

  // Upsert the new state (Supabase .upsert logic as requested)
  // Assumes your mastery table has a composite unique key (or conflict target) on character/type or similar.
  await supabase
    .from('mastery')
    .upsert(
      { character, type, mastered: newMasteredState },
      { onConflict: 'character,type' } // Modify this string if your conflict key differs in Postgres
    );

  // Now fetch all mastered for this type to compute progress
  const { data: allMastered } = await supabase
    .from('mastery')
    .select('character')
    .eq('type', type)
    .eq('mastered', true);

  const masteredList = allMastered ? allMastered.map(m => m.character) : [];
  const progressVal = Math.round((masteredList.length / totalCount) * 100);

  // Update user's progress in users table
  const user = await getUser();
  const currentProgress = user.progress || { hiragana: 0, katakana: 0, kanji: 0 };
  const newProgress = { ...currentProgress, [type]: progressVal };

  if (user.id) {
    await supabase.from('users').upsert({
      id: user.id || 1,
      progress: newProgress,
      currentStreak: user.currentStreak,
      lastStudyDate: user.lastStudyDate
    });
  }

  return { masteredList, progress: newProgress };
}

// POST /api/user/hiragana - Toggle hiragana mastery
app.post('/api/user/hiragana', async (req, res) => {
  try {
    const { character } = req.body;
    const { masteredList, progress } = await toggleMastery(character, 'hiragana', 46);
    res.json({ success: true, masteredHiragana: masteredList, progress });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server Error' });
  }
});

// POST /api/user/katakana - Toggle katakana mastery
app.post('/api/user/katakana', async (req, res) => {
  try {
    const { character } = req.body;
    const { masteredList, progress } = await toggleMastery(character, 'katakana', 46);
    res.json({ success: true, masteredKatakana: masteredList, progress });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server Error' });
  }
});

// POST /api/user/kanji - Toggle kanji mastery
app.post('/api/user/kanji', async (req, res) => {
  try {
    const { character } = req.body;
    const { masteredList, progress } = await toggleMastery(character, 'kanji', 100);
    res.json({ success: true, masteredKanji: masteredList, progress });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server Error' });
  }
});

// POST /api/user/reset-streak - Reset user streak
app.post('/api/user/reset-streak', async (req, res) => {
  try {
    const user = await getUser();
    await supabase.from('users').upsert({ id: user.id || 1, currentStreak: 0, lastStudyDate: null, progress: user.progress });
    res.json({ success: true, currentStreak: 0 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server Error' });
  }
});

// GET /api/sessions - Get all sessions (sorted newest first)
app.get('/api/sessions', async (req, res) => {
  try {
    const { data: sessions, error } = await supabase.from('sessions').select('*').order('date', { ascending: false });
    if (error) throw error;
    res.json(sessions || []);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server Error' });
  }
});

// POST /api/sessions - Create a new study session
app.post('/api/sessions', async (req, res) => {
  try {
    const { durationInSeconds, duration, category } = req.body;

    // Ensure 'duration' handles legacy 'durationInSeconds' just in case
    const finalDuration = duration || durationInSeconds;

    if (!finalDuration || finalDuration <= 0) {
      return res.status(400).json({ error: 'Invalid duration' });
    }

    const date = new Date().toISOString();
    const saveCategory = category || 'general';

    const { data, error } = await supabase
      .from('sessions')
      .insert([{ duration: finalDuration, date, category: saveCategory }])
      .select();

    if (error) throw error;

    res.json({ session: data ? data[0] : null, isUpdate: false });
  } catch (err) {
    console.error('ERROR in POST /api/sessions:', err);
    res.status(500).json({ error: 'Server Error', message: err.message });
  }
});

// GET /api/stats - Dashboard stats for sessions (count & sum of durations)
app.get('/api/stats', async (req, res) => {
  try {
    const { data: sessions, error } = await supabase.from('sessions').select('duration, durationInSeconds');
    if (error) throw error;

    const count = sessions ? sessions.length : 0;
    // Calculate sum handling both properties since we just implemented the column change requested!
    const totalDuration = sessions ? sessions.reduce((sum, s) => sum + (s.duration || s.durationInSeconds || 0), 0) : 0;

    res.json({ count, totalDuration });
  } catch (err) {
    console.error('ERROR in GET /api/stats:', err);
    res.status(500).json({ error: 'Server Error' });
  }
});

// DELETE /api/sessions/:id - Delete a session
app.delete('/api/sessions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from('sessions').delete().eq('id', id);
    if (error) throw error;
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

// Verify export for Vercel
// Ensure export default app remains at the very bottom
export default app;
