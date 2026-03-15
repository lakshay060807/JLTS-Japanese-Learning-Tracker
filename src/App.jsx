import { useState, useEffect } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import { BookOpen, FileText, Languages, ChevronRight, LayoutDashboard, Play, Pause, Flame, Plus, RotateCcw, CheckCircle, Trash2, Sparkles, ArrowLeft, Volume2 } from 'lucide-react'
import { API_BASE_URL } from "./apiConfig";
import './App.css'

const API_URL = `${API_BASE_URL}/api`

// Sound Effects - Using absolute paths for public assets
const clickSound = new Audio('/click.mp3');
const successSound = new Audio('/success.mp3');

const playSound = (audio) => {
  if (!audio) return;
  audio.currentTime = 0;
  audio.play().catch(err => console.log('Audio playback blocked by browser:', err));
};

const speak = (text) => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel(); // Stop current speech
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ja-JP';
    utterance.rate = 0.9; // Slightly slower for clarity
    window.speechSynthesis.speak(utterance);
  }
};

const Intro = ({ onFinish }) => {


  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish()
    }, 2500)

    return () => clearTimeout(timer)
  }, [onFinish])

  return (
    <div className="intro-container">
      <svg viewBox="0 0 600 200" className="hello-svg">
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          className="hello-text-animate"
          style={{ fontFamily: "'Caveat', cursive", fontSize: '100px' }}
        >
          Konnichiwa
        </text>
      </svg>
    </div>
  )
}

const n5Vocabulary = [
  { japanese: "ほん", romaji: "Hon", english: "Book" },
  { japanese: "がくせい", romaji: "Gakusei", english: "Student" },
  { japanese: "せんせい", romaji: "Sensei", english: "Teacher" },
  { japanese: "かいしゃ", romaji: "Kaisha", english: "Company" },
  { japanese: "くるま", romaji: "Kuruma", english: "Car" },
  { japanese: "かさ", romaji: "Kasa", english: "Umbrella" },
  { japanese: "とけい", romaji: "Tokei", english: "Clock" },
  { japanese: "でんわ", romaji: "Denwa", english: "Phone" },
  { japanese: "へや", romaji: "Heya", english: "Room" },
  { japanese: "いえ", romaji: "Ie", english: "House" },
  { japanese: "みせ", romaji: "Mise", english: "Shop" },
  { japanese: "たべもの", romaji: "Tabemono", english: "Food" },
  { japanese: "のみもの", romaji: "Nomimono", english: "Drinks" },
  { japanese: "ともだち", romaji: "Tomodachi", english: "Friend" },
  { japanese: "かぞく", romaji: "Kazoku", english: "Family" },
  { japanese: "がっこう", romaji: "Gakkou", english: "School" },
  { japanese: "えき", romaji: "Eki", english: "Station" },
  { japanese: "ぎんこう", romaji: "Ginkou", english: "Bank" },
  { japanese: "こうえん", romaji: "Kouen", english: "Park" },
  { japanese: "くうこう", romaji: "Kuukou", english: "Airport" },
  { japanese: "びょういん", romaji: "Byouin", english: "Hospital" },
  { japanese: "きっさてん", romaji: "Kissaten", english: "Cafe" },
  { japanese: "にく", romaji: "Niku", english: "Meat" },
  { japanese: "さかな", romaji: "Sakana", english: "Fish" },
  { japanese: "やさい", romaji: "Yasai", english: "Vegetable" },
  { japanese: "くだもの", romaji: "Kudamono", english: "Fruit" },
  { japanese: "おちゃ", romaji: "Ocha", english: "Tea" },
  { japanese: "おさけ", romaji: "Osake", english: "Alcohol" },
  { japanese: "みず", romaji: "Mizu", english: "Water" },
  { japanese: "ぎゅうにゅう", romaji: "Gyuunyuu", english: "Milk" },
  { japanese: "ごはん", romaji: "Gohan", english: "Rice" },
  { japanese: "パン", romaji: "Pan", english: "Bread" },
  { japanese: "たまご", romaji: "Tamago", english: "Egg" },
  { japanese: "つくえ", romaji: "Tsukue", english: "Desk" },
  { japanese: "いす", romaji: "Isu", english: "Chair" },
  { japanese: "もん", romaji: "Mon", english: "Gate" },
  { japanese: "まど", romaji: "Mado", english: "Window" },
  { japanese: "かばん", romaji: "Kaban", english: "Bag" },
  { japanese: "さいふ", romaji: "Saifu", english: "Wallet" },
  { japanese: "きっぷ", romaji: "Kippu", english: "Ticket" },
  { japanese: "なまえ", romaji: "Namae", english: "Name" },
  { japanese: "しつもん", romaji: "Shitsumon", english: "Question" },
  { japanese: "こたえ", romaji: "Kotae", english: "Answer" },
  { japanese: "かんじ", romaji: "Kanji", english: "Kanji" },
  { japanese: "えいご", romaji: "Eigo", english: "English" },
  { japanese: "にほんご", romaji: "Nihongo", english: "Japanese" },
  { japanese: "しゃしん", romaji: "Shashin", english: "Photo" },
  { japanese: "てがみ", romaji: "Tegami", english: "Letter" },
  { japanese: "えいが", romaji: "Eiga", english: "Movie" },
  { japanese: "おんがく", romaji: "Ongaku", english: "Music" },
  { japanese: "うた", romaji: "Uta", english: "Song" },
  { japanese: "りょこう", romaji: "Ryokou", english: "Travel" },
  { japanese: "しゅくだい", romaji: "Shukudai", english: "Homework" },
  { japanese: "しけん", romaji: "Shiken", english: "Exam" },
  { japanese: "じゅぎょう", romaji: "Jugyou", english: "Class" },
  { japanese: "じしょ", romaji: "Jisho", english: "Dictionary" },
  { japanese: "えんぴつ", romaji: "Enpitsu", english: "Pencil" },
  { japanese: "しんぶん", romaji: "Shinbun", english: "Newspaper" },
  { japanese: "ざっし", romaji: "Zasshi", english: "Magazine" },
  { japanese: "じてんしゃ", romaji: "Jitensha", english: "Bicycle" },
  { japanese: "ひこうき", romaji: "Hikouki", english: "Airplane" },
  { japanese: "ふね", romaji: "Fune", english: "Boat" },
  { japanese: "ちかてつ", romaji: "Chikatetsu", english: "Subway" },
  { japanese: "ちず", romaji: "Chizu", english: "Map" },
  { japanese: "かがみ", romaji: "Kagami", english: "Mirror" },
  { japanese: "かぎ", romaji: "Kagi", english: "Key" },
  { japanese: "でんき", romaji: "Denki", english: "Light" },
  { japanese: "れいぞうこ", romaji: "Reizouko", english: "Fridge" },
  { japanese: "せんたくき", romaji: "Sentakuki", english: "Washing Machine" },
  { japanese: "そうじき", romaji: "Soujiki", english: "Vacuum" },
  { japanese: "たべる", romaji: "Taberu", english: "To eat" },
  { japanese: "のむ", romaji: "Nomu", english: "To drink" },
  { japanese: "みる", romaji: "Miru", english: "To see" },
  { japanese: "きく", romaji: "Kiku", english: "To hear" },
  { japanese: "よむ", romaji: "Yomu", english: "To read" },
  { japanese: "かく", romaji: "Kaku", english: "To write" },
  { japanese: "はなす", romaji: "Hanasu", english: "To speak" },
  { japanese: "いく", romaji: "Iku", english: "To go" },
  { japanese: "くる", romaji: "Kuru", english: "To come" },
  { japanese: "かえる", romaji: "Kaeru", english: "To return" },
  { japanese: "かう", romaji: "Kau", english: "To buy" },
  { japanese: "する", romaji: "Suru", english: "To do" },
  { japanese: "べんきょうする", romaji: "Benkyousuru", english: "To study" },
  { japanese: "しごとする", romaji: "Shigotosuru", english: "To work" },
  { japanese: "あらう", romaji: "Arau", english: "To wash" },
  { japanese: "あるく", romaji: "Aruku", english: "To walk" },
  { japanese: "はしる", romaji: "Hashiru", english: "To run" },
  { japanese: "ねる", romaji: "Neru", english: "To sleep" },
  { japanese: "おきる", romaji: "Okiru", english: "To wake up" },
  { japanese: "まつ", romaji: "Matsu", english: "To wait" },
  { japanese: "もつ", romaji: "Motsu", english: "To hold" },
  { japanese: "すわる", romaji: "Suwaru", english: "To sit" },
  { japanese: "たつ", romaji: "Tatsu", english: "To stand" },
  { japanese: "でる", romaji: "Deru", english: "To exit" },
  { japanese: "はいる", romaji: "Hairu", english: "To enter" },
  { japanese: "つくる", romaji: "Tsukuru", english: "To make" },
  { japanese: "つかう", romaji: "Tsukau", english: "To use" },
  { japanese: "あう", romaji: "Au", english: "To meet" },
  { japanese: "あそぶ", romaji: "Asobu", english: "To play" },
  { japanese: "およぐ", romaji: "Oyogu", english: "To swim" },
  { japanese: "おしえる", romaji: "Oshieru", english: "To teach" },
  { japanese: "おぼえる", romaji: "Oboeru", english: "To remember" },
  { japanese: "わすれる", romaji: "Wasureru", english: "To forget" },
  { japanese: "かす", romaji: "Kasu", english: "To lend" },
  { japanese: "かりる", romaji: "Kariru", english: "To borrow" },
  { japanese: "おくる", romaji: "Okuru", english: "To send" },
  { japanese: "よぶ", romaji: "Yobu", english: "To call" },
  { japanese: "さがす", romaji: "Sagasu", english: "To search" },
  { japanese: "みがく", romaji: "Migaku", english: "To brush" },
  { japanese: "しめる", romaji: "Shimeru", english: "To close" },
  { japanese: "りんご", romaji: "Ringo", english: "Apple" }
];

