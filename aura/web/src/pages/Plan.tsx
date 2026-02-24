import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import Spinner from '../components/Spinner'

export default function Plan() {
  const nav = useNavigate()
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const eligibility = (() => { try { return JSON.parse(localStorage.getItem('eligibilityResult') || '{}') } catch { return {} } })()
    const roleObj = (() => { try { return JSON.parse(localStorage.getItem('selectedJobRole') || '{}') } catch { return { title:'Software Engineer' } } })()
    const analysis = (() => { try { return JSON.parse(localStorage.getItem('resumeAnalysis') || '{}') } catch { return {} } })()

    api.post('/plan/generate', {
      job_role: roleObj.title || 'Software Engineer',
      missing_skills: eligibility.missing_skills || ['JavaScript','React','Node.js','SQL'],
      user_skills: analysis.skills || [],
    })
    .then(r => setResult(r.data))
    .catch(e => setError(e.message || 'Failed to load plan'))
    .finally(() => setLoading(false))
  }, [])

  if (loading) return <Spinner message="Generating your personalized learning plan..." />
  if (error) return (
    <div style={{ textAlign:'center', padding:60 }}>
      <p style={{ color:'#e53e3e', marginBottom:12 }}>{error}</p>
      <p style={{ color:'#718096', fontSize:13 }}>Make sure the backend is running at http://127.0.0.1:8000</p>
    </div>
  )
  if (!result) return null

  return (
    <div style={{ maxWidth:860, margin:'30px auto', padding:24 }}>
      <div style={{ background:'linear-gradient(135deg,#ede9fe,#f5f3ff)', borderRadius:14, padding:'20px 24px', marginBottom:24, display:'flex', alignItems:'center', gap:14 }}>
        <div style={{ fontSize:36 }}>📅</div>
        <div>
          <h2 style={{ fontWeight:800, fontSize:20, color:'#2d3748', marginBottom:2 }}>{result.duration}</h2>
          <p style={{ color:'#718096', fontSize:13 }}>Personalized plan for: <strong>{result.job_role}</strong></p>
        </div>
      </div>

      {result.weeks?.map((week: any, i: number) => (
        <div key={i} style={{ background:'white', borderRadius:14, border:'1px solid #e2e8f0', padding:22, marginBottom:18, boxShadow:'0 2px 8px rgba(0,0,0,0.04)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:14 }}>
            <div style={{ background:'#6C63FF', color:'white', borderRadius:8, padding:'5px 14px', fontWeight:800, fontSize:13, flexShrink:0 }}>
              Week {week.week}
            </div>
            <div>
              <div style={{ fontWeight:700, fontSize:16 }}>{week.skill}</div>
              <div style={{ fontSize:12, color:'#718096' }}>{week.description}</div>
            </div>
          </div>

          {/* Tasks */}
          <div style={{ marginBottom:14 }}>
            <div style={{ fontSize:13, fontWeight:700, color:'#4a5568', marginBottom:8 }}>🎯 Weekly Tasks</div>
            <ul style={{ paddingLeft:20, margin:0 }}>
              {week.tasks?.map((t: string, j: number) => (
                <li key={j} style={{ fontSize:13, color:'#718096', marginBottom:4 }}>{t}</li>
              ))}
            </ul>
          </div>

          {/* Video */}
          <a
            href={week.video_url}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display:'flex', alignItems:'center', gap:12, background:'#f7fafc', border:'1.5px solid #e2e8f0', borderRadius:10, padding:14, marginBottom:14, textDecoration:'none' }}
          >
            <div style={{ background:'#e53e3e', borderRadius:8, padding:'8px 12px', color:'white', fontSize:16, flexShrink:0 }}>▶</div>
            <div style={{ flex:1 }}>
              <div style={{ fontWeight:700, fontSize:13, color:'#2d3748', marginBottom:2 }}>{week.video_title}</div>
              <div style={{ fontSize:12, color:'#718096' }}>📡 {week.video_channel}</div>
            </div>
            <span style={{ fontSize:13, color:'#6C63FF', fontWeight:600 }}>Watch →</span>
          </a>

          {/* Learning Outcomes */}
          <div>
            <div style={{ fontSize:13, fontWeight:700, color:'#4a5568', marginBottom:8 }}>✅ What You'll Learn</div>
            <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
              {week.learning_outcomes?.map((o: string, j: number) => (
                <span key={j} style={{ background:'#f0fff4', border:'1px solid #c6f6d5', color:'#276749', fontSize:12, padding:'3px 10px', borderRadius:99 }}>{o}</span>
              ))}
            </div>
          </div>
        </div>
      ))}

      <div style={{ display:'flex', gap:12, justifyContent:'center', marginTop:8 }}>
        <button
          onClick={() => nav('/quiz')}
          style={{ padding:'11px 28px', background:'linear-gradient(135deg,#6C63FF,#764ba2)', color:'white', border:'none', borderRadius:10, fontSize:14, fontWeight:700, cursor:'pointer' }}
        >
          Test Your Knowledge →
        </button>
        <button
          onClick={() => nav('/interview')}
          style={{ padding:'11px 28px', border:'1.5px solid #6C63FF', borderRadius:10, color:'#6C63FF', background:'white', cursor:'pointer', fontWeight:600, fontSize:14 }}
        >
          Practice Interview
        </button>
      </div>
    </div>
  )
}
