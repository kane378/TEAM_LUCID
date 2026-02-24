import { useNavigate } from 'react-router-dom'
import type { User } from '../types'

interface Props { user: User }

// Stats with image icons and brighter backgrounds
const STATS = [
  { icon: 'https://img.icons8.com/color/96/target--v1.png', label: 'SKILLS ASSESSED', value: 12, note: '+3 this week', color: '#6C63FF', bg: '#E2E0FF' },
  { icon: 'https://img.icons8.com/color/96/trophy.png', label: 'ACHIEVEMENTS', value: 8, note: 'New badge earned!', color: '#ED8936', bg: '#FFEED4' },
  { icon: 'https://img.icons8.com/color/96/line-chart.png', label: 'PROFILE SCORE', value: '85%', note: '+1% this month', color: '#38A169', bg: '#D1FAE5' },
  { icon: 'https://img.icons8.com/color/96/flash-on.png', label: 'STREAK DAYS', value: 15, note: 'Keep it up!', color: '#4299E1', bg: '#DBEAFE' },
]

const ACTIONS = [
  { title: 'Start Career Journey', desc: 'Resume build', to: '/resume' },
  { title: 'Skill Evaluation', desc: 'Assess skills', to: '/domain' },
  { title: 'Learning Plan', desc: 'Roadmap', to: '/plan' },
  { title: 'Practice Quiz', desc: 'Test knowledge with AI quizzes', to: '/quiz' },
  { title: 'Mock Interview', desc: 'Practice with AI interviewer', to: '/interview' },
  { title: 'Find Jobs', desc: 'Jobs matching your skills', to: '/jobs' },
]

export default function Dashboard({ user }: Props) {
  const nav = useNavigate()

  return (
    <div style={{ 
      maxWidth: 1200, 
      margin: '0 auto', 
      padding: '40px 24px', 
      fontFamily: 'system-ui, sans-serif',
      backgroundColor: '#FFFFFF',
      minHeight: '100vh'
    }}>
      
      {/* === TOP: CLEAN WELCOME TEXT === */}
      <div style={{ marginBottom: 64 }}>
        <h1 style={{ color: '#1A202C', fontSize: 32, fontWeight: 800, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
          Hi there, {user.firstName}! <span style={{ fontSize: 28 }}>👋</span>
        </h1>
        <p style={{ color: '#718096', fontSize: 16 }}>Here is an overview of your career progress and quick actions.</p>
      </div>

      {/* === MAIN LAYOUT GRID === */}
      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 40, alignItems: 'start' }}>
        
        {/* === LEFT SIDEBAR: QUICK ACTIONS === */}
        <div>
          <h3 style={{ fontWeight: 800, marginBottom: 20, fontSize: 18, color: '#2D3748' }}>Quick Actions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {ACTIONS.map((a, i) => (
              <div
                key={i}
                onClick={() => nav(a.to)}
                style={{ 
                  background: 'white', 
                  borderRadius: 16, 
                  padding: '20px', 
                  cursor: 'pointer', 
                  border: '1px solid #d8dbe9', 
                  boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                }}
                onMouseOver={e => {
                  e.currentTarget.style.transform = 'scale(1.02) translateX(6px)'
                  // Updated shadow using the requested #211f2f (rgba 33, 31, 47) with 15% opacity for smoothness
                  e.currentTarget.style.boxShadow = '0 8px 20px #918ca9'
                }}
                onMouseOut={e => {
                  e.currentTarget.style.transform = 'scale(1) translateX(0)'
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.02)'
                }}
              >
                <div style={{ fontWeight: 700, fontSize: 15, color: '#2D3748', marginBottom: 4 }}>{a.title}</div>
                <div style={{ fontSize: 13, color: '#A0AEC0' }}>{a.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* === RIGHT MAIN CONTENT: 2x2 STATS GRID === */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24 }}>
          {STATS.map((s, i) => (
            <div 
              key={i} 
              style={{ 
                background: s.bg, 
                borderRadius: 24, 
                padding: '32px 20px', 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'transform 0.25s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.25s ease'
              }}
              onMouseOver={e => {
                e.currentTarget.style.transform = 'scale(1.03)'
                e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.08)'
              }}
              onMouseOut={e => {
                e.currentTarget.style.transform = 'scale(1)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              {/* White Icon Circle with Image inside */}
              <div style={{ 
                background: 'white', 
                width: 64, 
                height: 64, 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                marginBottom: 20,
                boxShadow: '0 4px 12px rgba(0,0,0,0.04)'
              }}>
                <img src={s.icon} alt={s.label} style={{ width: 34, height: 34, objectFit: 'contain' }} />
              </div>
              
              {/* Big Number */}
              <div style={{ fontSize: 48, fontWeight: 800, color: '#1A202C', lineHeight: 1 }}>
                {s.value}
              </div>
              
              {/* Colored Label */}
              <div style={{ 
                fontSize: 13, 
                fontWeight: 800, 
                color: s.color, 
                marginTop: 12, 
                marginBottom: 16, 
                letterSpacing: '0.5px' 
              }}>
                {s.label}
              </div>
              
              {/* White Pill Note */}
              <div style={{ 
                background: 'white', 
                color: '#4A5568', 
                fontSize: 12, 
                fontWeight: 600, 
                padding: '6px 16px', 
                borderRadius: 20,
                boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
              }}>
                {s.note}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}