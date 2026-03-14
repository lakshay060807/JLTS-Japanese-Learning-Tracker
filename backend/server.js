import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const app = express();
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());

const PORT = 5000;

// Initialize Supabase
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.warn('NOTICE: Supabase URL or Key is missing from environment variables.');
}

const supabase = createClient(supabaseUrl, supabaseKey);

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
    const { data: todaySessions, error: findError } = await supabase
      .from('sessions')
      .select('*')
      .gte('date', startOfDay.toISOString())
      .lt('date', endOfDay.toISOString())
      .limit(1);

    let todaySession = todaySessions && todaySessions.length > 0 ? todaySessions[0] : null;
    let isUpdate = false;

    if (todaySession) {
      // Update existing session
      const updatedDuration = todaySession.durationInSeconds + durationInSeconds;
      const { data: updatedSessions } = await supabase
        .from('sessions')
        .update({ durationInSeconds: updatedDuration, date: now.toISOString() })
        .eq('id', todaySession.id)
        .select();
      todaySession = updatedSessions ? updatedSessions[0] : { id: todaySession.id, durationInSeconds: updatedDuration, date: now.toISOString() };
      isUpdate = true;
    } else {
      // Create new session
      const { data: newSessions } = await supabase
        .from('sessions')
        .insert([{ date: now.toISOString(), durationInSeconds }])
        .select();
      todaySession = newSessions ? newSessions[0] : { durationInSeconds, date: now.toISOString() };

      // Manage Streak
      const user = await getUser();
      let newStreak = user.currentStreak || 0;

      if (user.lastStudyDate) {
        const lastDate = new Date(`${user.lastStudyDate}T00:00:00+05:30`);
        const diffTime = Math.abs(startOfDay.getTime() - lastDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
          newStreak += 1;
        } else if (diffDays > 1) {
          newStreak = 1;
        }
      } else {
        newStreak = 1;
      }

      await supabase.from('users').upsert({
        id: user.id || 1,
        currentStreak: newStreak,
        lastStudyDate: todayStr,
        progress: user.progress
      });
    }

    res.json({ session: todaySession, isUpdate });
  } catch (err) {
    console.error('ERROR in POST /api/sessions:', err);
    res.status(500).json({ error: 'Server Error', message: err.message });
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
// Ensure module.exports = app remains at the very bottom
module.exports = app;