const WordWidget = () => {
  const [currentWord] = useState(() => {
    // Pick a truly random word on every single page load
    const randomIndex = Math.floor(Math.random() * n5Vocabulary.length);
    return n5Vocabulary[randomIndex];
  });

  if (!currentWord) return null;

  return (
    <div className="word-widget glass-panel animate-scale-up" style={{ marginTop: '-1.5rem', justifyContent: 'center' }}>
      <div className="word-content" style={{ alignItems: 'center', width: '100%' }}>
        <span className="word-label" style={{ marginBottom: '0.5rem' }}>Vocabulary Capsule</span>
        <div className="word-main">
          <span style={{ fontWeight: 900, color: 'white' }}>{currentWord.english}</span>
          <span style={{ margin: '0 1rem', color: 'var(--primary)', opacity: 0.8 }}>=</span>
          <span>{currentWord.romaji}</span>
          <span style={{ marginLeft: '0.75rem', color: 'var(--text-sub)', fontSize: '1.6rem', fontWeight: 400 }}>
            ({currentWord.japanese})
          </span>
        </div>
      </div>
      <div
        style={{ position: 'absolute', right: '2rem', display: 'flex', gap: '1rem', alignItems: 'center' }}
      >
        <button
          className="btn-icon-audio"
          onClick={() => speak(currentWord.japanese)}
          style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center' }}
          title="Play Pronunciation"
        >
          <Volume2 size={24} color="var(--primary)" />
        </button>
        <Sparkles size={24} color="var(--primary)" style={{ opacity: 0.3 }} />
      </div>
    </div>
  );
};

const Countdown = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime()
      const distance = new Date(targetDate).getTime() - now

      if (distance < 0) {
        clearInterval(timer)
        return
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [targetDate])

  return (
    <div className="countdown-wrapper glass-panel animate-fade-in">
      <div className="digit-label" style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>Next JLPT Exam</div>
      <h3>July 6, 2026</h3>
      <div className="countdown-digits">
        <div className="digit-box">
          <span className="digit-value">{timeLeft.days}</span>
          <span className="digit-label">Days</span>
        </div>
        <div className="digit-box">
          <span className="digit-value">{timeLeft.hours}</span>
          <span className="digit-label">Hours</span>
        </div>
        <div className="digit-box">
          <span className="digit-value">{timeLeft.minutes}</span>
          <span className="digit-label">Mins</span>
        </div>
        <div className="digit-box">
          <span className="digit-value">{timeLeft.seconds}</span>
          <span className="digit-label">Secs</span>
        </div>
      </div>
    </div>
  )
}

