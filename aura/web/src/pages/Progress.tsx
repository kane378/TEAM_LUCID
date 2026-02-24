import { useProgress } from '../hooks/useProgress'
import Spinner from '../components/Spinner'

export default function Progress() {
  const { data, loading, error } = useProgress()

  if (loading) return <Spinner message="Loading your progress..." />
  if (error || !data) return (
    <div style={{ textAlign:'center', padding:60 }}>
      <p style={{ color:'#e53e3e', marginBottom:8 }}>Failed to load progress.</p>
      <p style={{ color:'#718096', fontSize:13 }}>Make sure the backend is running at http://127.0.0.1:8000</p>
    </div>
  )

  return (
    <div style={{ maxWidth:900, margin:'30px auto', padding:24 }}>
      <div style={{ textAlign:'center', marginBottom:24 }}>
        <h1 style={{ fontSize:24, fontWeight:800, color:'#2d3748' }}>📈 Your Learning Progress</h1>
        <p style={{ color:'#718096', fontSize:13 }}>Track your growth across all activities</p>
      </div>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16, marginBottom:24 }}>
        {[
          { emoji:'❓', label:'Quiz Performance',  value:`${data.quiz_average}%`,       sub:`${data.quizzes_taken} quizzes taken`,       color:'#6C63FF' },
          { emoji:'🎤', label:'Interview Score',   value:`${data.interview_average}%`,   sub:`${data.interviews_taken} interviews done`,  color:'#e53e3e' },
          { emoji:'⚡', label:'Streak Days',       value:data.streak_days,               sub:'Keep it up!',                               color:'#F6AD55' },
        ].map((s, i) => (
          <div key={i} style={{ background:'white', borderRadius:14, border:`1.5px solid ${s.color}20`, padding:20, boxShadow:'0 2px 8px rgba(0,0,0,0.04)' }}>
            <div style={{ display:'flex', gap:12, alignItems:'center' }}>
              <div style={{ background:`${s.color}18`, borderRadius:10, padding:10, fontSize:20 }}>{s.emoji}</div>
              <div>
                <div style={{ fontSize:30, fontWeight:800, color:s.color, lineHeight:1 }}>{s.value}</div>
                <div style={{ fontSize:12, fontWeight:600, color:'#4a5568', marginTop:2 }}>{s.label}</div>
                <div style={{ fontSize:11, color:'#a0aec0' }}>{s.sub}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quiz History */}
      <div style={{ background:'white', borderRadius:14, border:'1px solid #e2e8f0', padding:20, marginBottom:20, boxShadow:'0 2px 8px rgba(0,0,0,0.04)' }}>
        <h3 style={{ fontWeight:700, fontSize:15, marginBottom:16 }}>📊 Quiz History</h3>
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse', minWidth:500 }}>
            <thead>
              <tr style={{ borderBottom:'2px solid #f0f0f0' }}>
                {['Date','Topic','Difficulty','Score','Result'].map(h => (
                  <th key={h} style={{ textAlign:'left', padding:'8px 12px', fontSize:12, fontWeight:700, color:'#718096', textTransform:'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.quiz_history?.map((q: any, i: number) => (
                <tr key={i} style={{ borderBottom:'1px solid #f7fafc' }}>
                  <td style={{ padding:'10px 12px', fontSize:13, color:'#718096' }}>{q.date}</td>
                  <td style={{ padding:'10px 12px', fontSize:13, fontWeight:600 }}>{q.topic}</td>
                  <td style={{ padding:'10px 12px' }}>
                    <span style={{ fontSize:11, fontWeight:700, padding:'3px 8px', borderRadius:6,
                      background: q.difficulty==='Easy'?'#d1fae5':q.difficulty==='Hard'?'#fee2e2':'#fffbeb',
                      color: q.difficulty==='Easy'?'#065f46':q.difficulty==='Hard'?'#991b1b':'#92400e',
                    }}>{q.difficulty}</span>
                  </td>
                  <td style={{ padding:'10px 12px', fontSize:14, fontWeight:800, color: q.score>=60 ? '#38a169' : '#e53e3e' }}>{q.score}%</td>
                  <td style={{ padding:'10px 12px', fontSize:12, color: q.score>=60 ? '#38a169' : '#e53e3e', fontWeight:700 }}>
                    {q.score >= 60 ? '✅ PASS' : '❌ FAIL'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {(!data.quiz_history || data.quiz_history.length === 0) && (
            <p style={{ textAlign:'center', color:'#a0aec0', padding:20, fontSize:13 }}>No quiz history yet. Take a quiz to see results here.</p>
          )}
        </div>
      </div>

      {/* Interview History */}
      <div style={{ background:'white', borderRadius:14, border:'1px solid #e2e8f0', padding:20, boxShadow:'0 2px 8px rgba(0,0,0,0.04)' }}>
        <h3 style={{ fontWeight:700, fontSize:15, marginBottom:16 }}>🎤 Interview Practice History</h3>
        {data.interview_history?.length > 0
          ? data.interview_history.map((iv: any, i: number) => (
              <div key={i} style={{ borderBottom: i < data.interview_history.length-1 ? '1px solid #f0f0f0' : 'none', paddingBottom:14, marginBottom:14 }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:6 }}>
                  <div>
                    <div style={{ fontWeight:700, fontSize:14, textTransform:'capitalize' }}>{iv.job_role}</div>
                    <div style={{ fontSize:12, color:'#718096' }}>{iv.date}</div>
                  </div>
                  <div style={{ fontWeight:800, fontSize:22, color: iv.passed ? '#38a169' : '#e53e3e' }}>{iv.score}%</div>
                </div>
                <div style={{ display:'flex', gap:8 }}>
                  <span style={{ background:'#6C63FF', color:'white', fontSize:11, fontWeight:700, padding:'3px 10px', borderRadius:6 }}>{iv.round}</span>
                  <span style={{ fontSize:12, color:'#718096' }}>{iv.duration}</span>
                  <span style={{ fontSize:12, fontWeight:700, color: iv.passed ? '#38a169' : '#e53e3e' }}>{iv.passed ? '✅ PASSED' : '❌ FAILED'}</span>
                </div>
              </div>
            ))
          : <p style={{ textAlign:'center', color:'#a0aec0', padding:20, fontSize:13 }}>No interview history yet. Practice an interview to see results here.</p>
        }
      </div>
    </div>
  )
}
