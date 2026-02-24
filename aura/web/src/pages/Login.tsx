import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { User } from '../types'
import { authService } from '../services/auth'

interface Props {
  onLogin: (user: User) => void
}

export default function Login({ onLogin }: Props) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!username || !password) { 
      setError('Please fill in all fields')
      return 
    }
    setError('')
    setLoading(true)
    
    // Simulate API delay
    await new Promise(r => setTimeout(r, 600))
    
    const stored = authService.getRegistered(username)
    
    if (stored) {
      if (stored.password === password) {
        // FIX: Explicitly include the email property here
        onLogin({ 
          username, 
          firstName: stored.firstName, 
          lastName: stored.lastName,
          email: stored.email || username // Ensures email shows in the banner
        })
      } else {
        setError('Invalid password')
      }
    } else {
      // FIX: Ensure guest login also has an email value
      onLogin({ 
        username, 
        firstName: 'John', 
        lastName: 'Doe',
        email: username 
      })
    }
    setLoading(false)
  }

  return (
    <div style={{ minHeight:'100vh', background:'linear-gradient(90deg, #84FFC9, #AAB2FF, #ECA0FF)', display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
      <div style={{ background:'white', borderRadius:20, padding:40, width:'100%', maxWidth:420, boxShadow:'0 20px 60px rgba(0,0,0,0.2)' }}>
        <div style={{ textAlign:'center', marginBottom:28 }}>
          <div style={{ fontSize:48, marginBottom:8 }}>💡</div>
          <h1 style={{ fontSize:26, fontWeight:800, color:'#2d3748', marginBottom:4 }}>AURA</h1>
          <p style={{ color:'#6C63FF', fontSize:11, fontWeight:700, letterSpacing:2, textTransform:'uppercase' }}>AI Career Agent</p>
          <p style={{ color:'#718096', fontSize:13, marginTop:8 }}>Welcome back! Ready to advance your career?</p>
        </div>

        {error && <div style={{ background:'#fff5f5', border:'1px solid #fed7d7', borderRadius:8, padding:'10px 14px', color:'#e53e3e', fontSize:13, marginBottom:16 }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom:14 }}>
            <label style={{ fontSize:13, fontWeight:600, color:'#4a5568', display:'block', marginBottom:5 }}>Username</label>
            <input
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Enter your username"
              style={{ width:'100%', border:'1.5px solid #e2e8f0', borderRadius:8, padding:'10px 14px', fontSize:14, outline:'none', fontFamily:'inherit' }}
            />
          </div>
          <div style={{ marginBottom:22 }}>
            <label style={{ fontSize:13, fontWeight:600, color:'#4a5568', display:'block', marginBottom:5 }}>Password</label>
            <div style={{ position:'relative' }}>
              <input
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter your password"
                style={{ width:'100%', border:'1.5px solid #e2e8f0', borderRadius:8, padding:'10px 40px 10px 14px', fontSize:14, outline:'none', fontFamily:'inherit' }}
              />
              <button
                type="button"
                onClick={() => setShowPw(p => !p)}
                style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', fontSize:16 }}
              >
                {showPw ? '🔒' : '🔓'}
              </button>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{ width:'100%', padding:'12px 0', background:'linear-gradient(135deg,#6C63FF,#764ba2)', color:'white', border:'none', borderRadius:8, fontSize:15, fontWeight:700, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.8 : 1 }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p style={{ textAlign:'center', marginTop:18, fontSize:13, color:'#718096' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color:'#6C63FF', fontWeight:700, textDecoration:'none' }}>Sign up here</Link>
        </p>
      </div>
    </div>
  )
}