const Stopwatch = ({ onSessionUpdate, sessions, setSessions, isLoading }) => {
  const [time, setTime] = useState(0)
  const [isRunning, setIsRunning] = useState(false)

  useEffect(() => {
    let interval
    if (isRunning) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1)
      }, 1000)
    } else {
      clearInterval(interval)
    }
    return () => clearInterval(interval)
  }, [isRunning])

  const formatTime = (duration) => {
    const totalSeconds = Number(duration) || 0
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }

  const handleReset = () => {
    setIsRunning(false)
    setTime(0)
  }

  const handleEnd = async () => {
    // 1. Snapshot the time before doing anything
    const snapshotSeconds = time;
    console.log('--- SESSION END TRIGGERED ---');
    console.log('Capture Seconds:', snapshotSeconds);

    if (snapshotSeconds <= 0) {
      console.log('Ignore: Duration is zero.');
      setIsRunning(false);
      setTime(0);
      return;
    }

    // 2. Stop the visual timer UI
    setIsRunning(false);
    playSound(successSound);

    try {
      console.log('POSTing to:', `${API_URL}/sessions`);
      const res = await fetch(`${API_URL}/sessions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ duration: snapshotSeconds })
      });

      if (res.ok) {
        const data = await res.json();
        const { session, isUpdate } = data || {};

        if (!session) {
          console.error('Invalid response:', data);
          return;
        }

        // 3. Update the sessions list local state
        setSessions(prev => {
          const safePrev = Array.isArray(prev) ? prev : [];
          if (isUpdate) {
            return safePrev.map(s => s.id === session.id ? session : s);
          } else {
            return [session, ...safePrev];
          }
        });

        if (isUpdate) {
          alert('Study time added to today\'s log! 🔥');
        }

        setTime(0);
        if (onSessionUpdate) onSessionUpdate();
      } else {
        console.error('❌ Server Error:', res.status);
        alert('Storage Failure: The server could not save this session.');
      }
    } catch (err) {
      console.error('❌ Network Error:', err);
      alert('Connection Lost: Could not sync with the study database.');
    }
  };

  const deleteSession = async (id) => {
    try {
      const res = await fetch(`${API_URL}/sessions/${id}`, {
        method: 'DELETE'
      })
      if (res.ok) {
        setSessions(prev => (Array.isArray(prev) ? prev.filter(s => s.id !== id) : []))
      }
    } catch (err) {
      console.error('Error deleting session:', err)
    }
  }

  return (
    <div className="timer-container" style={{ width: '100%' }}>
      <div className="digit-label">Focus Session</div>
      <div className="stopwatch-display">{formatTime(time)}</div>

      <div className="timer-controls">
        {!isRunning ? (
          <button className="btn-primary" onClick={() => { setIsRunning(true); playSound(clickSound); }}>
            <Play size={18} fill="currentColor" /> Start
          </button>
        ) : (
          <button className="btn-secondary" onClick={() => setIsRunning(false)}>
            <Pause size={18} fill="currentColor" /> Pause
          </button>
        )}

        <button className="btn-secondary" onClick={handleReset}>
          <RotateCcw size={18} /> Reset
        </button>

        <button className="btn-secondary" style={{ borderColor: 'var(--primary)', color: 'var(--primary)' }} onClick={handleEnd}>
          <CheckCircle size={18} /> End
        </button>
      </div>

      <div className="sessions-list">
        <h4 className="sessions-title">Recent Sessions</h4>
        {isLoading ? (
          <div className="empty-sessions">Loading sessions...</div>
        ) : sessions.length === 0 ? (
          <div className="empty-sessions">No sessions logged yet today</div>
        ) : (
          sessions.map(session => (
            <div key={session.id} className="session-item">
              <div className="session-info">
                <span className="session-duration">{formatTime(session.duration)}</span>
                <span className="session-date">
                  {new Date(session.date).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true })}
                </span>
              </div>
              <button className="btn-icon-delete" onClick={() => deleteSession(session.id)} title="Delete Session">
                <Trash2 size={16} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

const StudyTracker = ({ user, fetchUser }) => {
  const [sessions, setSessions] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchSessions = async () => {
    try {
      const res = await fetch(`${API_URL}/sessions`)
      if (res.ok) {
        const data = await res.json()
        setSessions(Array.isArray(data) ? data : [])
      }
    } catch (err) {
      console.error('Error fetching sessions:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchSessions()
  }, [])

  const resetStreak = async () => {
    if (!window.confirm("Are you sure you want to reset your streak to 0?")) return;
    try {
      const res = await fetch(`${API_URL}/user/reset-streak`, { method: 'POST' })
      if (res.ok) {
        fetchUser()
      }
    } catch (err) {
      console.error('Error resetting streak:', err)
    }
  }

  const logStudyToday = async () => {
    try {
      const res = await fetch(`${API_URL}/sessions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ duration: 60 })
      })
      if (res.ok) {
        const data = await res.json()
        const { session, isUpdate } = data || {}
        if (!session) return

        fetchUser()

        setSessions(prev => {
          const safePrev = Array.isArray(prev) ? prev : []
          if (isUpdate) {
            return safePrev.map(s => s.id === session.id ? session : s)
          } else {
            return [session, ...safePrev]
          }
        })

        alert(isUpdate ? 'Study time added to today\'s log!' : 'Daily study logged! Streak increased! 🔥')
      }
    } catch (err) {
      console.error('Error logging study:', err)
    }
  }

  return (
    <section className="tracker-section animate-fade-in">
      <div className="tracker-panel glass-panel">
        <Stopwatch
          onSessionUpdate={fetchUser}
          sessions={sessions}
          setSessions={setSessions}
          isLoading={isLoading}
        />
      </div>
      <div className="tracker-panel glass-panel streak-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', padding: '0 1rem' }}>
          <div className="streak-label">Current Streak</div>
          <button className="btn-icon-delete" onClick={resetStreak} title="Reset Streak" style={{ opacity: 0.7 }}><RotateCcw size={16} /></button>
        </div>
        <div className="streak-value">
          <Flame size={48} color="#fb923c" fill="#fb923c" />
          {user ? user.currentStreak : '--'}
        </div>
        <div className="streak-label">Day Streak</div>
        <div className="log-container">
          <button className="btn-secondary" style={{ width: '100%' }} onClick={logStudyToday}>
            <Plus size={18} /> Log Today's Study
          </button>
        </div>
      </div>
    </section>
  )
}

// eslint-disable-next-line no-unused-vars
const MaterialCard = ({ title, description, icon: Icon, badge, to }) => {
  const navigate = useNavigate();
  return (
    <div className="material-card glass-panel animate-fade-in" onClick={() => navigate(to)} style={{ cursor: 'pointer' }}>
      {badge && <span className="card-badge">{badge}</span>}
      <div className="card-icon">
        <Icon size={24} />
      </div>
      <h3 className="card-title">{title}</h3>
      <p className="card-description">{description}</p>
      <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', color: 'var(--primary)', fontWeight: '600', fontSize: '0.9rem' }}>
        Start Learning <ChevronRight size={16} />
      </div>
    </div>
  )
}

