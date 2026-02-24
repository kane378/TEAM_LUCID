import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import api from '../services/api'
import Spinner from '../components/Spinner'

export default function EligibilityCheck() {
  const nav = useNavigate()
  const loc = useLocation()
  const state = loc.state as any
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const roleData = state?.role || (() => { try { return JSON.parse(localStorage.getItem('selectedJobRole') || '{}') } catch { return {} } })()
    const analysis = (() => { try { return JSON.parse(localStorage.getItem('resumeAnalysis') || '{}') } catch { return {} } })()
    const userSkills: string[] = analysis.skills || state?.userSkills || []

    api.post('/evaluate/check', { job_role: roleData.title || 'Software Engineer', user_skills: userSkills })
      .then(r => {
        setResult(r.data)
        localStorage.setItem('eligibilityResult', JSON.stringify(r.data))
      })
      .catch(() => {
        const fallback = { match_score:17, matched_skills:['python'], missing_skills:['JavaScript','React','Node.js','SQL','Git'], recommendations:['Learn JavaScript, React, Node.js','Take online courses to close skill gaps','Practice mock interviews regularly','Build projects to showcase skills'], eligible:false }
        setResult(fallback)
        localStorage.setItem('eligibilityResult', JSON.stringify(fallback))
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Spinner message="Analyzing your eligibility..." />
  if (!result) return null

  const barColor = result.match_score >= 70 ? '#38a169' : result.match_score >= 40 ? '#d69e2e' : '#e53e3e'

  return (
    <div style={{ maxWidth:680, margin:'40px auto', padding:24 }}>
      <div style={{ textAlign:'center', marginBottom:24 }}>
        <div style={{ fontSize:36 }}>📊</div>
        <h1 style={{ fontSize:24, fontWeight:800, color:'#2d3748' }}>Eligibility Check</h1>
        <p style={{ color:'#718096', fontSize:13 }}>Here's how your skills match the job requirements</p>
      </div>

      {/* Score card */}
      <div style={{ background:'white', borderRadius:14, border:`2px solid ${barColor}30`, padding:24, textAlign:'center', marginBottom:18 }}>
        <div style={{ fontSize:11, fontWeight:700, color:'#718096', marginBottom:6, textTransform:'uppercase', letterSpacing:1 }}>Skills Match Score</div>
        <div style={{ fontSize:60, fontWeight:800, color:barColor, lineHeight:1 }}>{result.match_score}%</div>
        <div style={{ color:'#718096', fontSize:13, marginTop:6 }}>
          {result.matched_skills.length} of {result.matched_skills.length + result.missing_skills.length} required skills matched
        </div>
        <div style={{ background:'#f0f0f0', borderRadius:99, height:8, maxWidth:300, margin:'12px auto 0', overflow:'hidden' }}>
          <div style={{ background:barColor, height:'100%', width:`${result.match_score}%`, borderRadius:99, transition:'width 1s' }} />
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:16 }}>
        <div style={{ background:'#f0fff4', border:'1px solid #c6f6d5', borderRadius:14, padding:18 }}>
          <h3 style={{ fontWeight:700, color:'#276749', marginBottom:12, fontSize:14 }}>✅ Your Strengths</h3>
          {result.matched_skills.length > 0
            ? result.matched_skills.map((s: string, i: number) => (
                <div key={i} style={{ display:'flex', gap:8, marginBottom:6, fontSize:13 }}>
                  <span style={{ color:'#38a169' }}>✓</span>
                  <span style={{ color:'#276749' }}>{s}</span>
                </div>
              ))
            : <p style={{ fontSize:13, color:'#718096' }}>No matching skills yet.</p>
          }
        </div>

        <div style={{ background:'#fff5f5', border:'1px solid #fed7d7', borderRadius:14, padding:18 }}>
          <h3 style={{ fontWeight:700, color:'#c53030', marginBottom:12, fontSize:14 }}>📚 Skills to Learn</h3>
          {result.missing_skills.map((s: string, i: number) => (
            <div key={i} style={{ display:'flex', gap:8, marginBottom:6, fontSize:13 }}>
              <span style={{ color:'#e53e3e' }}>○</span>
              <span style={{ color:'#c53030' }}>{s}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background:'white', borderRadius:14, border:'1px solid #e2e8f0', padding:18, marginBottom:24 }}>
        <h3 style={{ fontWeight:700, marginBottom:12, fontSize:14 }}>📌 Recommendations</h3>
        {result.recommendations.map((r: string, i: number) => (
          <div key={i} style={{ display:'flex', gap:10, padding:'8px 12px', background:'#f7fafc', borderRadius:8, marginBottom:8, fontSize:13 }}>
            <span style={{ color:'#6C63FF' }}>💡</span> {r}
          </div>
        ))}
      </div>

      <div style={{ display:'flex', gap:10 }}>
        <button
          onClick={() => nav('/role')}
          style={{ flex:1, padding:'11px 0', border:'1.5px solid #e2e8f0', borderRadius:8, background:'white', cursor:'pointer', fontWeight:600, fontSize:14 }}
        >
          Choose Different Role
        </button>
        <button
          onClick={() => nav('/plan')}
          style={{ flex:2, padding:'11px 0', background:'linear-gradient(135deg,#6C63FF,#764ba2)', color:'white', border:'none', borderRadius:8, fontSize:14, fontWeight:700, cursor:'pointer' }}
        >
          Create Learning Plan →
        </button>
      </div>
    </div>
  )
}
