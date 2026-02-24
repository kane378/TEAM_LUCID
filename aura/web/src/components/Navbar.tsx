import { Link, useLocation } from 'react-router-dom'

export default function Navbar({ user, onLogout }) {
  const loc = useLocation()
  const hoverTransition = 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
  const BRAND_COLOR = '#E95D3C'

  const NAV_ITEMS = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/resume', label: 'Resume' },
    { to: '/domain', label: 'Evaluate' },
    { to: '/plan', label: 'Plan' },
    { to: '/quiz', label: 'Quiz' },
    { to: '/interview', label: 'Interview' },
    { to: '/jobs', label: 'Jobs' },
    { to: '/progress', label: 'Progress' },
  ]

  return (
    <nav style={{
      background: '#010101',
      borderBottom: '1px solid #2d2d2d',
      display: 'flex',
      alignItems: 'center',
      padding: '0 24px',
      height: '64px',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      width: '100%',
      zIndex: 9999,
      boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
      boxSizing: 'border-box'
    }}>
      {/* LOGO */}
      <Link 
        to="/dashboard" 
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 8, 
          marginRight: 12, 
          textDecoration: 'none', 
          flexShrink: 0,
          transition: hoverTransition 
        }}
        onMouseOver={e => {
          e.currentTarget.style.transform = 'scale(1.05)';
          e.currentTarget.style.filter = `drop-shadow(0 0 8px ${BRAND_COLOR}88)`;
        }}
        onMouseOut={e => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.filter = 'none';
        }}
      >
        <span style={{ fontSize: 24 }}>💡</span>
        <span style={{ fontWeight: 900, fontSize: 18, color: BRAND_COLOR, letterSpacing: '1px' }}>AURA</span>
      </Link>

      <div style={{ width: '1px', height: '24px', background: '#333', margin: '0 12px' }} />

      {/* NAV LINKS */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, flex: 1, overflowX: 'auto' }}>
        {NAV_ITEMS.map(({ to, label }) => {
          const active = loc.pathname === to
          return (
            <Link 
              key={to} 
              to={to} 
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '6px 14px',
                borderRadius: 8,
                textDecoration: 'none',
                fontSize: 14,
                fontWeight: 700,
                whiteSpace: 'nowrap',
                color: active ? BRAND_COLOR : '#a0aec0',
                background: active ? `${BRAND_COLOR}15` : 'transparent',
                border: active ? `1.5px solid ${BRAND_COLOR}` : '1.5px solid transparent',
                transition: hoverTransition
              }}
              onMouseOver={e => {
                if (!active) {
                  e.currentTarget.style.color = '#fff';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                }
              }}
              onMouseOut={e => {
                if (!active) {
                  e.currentTarget.style.color = '#a0aec0';
                  e.currentTarget.style.background = 'transparent';
                }
              }}
            >
              {label}
            </Link>
          )
        })}
      </div>

      <div style={{ width: '1px', height: '24px', background: '#333', margin: '0 12px' }} />

      {/* USER & LOGOUT */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: '#f7fafc' }}>
          {user?.firstName}
        </div>
        
        <button 
          onClick={onLogout} 
          style={{ 
            padding: '6px 16px', 
            border: '1px solid #333', 
            borderRadius: 8, 
            background: 'transparent', 
            cursor: 'pointer', 
            fontSize: 13, 
            color: '#a0aec0', 
            fontWeight: 700,
            transition: hoverTransition,
          }}
          onMouseOver={e => {
            e.currentTarget.style.borderColor = '#ff4d4d';
            e.currentTarget.style.color = '#ff4d4d';
            e.currentTarget.style.background = 'rgba(255, 77, 77, 0.05)';
          }}
          onMouseOut={e => {
            e.currentTarget.style.borderColor = '#333';
            e.currentTarget.style.color = '#a0aec0';
            e.currentTarget.style.background = 'transparent';
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  )
}