function Dashboard() {
  const targetDate = '2026-07-06T00:00:00+05:30'
  const [showIntro, setShowIntro] = useState(() => !sessionStorage.getItem('hasSeenIntro'))
  const [user, setUser] = useState(null)

  const handleIntroFinish = () => {
    sessionStorage.setItem('hasSeenIntro', 'true')
    setShowIntro(false)
  }

  const fetchUser = async () => {
    try {
      const res = await fetch(`${API_URL}/user/streak`)
      if (res.ok) {
        const data = await res.json()
        setUser(data)
      }
    } catch (err) {
      console.error('Error fetching user info:', err)
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchUser()
  }, [])

  return (
    <>
      <div className={`intro-overlay ${!showIntro ? 'hidden' : ''}`}>
        <Intro onFinish={handleIntroFinish} />
      </div>

      <div className="app-container" style={{ visibility: showIntro ? 'hidden' : 'visible' }}>
        <header className="dashboard-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div className="glass-panel" style={{ padding: '0.75rem', borderRadius: '12px' }}>
              <LayoutDashboard size={24} color="var(--primary)" />
            </div>
            <div>
              <h1>JLPT N5 Study Tracker</h1>
              <p style={{ color: 'var(--text-sub)' }}>Welcome back, Student. Ready for N5?</p>
            </div>
          </div>
          <div className="glass-panel" style={{ padding: '0.5rem', borderRadius: '50px', display: 'flex', gap: '0.5rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#38bdf8', display: 'flex', alignItems: 'center', justifyCenter: 'center', color: 'white', fontWeight: 'bold' }}>S</div>
          </div>
        </header>

        <main style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
          <WordWidget />

          <Countdown targetDate={targetDate} />

          <StudyTracker user={user} fetchUser={fetchUser} />

          <section className="materials-section">
            <div className="section-title">
              <h2>Study Materials</h2>
              <button className="btn-primary" onClick={() => alert('Opening N5 PDF...')}>
                <FileText size={18} />
                Open N5 PDF
              </button>
            </div>

            <div className="materials-grid">
              <MaterialCard
                title="Hiragana"
                description="Learn the basic phonetic script. 46 characters to master."
                icon={Languages}
                badge={user?.progress ? `${user.progress.hiragana}% Complete` : '0% Complete'}
                to="/hiragana"
              />
              <MaterialCard
                title="Katakana"
                description="Used for foreign words. Essential for reading modern Japanese."
                icon={Languages}
                badge={user?.progress ? `${user.progress.katakana}% Progress` : '0% Progress'}
                to="/katakana"
              />
              <MaterialCard
                title="Kanji"
                description="Master the first 100 basic ideograms required for N5 level."
                icon={BookOpen}
                badge={user?.progress ? `${user.progress.kanji}/103 Known` : '0/103 Known'}
                to="/kanji"
              />
            </div>
          </section>
        </main>

        <footer style={{ marginTop: '4rem', textAlign: 'center', padding: '2rem', color: 'var(--text-sub)', fontSize: '0.875rem' }}>
          <p>© 2026 JLPT N5 Tracker. Stay consistent, stay focused.</p>
        </footer>
      </div>
    </>
  )
}

const PlaceholderPage = ({ title }) => {
  const navigate = useNavigate();
  return (
    <div className="app-container glass-panel animate-fade-in" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '1rem', color: 'var(--text)' }}>{title}</h1>
      <p style={{ fontSize: '1.2rem', color: 'var(--text-sub)', marginBottom: '3rem' }}>Coming Soon: Interactive Practice</p>
      <button className="btn-secondary" onClick={() => navigate('/')}>
        <ArrowLeft size={18} /> Back to Dashboard
      </button>
    </div>
  )
}

const hiraganaList = [
  { romaji: "a", kana: "あ" }, { romaji: "i", kana: "い" }, { romaji: "u", kana: "う" }, { romaji: "e", kana: "え" }, { romaji: "o", kana: "お" },
  { romaji: "ka", kana: "か" }, { romaji: "ki", kana: "き" }, { romaji: "ku", kana: "く" }, { romaji: "ke", kana: "け" }, { romaji: "ko", kana: "こ" },
  { romaji: "sa", kana: "さ" }, { romaji: "shi", kana: "し" }, { romaji: "su", kana: "す" }, { romaji: "se", kana: "せ" }, { romaji: "so", kana: "そ" },
  { romaji: "ta", kana: "た" }, { romaji: "chi", kana: "ち" }, { romaji: "tsu", kana: "つ" }, { romaji: "te", kana: "て" }, { romaji: "to", kana: "と" },
  { romaji: "na", kana: "な" }, { romaji: "ni", kana: "に" }, { romaji: "nu", kana: "ぬ" }, { romaji: "ne", kana: "ね" }, { romaji: "no", kana: "の" },
  { romaji: "ha", kana: "は" }, { romaji: "hi", kana: "ひ" }, { romaji: "fu", kana: "ふ" }, { romaji: "he", kana: "へ" }, { romaji: "ho", kana: "ほ" },
  { romaji: "ma", kana: "ま" }, { romaji: "mi", kana: "み" }, { romaji: "mu", kana: "む" }, { romaji: "me", kana: "め" }, { romaji: "mo", kana: "も" },
  { romaji: "ya", kana: "や" }, { romaji: "yu", kana: "ゆ" }, { romaji: "yo", kana: "よ" },
  { romaji: "ra", kana: "ら" }, { romaji: "ri", kana: "り" }, { romaji: "ru", kana: "る" }, { romaji: "re", kana: "れ" }, { romaji: "ro", kana: "ろ" },
  { romaji: "wa", kana: "わ" }, { romaji: "wo", kana: "を" },
  { romaji: "n", kana: "ん" }
];

