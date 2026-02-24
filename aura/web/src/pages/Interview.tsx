import { useState, useRef } from 'react'
import api from '../services/api'

const ROUNDS = [
  { id:'technical',  label:'Technical Round',  emoji:'🖥️', questions:5, pass:60 },
  { id:'managerial', label:'Managerial Round', emoji:'📊', questions:4, pass:60 },
  { id:'hr',         label:'HR Round',          emoji:'👥', questions:4, pass:60 },
]

type Stage = 'setup' | 'running' | 'done'

export default function Interview() {
  const [jobRole, setJobRole] = useState('')
  const [mode, setMode] = useState<'text'|'voice'>('text')
  const [stage, setStage] = useState<Stage>('setup')
  const [roundIdx, setRoundIdx] = useState(0)
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [qNum, setQNum] = useState(0)
  const [totalQ, setTotalQ] = useState(0)
  const [scores, setScores] = useState<number[]>([])
  const [latestFeedback, setLatestFeedback] = useState('')
  const [roundResults, setRoundResults] = useState<{round:string;score:number;passed:boolean}[]>([])
  const [listening, setListening] = useState(false)
  const recognitionRef = useRef<any>(null)

  const startInterview = async () => {
    if (!jobRole.trim()) { alert('Please enter a job role'); return }
    try {
      const res = await api.post('/interview/start', { job_role: jobRole, round: ROUNDS[0].id })
      setQuestion(res.data.question)
      setTotalQ(res.data.total_questions)
      setQNum(1)
      setRoundIdx(0)
      setScores([])
      setLatestFeedback('')
      setRoundResults([])
      setStage('running')
    } catch (e: any) {
      alert('Failed to start: ' + e.message)
    }
  }

  const sendAnswer = async () => {
    if (!answer.trim()) return
    const currentRound = ROUNDS[roundIdx]
    try {
      const res = await api.post('/interview/answer', {
        job_role: jobRole, round: currentRound.id,
        question, answer, question_number: qNum,
      })
      const newScores = [...scores, res.data.score]
      setScores(newScores)
      setLatestFeedback(res.data.feedback)
      setAnswer('')

      if (res.data.round_complete) {
        const avg = Math.round(newScores.reduce((a, b) => a + b, 0) / newScores.length)
        const passed = avg >= currentRound.pass
        const newResults = [...roundResults, { round: currentRound.label, score: avg, passed }]
        setRoundResults(newResults)
        api.post('/progress/interview/save', { job_role: jobRole, round: currentRound.id.toUpperCase(), score: avg, duration: '2m 0s', passed }).catch(() => {})

        if (roundIdx < ROUNDS.length - 1) {
          const nextRound = ROUNDS[roundIdx + 1]
          const nextRes = await api.post('/interview/start', { job_role: jobRole, round: nextRound.id })
          setRoundIdx(p => p + 1)
          setQuestion(nextRes.data.question)
          setQNum(1)
          setTotalQ(nextRes.data.total_questions)
          setScores([])
          setLatestFeedback('')
        } else {
          setStage('done')
        }
      } else {
        setQuestion(res.data.next_question)
        setQNum(p => p + 1)
      }
    } catch (e: any) {
      alert('Error: ' + e.message)
    }
  }

  const toggleVoice = () => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SR) { alert('Voice input not supported in this browser. Try Chrome.'); return }
    if (listening) { recognitionRef.current?.stop(); setListening(false); return }
    const rec = new SR()
    rec.continuous = true
    rec.interimResults = true
    rec.onresult = (e: any) => {
      const transcript = Array.from(e.results).map((r: any) => r[0].transcript).join('')
      setAnswer(transcript)
    }
    rec.onend = () => setListening(false)
    rec.start()
    recognitionRef.current = rec
    setListening(true)
  }

  // DONE screen
  if (stage === 'done') return (
    <div style={{ maxWidth:640, margin:'40px auto', padding:24 }}>
      <div style={{ textAlign:'center', marginBottom:24 }}>
        <div style={{ fontSize:48 }}>🎉</div>
        <h1 style={{ fontSize:26, fontWeight:800, marginBottom:4 }}>Interview Complete!</h1>
        <p style={{ color:'#718096', fontSize:13 }}>Here's your performance across all rounds</p>
      </div>

      {roundResults.map((r, i) => (
        <div key={i} style={{ background: r.passed ? '#f0fff4' : '#fff5f5', border:`1.5px solid ${r.passed ? '#c6f6d5' : '#fed7d7'}`, borderRadius:12, padding:18, marginBottom:12 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <div style={{ fontWeight:700, fontSize:15 }}>{r.round}</div>
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <span style={{ fontWeight:800, fontSize:22, color: r.passed ? '#38a169' : '#e53e3e' }}>{r.score}%</span>
              <span style={{ fontSize:13, fontWeight:700, color: r.passed ? '#38a169' : '#e53e3e' }}>{r.passed ? '✅ PASSED' : '❌ FAILED'}</span>
            </div>
          </div>
        </div>
      ))}

      <div style={{ background:'white', borderRadius:12, border:'1px solid #e2e8f0', padding:18, marginTop:20 }}>
        <h3 style={{ fontWeight:700, marginBottom:10, fontSize:14 }}>💡 Key Takeaways</h3>
        <p style={{ fontSize:13, color:'#718096', marginBottom:6 }}>• Focus on elaborating answers with specific examples and measurable results.</p>
        <p style={{ fontSize:13, color:'#718096', marginBottom:6 }}>• Use the STAR method: Situation, Task, Action, Result.</p>
        <p style={{ fontSize:13, color:'#718096' }}>• Keep practicing to improve confidence and response quality.</p>
      </div>

      <div style={{ textAlign:'center', marginTop:20 }}>
        <button onClick={() => setStage('setup')} style={{ padding:'11px 32px', background:'linear-gradient(135deg,#6C63FF,#764ba2)', color:'white', border:'none', borderRadius:10, fontSize:14, fontWeight:700, cursor:'pointer' }}>
          Practice Again
        </button>
      </div>
    </div>
  )

  // SETUP screen
  if (stage === 'setup') return (
    <div style={{ maxWidth:560, margin:'50px auto', padding:24 }}>
      <div style={{ textAlign:'center', marginBottom:24 }}>
        <div style={{ fontSize:40 }}>🎤</div>
        <h1 style={{ fontSize:24, fontWeight:800, color:'#2d3748' }}>Mock Interview</h1>
        <p style={{ color:'#718096', fontSize:13 }}>Practice across 3 rounds with real interview questions</p>
      </div>

      <div style={{ background:'white', borderRadius:14, border:'1px solid #e2e8f0', padding:24 }}>
        <div style={{ marginBottom:16 }}>
          <label style={{ fontSize:13, fontWeight:600, color:'#4a5568', display:'block', marginBottom:6 }}>Target Job Role</label>
          <input
            value={jobRole}
            onChange={e => setJobRole(e.target.value)}
            placeholder="e.g. Software Engineer, Data Scientist"
            style={{ width:'100%', border:'1.5px solid #e2e8f0', borderRadius:8, padding:'10px 14px', fontSize:14, outline:'none', fontFamily:'inherit' }}
          />
        </div>

        <div style={{ marginBottom:18 }}>
          <label style={{ fontSize:13, fontWeight:600, color:'#4a5568', display:'block', marginBottom:8 }}>Interview Mode</label>
          <div style={{ display:'flex', gap:8 }}>
            {(['text','voice'] as const).map(m => (
              <button key={m} onClick={() => setMode(m)} style={{ flex:1, padding:'10px 0', border:'1.5px solid', borderColor: mode===m ? '#6C63FF' : '#e2e8f0', borderRadius:8, fontWeight:700, fontSize:13, background: mode===m ? '#ede9fe' : 'white', color: mode===m ? '#6C63FF' : '#4a5568', cursor:'pointer' }}>
                {m === 'text' ? '💬 Text Mode' : '🎤 Voice Mode'}
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom:20 }}>
          {ROUNDS.map((r, i) => (
            <div key={i} style={{ border:`1.5px solid ${i===0?'#6C63FF':i===1?'#d69e2e':'#38a169'}20`, borderRadius:10, padding:12, marginBottom:8, background:`${i===0?'#ede9fe':i===1?'#fffbeb':'#f0fff4'}` }}>
              <div style={{ fontWeight:700, fontSize:13, color: i===0?'#6C63FF':i===1?'#d69e2e':'#38a169' }}>{r.emoji} {r.label}</div>
              <div style={{ fontSize:12, color:'#718096' }}>{r.questions} questions • Pass: {r.pass}%</div>
            </div>
          ))}
        </div>

        <button onClick={startInterview} style={{ width:'100%', padding:'12px 0', background:'linear-gradient(135deg,#6C63FF,#764ba2)', color:'white', border:'none', borderRadius:8, fontSize:15, fontWeight:700, cursor:'pointer' }}>
          Start Interview →
        </button>
      </div>
    </div>
  )

  // RUNNING screen
  const currentRound = ROUNDS[roundIdx]
  return (
    <div style={{ maxWidth:680, margin:'30px auto', padding:24 }}>
      {/* Round tabs */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10, marginBottom:20 }}>
        {ROUNDS.map((r, i) => (
          <div key={i} style={{ border:`1.5px solid ${i===roundIdx?'#6C63FF':'#e2e8f0'}`, borderRadius:10, padding:12, textAlign:'center', background: i===roundIdx ? '#ede9fe' : 'white' }}>
            <div style={{ fontSize:18 }}>{r.emoji}</div>
            <div style={{ fontWeight:700, fontSize:12, color: i===roundIdx ? '#6C63FF' : '#4a5568', marginTop:4 }}>{r.label}</div>
            {i === roundIdx && <div style={{ fontSize:10, fontWeight:700, color:'#6C63FF', marginTop:3 }}>IN PROGRESS</div>}
          </div>
        ))}
      </div>

      <div style={{ background:'white', borderRadius:14, border:'1px solid #e2e8f0', padding:24 }}>
        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:16 }}>
          <span style={{ fontWeight:700, fontSize:14 }}>{currentRound.emoji} {currentRound.label}</span>
          <span style={{ fontSize:13, color:'#718096' }}>Q {qNum} of {totalQ}</span>
        </div>

        <div style={{ background:'#f7fafc', border:'1.5px solid #e2e8f0', borderRadius:10, padding:14, marginBottom:14 }}>
          <span style={{ fontWeight:700, color:'#4a5568' }}>Interviewer: </span>
          <span style={{ color:'#2d3748', fontSize:15 }}>{question}</span>
        </div>

        {latestFeedback && (
          <div style={{ background:'#f0fff4', border:'1px solid #c6f6d5', borderRadius:10, padding:12, marginBottom:12, fontSize:13, color:'#276749' }}>
            💡 <strong>Feedback:</strong> {latestFeedback}
          </div>
        )}

        <textarea
          value={answer}
          onChange={e => setAnswer(e.target.value)}
          placeholder="Type your answer here..."
          rows={4}
          style={{ width:'100%', border:'1.5px solid #e2e8f0', borderRadius:8, padding:'10px 14px', fontSize:14, outline:'none', fontFamily:'inherit', resize:'vertical', marginBottom:12 }}
        />

        <div style={{ display:'flex', gap:10 }}>
          {mode === 'voice' && (
            <button
              onClick={toggleVoice}
              style={{ display:'flex', alignItems:'center', gap:6, padding:'10px 16px', border:'none', borderRadius:8, background: listening ? '#e53e3e' : '#38a169', color:'white', fontWeight:700, cursor:'pointer', fontSize:13 }}
            >
              {listening ? '🛑 Stop' : '🎤 Listen'}
            </button>
          )}
          <button
            onClick={sendAnswer}
            disabled={!answer.trim()}
            style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:6, padding:'10px 20px', background: !answer.trim() ? '#a0aec0' : 'linear-gradient(135deg,#6C63FF,#764ba2)', color:'white', border:'none', borderRadius:8, fontWeight:700, cursor: !answer.trim() ? 'not-allowed' : 'pointer', fontSize:13 }}
          >
            Send Answer →
          </button>
        </div>
      </div>
    </div>
  )
}
