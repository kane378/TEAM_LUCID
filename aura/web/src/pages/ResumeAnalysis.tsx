import { useNavigate } from 'react-router-dom'
import type { ResumeAnalysis } from '../types'

export default function ResumeAnalysisPage() {
  const nav = useNavigate()
  const raw = localStorage.getItem('resumeAnalysis')
  const data: ResumeAnalysis | null = raw ? JSON.parse(raw) : null

  if (!data) return (
    <div style={{ textAlign:'center', padding:60 }}>
      <p style={{ color:'#718096' }}>No resume analysis found.</p>
      <button onClick={() => nav('/resume')} style={{ marginTop:12, padding:'8px 20px', background:'#6C63FF', color:'white', border:'none', borderRadius:8, cursor:'pointer', fontWeight:600 }}>
        Upload Resume
      </button>
    </div>
  )

  const score = data.overall_score
  const scoreColor = score >= 80 ? '#38a169' : score >= 60 ? '#d69e2e' : '#e53e3e'

  return (
    <div style={{ maxWidth:820, margin:'30px auto', padding:24 }}>
      <div style={{ textAlign:'center', marginBottom:28 }}>
        <div style={{ fontSize:36 }}>✨</div>
        <h1 style={{ fontSize:26, fontWeight:800, color:'#2d3748' }}>Resume Analysis Complete!</h1>
        <p style={{ color:'#718096', fontSize:13 }}>Here's what we found about your professional profile</p>
      </div>

      {/* Score */}
      <div style={{ background:'white', borderRadius:14, border:`2px solid ${scoreColor}30`, padding:24, textAlign:'center', marginBottom:18, boxShadow:'0 2px 8px rgba(0,0,0,0.04)' }}>
        <div style={{ fontSize:12, fontWeight:700, color:'#718096', marginBottom:6, textTransform:'uppercase', letterSpacing:1 }}>Overall Profile Score</div>
        <div style={{ fontSize:60, fontWeight:800, color:scoreColor, lineHeight:1 }}>{score}%</div>
        <div style={{ color:'#718096', fontSize:13, marginTop:6 }}>
          {score >= 80 ? '🎉 Excellent profile!' : score >= 60 ? '👍 Good profile — a few areas to improve.' : '💪 Keep building — let\'s close those gaps!'}
        </div>
        <div style={{ background:'#f0f0f0', borderRadius:99, height:8, maxWidth:300, margin:'14px auto 0', overflow:'hidden' }}>
          <div style={{ background:scoreColor, height:'100%', width:`${score}%`, borderRadius:99 }} />
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:16 }}>
        {/* Personal Info */}
        <div style={{ background:'white', borderRadius:14, border:'1px solid #e2e8f0', padding:20, boxShadow:'0 2px 8px rgba(0,0,0,0.04)' }}>
          <h3 style={{ fontWeight:700, marginBottom:14, fontSize:15 }}>👤 Personal Information</h3>
          {[['Name', data.name], ['Email', data.email], ['Phone', data.phone], ['Location', data.location]].map(([k, v]) => (
            <div key={k} style={{ marginBottom:8, fontSize:14 }}>
              <span style={{ fontWeight:600, color:'#4a5568' }}>{k}: </span>
              <span style={{ color:'#718096' }}>{v}</span>
            </div>
          ))}
        </div>

        {/* Experience */}
        <div style={{ background:'white', borderRadius:14, border:'1px solid #e2e8f0', padding:20, boxShadow:'0 2px 8px rgba(0,0,0,0.04)' }}>
          <h3 style={{ fontWeight:700, marginBottom:14, fontSize:15 }}>🏢 Experience Summary</h3>
          <div style={{ fontSize:13, marginBottom:8 }}><strong>Soft Skills Found:</strong></div>
          <ul style={{ paddingLeft:18, margin:0 }}>
            {data.experience.slice(0, 5).map((e, i) => (
              <li key={i} style={{ fontSize:13, color:'#718096', marginBottom:4 }}>{e}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Skills */}
      <div style={{ background:'white', borderRadius:14, border:'1px solid #e2e8f0', padding:20, marginBottom:16, boxShadow:'0 2px 8px rgba(0,0,0,0.04)' }}>
        <h3 style={{ fontWeight:700, marginBottom:14, fontSize:15 }}>🛠️ Identified Skills ({data.skills.length})</h3>
        <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
          {data.skills.length > 0
            ? data.skills.map((s, i) => (
                <span key={i} style={{ background:'#ede9fe', color:'#6C63FF', fontSize:12, fontWeight:600, padding:'4px 12px', borderRadius:99 }}>{s}</span>
              ))
            : <span style={{ color:'#a0aec0', fontSize:13 }}>No skills detected. Try a more detailed resume.</span>
          }
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:24 }}>
        {/* Strengths */}
        <div style={{ background:'#f0fff4', borderRadius:14, border:'1px solid #c6f6d5', padding:20 }}>
          <h3 style={{ fontWeight:700, marginBottom:12, color:'#276749', fontSize:15 }}>✅ Key Strengths</h3>
          {data.strengths.map((s, i) => (
            <div key={i} style={{ display:'flex', gap:8, marginBottom:8, fontSize:13, alignItems:'flex-start' }}>
              <span style={{ color:'#38a169', flexShrink:0 }}>✓</span>
              <span style={{ color:'#276749' }}>{s}</span>
            </div>
          ))}
        </div>

        {/* Recommendations */}
        <div style={{ background:'#fffbeb', borderRadius:14, border:'1px solid #fde68a', padding:20 }}>
          <h3 style={{ fontWeight:700, marginBottom:12, color:'#92400e', fontSize:15 }}>💡 Recommendations</h3>
          {data.recommendations.map((r, i) => (
            <div key={i} style={{ display:'flex', gap:8, marginBottom:8, fontSize:13, alignItems:'flex-start' }}>
              <span style={{ color:'#d69e2e', flexShrink:0 }}>•</span>
              <span style={{ color:'#78350f' }}>{r}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ textAlign:'center' }}>
        <button
          onClick={() => nav('/domain')}
          style={{ padding:'12px 36px', background:'linear-gradient(135deg,#6C63FF,#764ba2)', color:'white', border:'none', borderRadius:10, fontSize:15, fontWeight:700, cursor:'pointer' }}
        >
          Continue to Domain Selection →
        </button>
      </div>
    </div>
  )
}