const HiraganaPage = () => {
  const navigate = useNavigate();
  const [mastered, setMastered] = useState([]);

  // Quiz States
  const [isQuiz, setIsQuiz] = useState(false);
  const [currentQuizItem, setCurrentQuizItem] = useState(null);
  const [quizInput, setQuizInput] = useState("");
  const [quizFeedback, setQuizFeedback] = useState(null); // { type: 'success' | 'error', message?: string }
  const [quizScore, setQuizScore] = useState(0);

  useEffect(() => {
    fetch(`${API_URL}/user/streak`)
      .then(res => res.json())
      .then(data => {
        setMastered(data.masteredHiragana || []);
      })
      .catch(err => {
        console.error(err);
      });
  }, []);

  const toggleMastery = async (character) => {
    // Optimistic UI update
    setMastered(prev =>
      prev.includes(character)
        ? prev.filter(c => c !== character)
        : [...prev, character]
    );

    try {
      await fetch(`${API_URL}/user/hiragana`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ character })
      });
    } catch (err) {
      console.error('Error toggling mastery:', err);
    }
  };

  const startQuiz = () => {
    setIsQuiz(true);
    setQuizScore(0);
    setQuizFeedback(null);
    setQuizInput("");
    pickNextQuizItem();
  };

  const pickNextQuizItem = () => {
    const randomItem = hiraganaList[Math.floor(Math.random() * hiraganaList.length)];
    setCurrentQuizItem(randomItem);
    setQuizInput("");
    setQuizFeedback(null);
  };

  const handleQuizSubmit = async (e) => {
    e.preventDefault();
    if (!currentQuizItem || quizFeedback) return;

    if (quizInput.toLowerCase().trim() === currentQuizItem.romaji) {
      setQuizFeedback({ type: 'success' });
      setQuizScore(prev => prev + 1);

      // Mark as mastered if not already
      if (!mastered.includes(currentQuizItem.kana)) {
        toggleMastery(currentQuizItem.kana);
      }

      setTimeout(() => {
        pickNextQuizItem();
      }, 1000);
    } else {
      setQuizFeedback({ type: 'error', message: currentQuizItem.romaji });
      setTimeout(() => {
        pickNextQuizItem();
      }, 2000);
    }
  };

  const progress = Math.round((mastered.length / 46) * 100) || 0;

  return (
    <div className="app-container animate-fade-in" style={{ paddingBottom: '3rem' }}>
      <header className="dashboard-header" style={{ marginBottom: '1rem' }}>
        <button className="btn-secondary" onClick={() => isQuiz ? setIsQuiz(false) : navigate('/')}>
          <ArrowLeft size={18} /> {isQuiz ? 'Exit Quiz' : 'Back to Dashboard'}
        </button>
        <div style={{ textAlign: 'right' }}>
          <h1 style={{ fontSize: '2rem' }}>{isQuiz ? 'Hiragana Quiz' : 'Hiragana Learning'}</h1>
          <p style={{ color: 'var(--text-sub)' }}>
            {isQuiz ? `Score: ${quizScore}` : `${mastered.length}/46 Mastered (${progress}%)`}
          </p>
        </div>
      </header>

      {!isQuiz ? (
        <>
          <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ width: '70%', height: '8px', background: 'var(--glass-border)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${progress}%`, background: 'var(--primary)', transition: 'width 0.3s ease' }} />
              </div>
              <button className="btn-primary" onClick={startQuiz}>
                <Plus size={18} /> Start Quiz Mode
              </button>
            </div>
          </div>

          <div className="kana-grid">
            {hiraganaList.map(item => {
              const isMastered = mastered.includes(item.kana);
              return (
                <div
                  key={item.kana}
                  className={`kana-card glass-panel ${isMastered ? 'mastered' : ''}`}
                  onClick={() => toggleMastery(item.kana)}
                >
                  <div className="card-audio-trigger" onClick={(e) => { e.stopPropagation(); speak(item.kana); }}>
                    <Volume2 size={14} />
                  </div>
                  <div className="kana-char">{item.kana}</div>
                  <div className="kana-romaji">{item.romaji}</div>
                  <div className="kana-status">
                    {isMastered && <CheckCircle size={16} color="var(--primary)" />}
                  </div>
                </div>
              )
            })}
          </div>
        </>
      ) : (
        <div className="quiz-container animate-fade-in">
          <div className="quiz-card glass-panel">
            <div className="quiz-char-large animate-bounce-in">
              {currentQuizItem?.kana}
            </div>

            <form onSubmit={handleQuizSubmit} className="quiz-form">
              <input
                autoFocus
                type="text"
                value={quizInput}
                onChange={(e) => setQuizInput(e.target.value)}
                placeholder="Type Romaji (e.g. ka)"
                className={`quiz-input glass-input ${quizFeedback?.type}`}
                disabled={!!quizFeedback}
              />

              <div className="quiz-feedback-area">
                {quizFeedback?.type === 'success' && (
                  <div className="feedback-msg success">
                    <CheckCircle size={24} /> Correct!
                  </div>
                )}
                {quizFeedback?.type === 'error' && (
                  <div className="feedback-msg error">
                    Correct Answer: <span style={{ fontWeight: 800 }}>{quizFeedback.message}</span>
                  </div>
                )}
              </div>

              <button type="submit" className="btn-primary quiz-submit-btn" disabled={!!quizFeedback || !quizInput}>
                Submit Answer
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

const katakanaList = [
  { romaji: "a", kana: "ア" }, { romaji: "i", kana: "イ" }, { romaji: "u", kana: "ウ" }, { romaji: "e", kana: "エ" }, { romaji: "o", kana: "オ" },
  { romaji: "ka", kana: "カ" }, { romaji: "ki", kana: "キ" }, { romaji: "ku", kana: "ク" }, { romaji: "ke", kana: "ケ" }, { romaji: "ko", kana: "コ" },
  { romaji: "sa", kana: "サ" }, { romaji: "shi", kana: "シ" }, { romaji: "su", kana: "ス" }, { romaji: "se", kana: "セ" }, { romaji: "so", kana: "ソ" },
  { romaji: "ta", kana: "タ" }, { romaji: "chi", kana: "チ" }, { romaji: "tsu", kana: "ツ" }, { romaji: "te", kana: "テ" }, { romaji: "to", kana: "ト" },
  { romaji: "na", kana: "ナ" }, { romaji: "ni", kana: "ニ" }, { romaji: "nu", kana: "ヌ" }, { romaji: "ne", kana: "ネ" }, { romaji: "no", kana: "ノ" },
  { romaji: "ha", kana: "ハ" }, { romaji: "hi", kana: "ヒ" }, { romaji: "fu", kana: "フ" }, { romaji: "he", kana: "ヘ" }, { romaji: "ho", kana: "ホ" },
  { romaji: "ma", kana: "マ" }, { romaji: "mi", kana: "ミ" }, { romaji: "mu", kana: "ム" }, { romaji: "me", kana: "メ" }, { romaji: "mo", kana: "モ" },
  { romaji: "ya", kana: "ヤ" }, { romaji: "yu", kana: "ユ" }, { romaji: "yo", kana: "ヨ" },
  { romaji: "ra", kana: "ラ" }, { romaji: "ri", kana: "リ" }, { romaji: "ru", kana: "ル" }, { romaji: "re", kana: "レ" }, { romaji: "ro", kana: "ロ" },
  { romaji: "wa", kana: "ワ" }, { romaji: "wo", kana: "ヲ" },
  { romaji: "n", kana: "ン" }
];

const KatakanaPage = () => {
  const navigate = useNavigate();
  const [mastered, setMastered] = useState([]);

  // Quiz States
  const [isQuiz, setIsQuiz] = useState(false);
  const [currentQuizItem, setCurrentQuizItem] = useState(null);
  const [quizInput, setQuizInput] = useState("");
  const [quizFeedback, setQuizFeedback] = useState(null);
  const [quizScore, setQuizScore] = useState(0);

  useEffect(() => {
    fetch(`${API_URL}/user/streak`)
      .then(res => res.json())
      .then(data => {
        setMastered(data.masteredKatakana || []);
      })
      .catch(err => {
        console.error(err);
      });
  }, []);

  const toggleMastery = async (character) => {
    setMastered(prev =>
      prev.includes(character)
        ? prev.filter(c => c !== character)
        : [...prev, character]
    );

    try {
      await fetch(`${API_URL}/user/katakana`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ character })
      });
    } catch (err) {
      console.error('Error toggling mastery:', err);
    }
  };

  const startQuiz = () => {
    setIsQuiz(true);
    setQuizScore(0);
    setQuizFeedback(null);
    setQuizInput("");
    pickNextQuizItem();
  };

  const pickNextQuizItem = () => {
    const randomItem = katakanaList[Math.floor(Math.random() * katakanaList.length)];
    setCurrentQuizItem(randomItem);
    setQuizInput("");
    setQuizFeedback(null);
  };

  const handleQuizSubmit = async (e) => {
    e.preventDefault();
    if (!currentQuizItem || quizFeedback) return;

    if (quizInput.toLowerCase().trim() === currentQuizItem.romaji) {
      setQuizFeedback({ type: 'success' });
      setQuizScore(prev => prev + 1);

      if (!mastered.includes(currentQuizItem.kana)) {
        toggleMastery(currentQuizItem.kana);
      }

      setTimeout(() => {
        pickNextQuizItem();
      }, 1000);
    } else {
      setQuizFeedback({ type: 'error', message: currentQuizItem.romaji });
      setTimeout(() => {
        pickNextQuizItem();
      }, 2000);
    }
  };

  const progress = Math.round((mastered.length / 46) * 100) || 0;

  return (
    <div className="app-container animate-fade-in" style={{ paddingBottom: '3rem' }}>
      <header className="dashboard-header" style={{ marginBottom: '1rem' }}>
        <button className="btn-secondary" onClick={() => isQuiz ? setIsQuiz(false) : navigate('/')}>
          <ArrowLeft size={18} /> {isQuiz ? 'Exit Quiz' : 'Back to Dashboard'}
        </button>
        <div style={{ textAlign: 'right' }}>
          <h1 style={{ fontSize: '2rem' }}>{isQuiz ? 'Katakana Quiz' : 'Katakana Learning'}</h1>
          <p style={{ color: 'var(--text-sub)' }}>
            {isQuiz ? `Score: ${quizScore}` : `${mastered.length}/46 Mastered (${progress}%)`}
          </p>
        </div>
      </header>

      {!isQuiz ? (
        <>
          <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ width: '70%', height: '8px', background: 'var(--glass-border)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${progress}%`, background: 'var(--primary)', transition: 'width 0.3s ease' }} />
              </div>
              <button className="btn-primary" onClick={startQuiz}>
                <Plus size={18} /> Start Quiz Mode
              </button>
            </div>
          </div>

          <div className="kana-grid">
            {katakanaList.map(item => {
              const isMastered = mastered.includes(item.kana);
              return (
                <div
                  key={item.kana}
                  className={`kana-card glass-panel ${isMastered ? 'mastered' : ''}`}
                  onClick={() => toggleMastery(item.kana)}
                >
                  <div className="card-audio-trigger" onClick={(e) => { e.stopPropagation(); speak(item.kana); }}>
                    <Volume2 size={14} />
                  </div>
                  <div className="kana-char">{item.kana}</div>
                  <div className="kana-romaji">{item.romaji}</div>
                  <div className="kana-status">
                    {isMastered && <CheckCircle size={16} color="var(--primary)" />}
                  </div>
                </div>
              )
            })}
          </div>
        </>
      ) : (
        <div className="quiz-container animate-fade-in">
          <div className="quiz-card glass-panel">
            <div className="quiz-char-large animate-bounce-in">
              {currentQuizItem?.kana}
            </div>

            <form onSubmit={handleQuizSubmit} className="quiz-form">
              <input
                autoFocus
                type="text"
                value={quizInput}
                onChange={(e) => setQuizInput(e.target.value)}
                placeholder="Type Romaji (e.g. ka)"
                className={`quiz-input glass-input ${quizFeedback?.type}`}
                disabled={!!quizFeedback}
              />

              <div className="quiz-feedback-area">
                {quizFeedback?.type === 'success' && (
                  <div className="feedback-msg success">
                    <CheckCircle size={24} /> Correct!
                  </div>
                )}
                {quizFeedback?.type === 'error' && (
                  <div className="feedback-msg error">
                    Correct Answer: <span style={{ fontWeight: 800 }}>{quizFeedback.message}</span>
                  </div>
                )}
              </div>

              <button type="submit" className="btn-primary quiz-submit-btn" disabled={!!quizFeedback || !quizInput}>
                Submit Answer
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

const kanjiList = [
  { kanji: "一", meaning: "one", kunyomi: "ひと-つ", onyomi: "イチ" },
  { kanji: "二", meaning: "two", kunyomi: "ふた-つ", onyomi: "ニ" },
  { kanji: "三", meaning: "three", kunyomi: "みっ-つ", onyomi: "サン" },
  { kanji: "四", meaning: "four", kunyomi: "よっ-つ", onyomi: "シ" },
  { kanji: "五", meaning: "five", kunyomi: "いつ-つ", onyomi: "ゴ" },
  { kanji: "六", meaning: "six", kunyomi: "むっ-つ", onyomi: "ロク" },
  { kanji: "七", meaning: "seven", kunyomi: "なな-つ", onyomi: "シチ" },
  { kanji: "八", meaning: "eight", kunyomi: "やっ-つ", onyomi: "ハチ" },
  { kanji: "九", meaning: "nine", kunyomi: "ここの-つ", onyomi: "キュウ" },
  { kanji: "十", meaning: "ten", kunyomi: "とお", onyomi: "ジュウ" },
  { kanji: "百", meaning: "hundred", kunyomi: "x", onyomi: "ヒャク" },
  { kanji: "千", meaning: "thousand", kunyomi: "ち", onyomi: "セン" },
  { kanji: "万", meaning: "ten thousand", kunyomi: "x", onyomi: "マン" },
  { kanji: "円", meaning: "yen", kunyomi: "まる-い", onyomi: "エン" },
  { kanji: "日", meaning: "day", kunyomi: "ひ", onyomi: "ニチ" },
  { kanji: "月", meaning: "month", kunyomi: "つき", onyomi: "ゲツ" },
  { kanji: "火", meaning: "fire", kunyomi: "ひ", onyomi: "カ" },
  { kanji: "水", meaning: "water", kunyomi: "みず", onyomi: "スイ" },
  { kanji: "木", meaning: "tree", kunyomi: "き", onyomi: "モク" },
  { kanji: "金", meaning: "gold", kunyomi: "かね", onyomi: "キン" },
  { kanji: "土", meaning: "soil", kunyomi: "つち", onyomi: "ド" },
  { kanji: "山", meaning: "mountain", kunyomi: "やま", onyomi: "サン" },
  { kanji: "川", meaning: "river", kunyomi: "かわ", onyomi: "セン" },
  { kanji: "田", meaning: "rice field", kunyomi: "た", onyomi: "デン" },
  { kanji: "人", meaning: "person", kunyomi: "ひと", onyomi: "ジン" },
  { kanji: "子", meaning: "child", kunyomi: "こ", onyomi: "シ" },
  { kanji: "女", meaning: "woman", kunyomi: "おんな", onyomi: "ジョ" },
  { kanji: "男", meaning: "man", kunyomi: "おとこ", onyomi: "ダン" },
  { kanji: "先", meaning: "ahead", kunyomi: "さき", onyomi: "セン" },
  { kanji: "生", meaning: "life", kunyomi: "い-きる", onyomi: "セイ" },
  { kanji: "学", meaning: "study", kunyomi: "まな-ぶ", onyomi: "ガク" },
  { kanji: "校", meaning: "school", kunyomi: "x", onyomi: "コウ" },
  { kanji: "年", meaning: "year", kunyomi: "とし", onyomi: "ネン" },
  { kanji: "何", meaning: "what", kunyomi: "なに", onyomi: "カ" },
  { kanji: "前", meaning: "before", kunyomi: "まえ", onyomi: "ゼン" },
  { kanji: "後", meaning: "after", kunyomi: "あと", onyomi: "ゴ" },
  { kanji: "外", meaning: "outside", kunyomi: "そと", onyomi: "ガイ" },
  { kanji: "間", meaning: "between", kunyomi: "あいだ", onyomi: "カン" },
  { kanji: "上", meaning: "up", kunyomi: "うえ", onyomi: "ジョウ" },
  { kanji: "下", meaning: "down", kunyomi: "した", onyomi: "カ" },
  { kanji: "中", meaning: "inside", kunyomi: "なか", onyomi: "チュウ" },
  { kanji: "右", meaning: "right", kunyomi: "みぎ", onyomi: "ウ" },
  { kanji: "左", meaning: "left", kunyomi: "ひだり", onyomi: "サ" },
  { kanji: "分", meaning: "minute", kunyomi: "わ-かる", onyomi: "フン" },
  { kanji: "午", meaning: "noon", kunyomi: "x", onyomi: "ゴ" },
  { kanji: "今", meaning: "now", kunyomi: "いま", onyomi: "コン" },
  { kanji: "友", meaning: "friend", kunyomi: "とも", onyomi: "ユウ" },
  { kanji: "父", meaning: "father", kunyomi: "ちち", onyomi: "フ" },
  { kanji: "母", meaning: "mother", kunyomi: "はは", onyomi: "ボ" },
  { kanji: "気", meaning: "spirit", kunyomi: "x", onyomi: "キ" },
  { kanji: "車", meaning: "car", kunyomi: "くるま", onyomi: "シャ" },
  { kanji: "語", meaning: "language", kunyomi: "かた-る", onyomi: "ゴ" },
  { kanji: "耳", meaning: "ear", kunyomi: "みみ", onyomi: "ジ" },
  { kanji: "手", meaning: "hand", kunyomi: "て", onyomi: "シュ" },
  { kanji: "足", meaning: "foot", kunyomi: "あし", onyomi: "ソク" },
  { kanji: "目", meaning: "eye", kunyomi: "め", onyomi: "モク" },
  { kanji: "口", meaning: "mouth", kunyomi: "くち", onyomi: "コウ" },
  { kanji: "名", meaning: "name", kunyomi: "な", onyomi: "メイ" },
  { kanji: "白", meaning: "white", kunyomi: "しろ", onyomi: "ハク" },
  { kanji: "赤", meaning: "red", kunyomi: "あか", onyomi: "セキ" },
  { kanji: "青", meaning: "blue", kunyomi: "あお", onyomi: "セイ" },
  { kanji: "安", meaning: "cheap", kunyomi: "やす-い", onyomi: "アン" },
  { kanji: "高", meaning: "high", kunyomi: "たか-い", onyomi: "コウ" },
  { kanji: "小", meaning: "small", kunyomi: "ちい-さい", onyomi: "ショウ" },
  { kanji: "大", meaning: "big", kunyomi: "おお-きい", onyomi: "ダイ" },
  { kanji: "長", meaning: "long", kunyomi: "なが-い", onyomi: "チョウ" },
  { kanji: "多", meaning: "many", kunyomi: "おお-い", onyomi: "タ" },
  { kanji: "少", meaning: "few", kunyomi: "すく-ない", onyomi: "ショウ" },
  { kanji: "新", meaning: "new", kunyomi: "あたら-しい", onyomi: "シン" },
  { kanji: "古", meaning: "old", kunyomi: "ふる-い", onyomi: "コ" },
  { kanji: "時", meaning: "time", kunyomi: "とき", onyomi: "ジ" },
  { kanji: "行", meaning: "go", kunyomi: "い-く", onyomi: "コウ" },
  { kanji: "来", meaning: "come", kunyomi: "く-る", onyomi: "ライ" },
  { kanji: "見", meaning: "see", kunyomi: "み-る", onyomi: "ケン" },
  { kanji: "聞", meaning: "hear", kunyomi: "き-く", onyomi: "ブン" },
  { kanji: "食", meaning: "eat", kunyomi: "た-べる", onyomi: "ショク" },
  { kanji: "飲", meaning: "drink", kunyomi: "の-む", onyomi: "イン" },
  { kanji: "買", meaning: "buy", kunyomi: "か-う", onyomi: "バイ" },
  { kanji: "書", meaning: "write", kunyomi: "か-く", onyomi: "ショ" },
  { kanji: "読", meaning: "read", kunyomi: "よ-む", onyomi: "ドク" },
  { kanji: "話", meaning: "speak", kunyomi: "はな-す", onyomi: "ワ" },
  { kanji: "出", meaning: "exit", kunyomi: "で-る", onyomi: "シュツ" },
  { kanji: "入", meaning: "enter", kunyomi: "はい-る", onyomi: "ニュウ" },
  { kanji: "休", meaning: "rest", kunyomi: "やす-む", onyomi: "キュウ" },
  { kanji: "北", meaning: "north", kunyomi: "きた", onyomi: "ホク" },
  { kanji: "南", meaning: "south", kunyomi: "みなみ", onyomi: "ナン" },
  { kanji: "東", meaning: "east", kunyomi: "ひがし", onyomi: "トウ" },
  { kanji: "西", meaning: "west", kunyomi: "にし", onyomi: "セイ" },
  { kanji: "国", meaning: "country", kunyomi: "くに", onyomi: "コク" },
  { kanji: "長", meaning: "leader", kunyomi: "おさ", onyomi: "チョウ" },
  { kanji: "自", meaning: "self", kunyomi: "みずか-ら", onyomi: "ジ" },
  { kanji: "道", meaning: "road", kunyomi: "みち", onyomi: "ドウ" },
  { kanji: "会", meaning: "meet", kunyomi: "あ-う", onyomi: "カイ" },
  { kanji: "社", meaning: "company", kunyomi: "やしろ", onyomi: "シャ" },
  { kanji: "萬", meaning: "ten-thousand-v2", kunyomi: "よろず", onyomi: "マン" },
  { kanji: "言", meaning: "say", kunyomi: "い-う", onyomi: "ゲン" },
  { kanji: "話", meaning: "talk", kunyomi: "はな-し", onyomi: "ワ" },
  { kanji: "思", meaning: "think", kunyomi: "おも-う", onyomi: "シ" },
  { kanji: "立", meaning: "stand", kunyomi: "た-つ", onyomi: "リツ" },
  { kanji: "歩", meaning: "walk", kunyomi: "ある-く", onyomi: "ホ" }
];

const KanjiPage = () => {
  const navigate = useNavigate();
  const [mastered, setMastered] = useState([]);
  const [selectedKanji, setSelectedKanji] = useState(null);

  // Quiz States
  const [isQuiz, setIsQuiz] = useState(false);
  const [currentQuizItem, setCurrentQuizItem] = useState(null);
  const [quizInput, setQuizInput] = useState("");
  const [quizFeedback, setQuizFeedback] = useState(null);
  const [quizScore, setQuizScore] = useState(0);

  useEffect(() => {
    fetch(`${API_URL}/user/streak`)
      .then(res => res.json())
      .then(data => {
        setMastered(data.masteredKanji || []);
      })
      .catch(err => {
        console.error(err);
      });
  }, []);

  const toggleMastery = async (character) => {
    setMastered(prev =>
      prev.includes(character)
        ? prev.filter(c => c !== character)
        : [...prev, character]
    );

    try {
      await fetch(`${API_URL}/user/kanji`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ character })
      });
    } catch (err) {
      console.error('Error toggling mastery:', err);
    }
  };

  const startQuiz = () => {
    setIsQuiz(true);
    setQuizScore(0);
    setQuizFeedback(null);
    setQuizInput("");
    pickNextQuizItem();
  };

  const pickNextQuizItem = () => {
    const randomItem = kanjiList[Math.floor(Math.random() * kanjiList.length)];
    setCurrentQuizItem(randomItem);
    setQuizInput("");
    setQuizFeedback(null);
  };

  const handleQuizSubmit = (e) => {
    e.preventDefault();
    if (!currentQuizItem || quizFeedback) return;

    if (quizInput.toLowerCase().trim() === currentQuizItem.meaning.toLowerCase()) {
      setQuizFeedback({ type: 'success' });
      setQuizScore(prev => prev + 1);

      if (!mastered.includes(currentQuizItem.kanji)) {
        toggleMastery(currentQuizItem.kanji);
      }

      setTimeout(() => {
        pickNextQuizItem();
      }, 1000);
    } else {
      setQuizFeedback({ type: 'error', message: currentQuizItem.meaning });
      setTimeout(() => {
        pickNextQuizItem();
      }, 2000);
    }
  };

  const progress = Math.round((mastered.length / 100) * 100) || 0;

  return (
    <div className="app-container animate-fade-in" style={{ paddingBottom: '3rem' }}>
      <header className="dashboard-header" style={{ marginBottom: '1rem' }}>
        <button className="btn-secondary" onClick={() => isQuiz ? setIsQuiz(false) : navigate('/')}>
          <ArrowLeft size={18} /> {isQuiz ? 'Exit Quiz' : 'Back to Dashboard'}
        </button>
        <div style={{ textAlign: 'right' }}>
          <h1 style={{ fontSize: '2rem' }}>{isQuiz ? 'Kanji Quiz' : 'Kanji Learning'}</h1>
          <p style={{ color: 'var(--text-sub)' }}>
            {isQuiz ? `Score: ${quizScore}` : `${mastered.length}/100 Mastered (${progress}%)`}
          </p>
        </div>
      </header>

      {!isQuiz ? (
        <>
          <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ width: '70%', height: '8px', background: 'var(--glass-border)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${progress}%`, background: 'var(--primary)', transition: 'width 0.3s ease' }} />
              </div>
              <button className="btn-primary" onClick={startQuiz}>
                <Plus size={18} /> Start Quiz Mode
              </button>
            </div>
          </div>

          <div className="kana-grid">
            {kanjiList.map((item, idx) => {
              const isMastered = mastered.includes(item.kanji);
              return (
                <div
                  key={`${item.kanji}-${idx}`}
                  className={`kana-card glass-panel ${isMastered ? 'mastered' : ''}`}
                  onClick={() => setSelectedKanji(item)}
                >
                  <div className="card-audio-trigger" onClick={(e) => { e.stopPropagation(); speak(item.kanji); }}>
                    <Volume2 size={14} />
                  </div>
                  <div className="kana-char" style={{ fontSize: '2.5rem' }}>{item.kanji}</div>
                  <div className="kana-romaji" style={{ fontSize: '0.9rem' }}>{item.meaning}</div>
                  <div className="kana-status">
                    {isMastered && <CheckCircle size={16} color="var(--primary)" />}
                  </div>
                </div>
              )
            })}
          </div>

          {selectedKanji && (
            <div className="modal-overlay animate-fade-in" onClick={() => setSelectedKanji(null)}>
              <div className="modal-content animate-scale-up" onClick={e => e.stopPropagation()}>
                <div
                  className="modal-close"
                  onClick={() => setSelectedKanji(null)}
                  style={{ position: 'absolute', top: '20px', right: '20px', cursor: 'pointer', color: 'var(--text-sub)' }}
                >
                  <Plus size={24} style={{ transform: 'rotate(45deg)' }} />
                </div>

                <div className="modal-body">
                  <div className="kanji-header-with-audio">
                    <h2 className="kanji-large">{selectedKanji.kanji}</h2>
                    <button className="modal-audio-btn" onClick={() => speak(selectedKanji.kanji)} title="Hear Pronunciation">
                      <Volume2 size={24} />
                    </button>
                  </div>
                  <h3 className="kanji-meaning">{selectedKanji.meaning}</h3>

                  <div className="kanji-details-grid">
                    <div className="detail-box glass-panel" onClick={() => speak(selectedKanji.kunyomi.split('-')[0])} style={{ cursor: 'pointer' }}>
                      <div className="detail-label">Kun'yomi <Volume2 size={12} style={{ marginLeft: '4px' }} /></div>
                      <div className="detail-value">{selectedKanji.kunyomi}</div>
                    </div>
                    <div className="detail-box glass-panel" onClick={() => speak(selectedKanji.onyomi)} style={{ cursor: 'pointer' }}>
                      <div className="detail-label">On'yomi <Volume2 size={12} style={{ marginLeft: '4px' }} /></div>
                      <div className="detail-value">{selectedKanji.onyomi}</div>
                    </div>
                  </div>

                  <button
                    className={`memorize-btn ${mastered.includes(selectedKanji.kanji) ? 'mastered' : ''}`}
                    onClick={() => toggleMastery(selectedKanji.kanji)}
                  >
                    <CheckCircle size={20} />
                    {mastered.includes(selectedKanji.kanji) ? 'Memorized' : 'Mark as Memorized'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="quiz-container animate-fade-in" key={currentQuizItem?.kanji || 'quiz'}>
          <div className="quiz-card glass-panel">
            <div className="quiz-char-large animate-bounce-in">
              {currentQuizItem?.kanji}
            </div>

            <form onSubmit={handleQuizSubmit} className="quiz-form">
              <input
                autoFocus
                type="text"
                value={quizInput}
                onChange={(e) => setQuizInput(e.target.value)}
                placeholder="Type Meaning (English)"
                className={`quiz-input glass-input ${quizFeedback?.type}`}
                disabled={!!quizFeedback}
              />

              <div className="quiz-feedback-area">
                {quizFeedback?.type === 'success' && (
                  <div className="feedback-msg success">
                    <CheckCircle size={24} /> Correct!
                  </div>
                )}
                {quizFeedback?.type === 'error' && (
                  <div className="feedback-msg error">
                    Correct Answer: <span style={{ fontWeight: 800, textTransform: 'capitalize' }}>{quizFeedback.message}</span>
                  </div>
                )}
              </div>

              <button type="submit" className="btn-primary quiz-submit-btn" disabled={!!quizFeedback || !quizInput}>
                Submit Answer
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/hiragana" element={<HiraganaPage />} />
      <Route path="/katakana" element={<KatakanaPage />} />
      <Route path="/kanji" element={<KanjiPage />} />
    </Routes>
  )
}

export default App
