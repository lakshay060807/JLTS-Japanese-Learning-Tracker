import { useState, useEffect, useCallback } from 'react'
import { BookOpen, FileText, Languages, ChevronRight, LayoutDashboard, Play, Pause, Square, Flame, Plus, RotateCcw, CheckCircle, Trash2, Sparkles } from 'lucide-react'
import './App.css'

const Intro = ({ onFinish }) => {
  const [showButton, setShowButton] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish()
    }, 5500)
    
    // Show button after 3 seconds when drawing is mostly done
    const buttonTimer = setTimeout(() => {
      setShowButton(true)
    }, 3000)
    
    return () => {
      clearTimeout(timer)
      clearTimeout(buttonTimer)
    }
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
      {showButton && (
        <button className="get-started-btn animate-fade-in" onClick={onFinish}>
          Get Started
        </button>
      )}
    </div>
  )
}

const WordWidget = () => (
  <div className="word-widget glass-panel animate-fade-in" style={{ marginTop: '-1.5rem' }}>
    <div className="word-content">
      <span className="word-label">Word of the Day</span>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem' }}>
        <span className="word-main">ごはん</span>
        <span className="word-translation">(Gohan)</span>
      </div>
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <span className="word-romaji">Rice / Meal</span>
      <Sparkles size={20} color="var(--primary)" />
    </div>
  </div>
)

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

const Stopwatch = () => {
  const [time, setTime] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [sessions, setSessions] = useState([])

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

  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }

  const handleReset = () => {
    setIsRunning(false)
    setTime(0)
  }

  const handleEnd = () => {
    if (time > 0) {
      const newSession = {
        id: Date.now(),
        duration: formatTime(time),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
      setSessions([newSession, ...sessions])
    }
    setIsRunning(false)
    setTime(0)
  }

  const deleteSession = (id) => {
    setSessions(sessions.filter(s => s.id !== id))
  }

  return (
    <div className="timer-container" style={{ width: '100%' }}>
      <div className="digit-label">Focus Session</div>
      <div className="stopwatch-display">{formatTime(time)}</div>
      
      <div className="timer-controls">
        {!isRunning ? (
          <button className="btn-primary" onClick={() => setIsRunning(true)}>
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
        {sessions.length === 0 ? (
          <div className="empty-sessions">No sessions logged yet today</div>
        ) : (
          sessions.map(session => (
            <div key={session.id} className="session-item">
              <div className="session-info">
                <span className="session-duration">{session.duration}</span>
                <span className="session-date">at {session.timestamp}</span>
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

const StudyTracker = () => {
  return (
    <section className="tracker-section animate-fade-in">
      <div className="tracker-panel glass-panel">
        <Stopwatch />
      </div>
      <div className="tracker-panel glass-panel streak-card">
        <div className="streak-label">Current Streak</div>
        <div className="streak-value">
          <Flame size={48} color="#fb923c" fill="#fb923c" />
          3
        </div>
        <div className="streak-label">Day Streak</div>
        <div className="log-container">
          <button className="btn-secondary" style={{ width: '100%' }} onClick={() => alert('Study Logged!')}>
            <Plus size={18} /> Log Today's Study
          </button>
        </div>
      </div>
    </section>
  )
}

const MaterialCard = ({ title, description, icon: Icon, badge }) => (
  <div className="material-card glass-panel animate-fade-in">
    {badge && <span className="card-badge">{badge}</span>}
    <div className="card-icon">
      <Icon size={24} />
    </div>
    <h3 className="card-title">{title}</h3>
    <p className="card-description">{description}</p>
    <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', color: 'var(--primary)', fontWeight: '600', cursor: 'pointer', fontSize: '0.9rem' }}>
      Start Learning <ChevronRight size={16} />
    </div>
  </div>
)

function App() {
  const targetDate = '2026-07-06T00:00:00'
  const [showIntro, setShowIntro] = useState(true)

  return (
    <>
      <div className={`intro-overlay ${!showIntro ? 'hidden' : ''}`}>
        <Intro onFinish={() => setShowIntro(false)} />
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
          
          <StudyTracker />

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
                badge="90% Complete"
              />
              <MaterialCard 
                title="Katakana" 
                description="Used for foreign words. Essential for reading modern Japanese." 
                icon={Languages}
                badge="45% Progress"
              />
              <MaterialCard 
                title="Kanji" 
                description="Master the first 100 basic ideograms required for N5 level." 
                icon={BookOpen}
                badge="12/103 Known"
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

export default App
