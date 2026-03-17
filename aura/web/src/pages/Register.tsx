import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { User } from '../types'
import { authService } from '../services/auth'

interface Props {
  onRegister: (user: Omit<User, 'email'>) => void
}

export default function Register({ onRegister }: Props) {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const inputStyle: React.CSSProperties = {
    width: '100%', border: '1.5px solid #e2e8f0', borderRadius: 8,
    padding: '10px 14px', fontSize: 14, outline: 'none', fontFamily: 'inherit',
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!firstName || !lastName || !username || !email || !password) { setError('All fields are required'); return }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return }
    if (password !== confirm) { setError('Passwords do not match'); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 700))
    authService.register(username, { firstName, lastName, email, password })
    onRegister({ username, firstName, lastName })
    setLoading(false)
  }

  return (
    <div style={{ minHeight:'100vh', background:'linear-gradient(90deg, #84FFC9, #AAB2FF, #ECA0FF)', display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
      <div style={{ background:'white', borderRadius:20, padding:40, width:'100%', maxWidth:480, boxShadow:'0 20px 60px rgba(0,0,0,0.2)' }}>
        <div style={{ textAlign:'center', marginBottom:24 }}>
          <h1 style={{ fontSize:24, fontWeight:800, color:'#2d3748', marginBottom:4 }}>Create Account</h1>
          <p style={{ color:'#6C63FF', fontSize:11, fontWeight:700, letterSpacing:2, textTransform:'uppercase' }}>Join Aura Today</p>
        </div>

        {error && <div style={{ background:'#fff5f5', border:'1px solid #fed7d7', borderRadius:8, padding:'10px 14px', color:'#e53e3e', fontSize:13, marginBottom:14 }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:12 }}>
            <div>
              <label style={{ fontSize:13, fontWeight:600, color:'#4a5568', display:'block', marginBottom:4 }}>First Name</label>
              <input value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="John" style={inputStyle} />
            </div>
            <div>
              <label style={{ fontSize:13, fontWeight:600, color:'#4a5568', display:'block', marginBottom:4 }}>Last Name</label>
              <input value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Doe" style={inputStyle} />
            </div>
          </div>

          {[
            { label:'Username', val:username, set:setUsername, ph:'johndoe', type:'text' },
            { label:'Email',    val:email,    set:setEmail,    ph:'john@example.com', type:'email' },
          ].map(f => (
            <div key={f.label} style={{ marginBottom:12 }}>
              <label style={{ fontSize:13, fontWeight:600, color:'#4a5568', display:'block', marginBottom:4 }}>{f.label}</label>
              <input type={f.type} value={f.val} onChange={e => f.set(e.target.value)} placeholder={f.ph} style={inputStyle} />
            </div>
          ))}

          <div style={{ marginBottom:12 }}>
            <label style={{ fontSize:13, fontWeight:600, color:'#4a5568', display:'block', marginBottom:4 }}>Password</label>
            <div style={{ position:'relative' }}>
              <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="At least 6 characters" style={{ ...inputStyle, paddingRight:40 }} />
              <button type="button" onClick={() => setShowPw(p => !p)} style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', fontSize:14 }}>
                {showPw ? '🔒' : '🔓'}
              </button>
            </div>
          </div>

          <div style={{ marginBottom:20 }}>
            <label style={{ fontSize:13, fontWeight:600, color:'#4a5568', display:'block', marginBottom:4 }}>Confirm Password</label>
            <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="Repeat password" style={inputStyle} />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ width:'100%', padding:'12px 0', background:'linear-gradient(135deg,#6C63FF,#764ba2)', color:'white', border:'none', borderRadius:8, fontSize:15, fontWeight:700, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.8 : 1 }}
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p style={{ textAlign:'center', marginTop:16, fontSize:13, color:'#718096' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color:'#6C63FF', fontWeight:700, textDecoration:'none' }}>Sign in here</Link>
        </p>
      </div>
    </div>
  )
}