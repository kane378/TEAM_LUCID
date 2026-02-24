import { useState } from 'react'
import api from '../services/api'
import Spinner from '../components/Spinner'
import type { Question, QuizResult } from '../types'

const DOMAINS = ['javascript','python','react','sql','machine learning','docker']

export default function Quiz() {
  const [domain, setDomain] = useState('javascript')
  const [difficulty, setDifficulty] = useState('Easy')
  const [count, setCount] = useState(5)
  const [stage, setStage] = useState<'setup'|'quiz'|'result'>('setup')
  const [questions, setQuestions] = useState<Question[]>([])
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [current, setCurrent] = useState(0)
  const [result, setResult] = useState<QuizResult | null>(null)
  const [loading, setLoading] = useState(false)

  const startQuiz = async () => {
    setLoading(true)
    try {
      const res = await api.post('/quiz/generate', { domain, difficulty, count })
      setQuestions(res.data.questions)
      setAnswers({})
      setCurrent(0)
      setStage('quiz')
    } catch (e: any) {
      alert(e?.response?.data?.detail || 'Failed to load quiz. Is the backend running?')
    } finally {
      setLoading(false)
    }
  }

  const submitQuiz = async () => {
    const answerMap: Record<string, string> = {}
    Object.entries(answers).forEach(([k, v]) => { answerMap[String(k)] = v })
    try {
      const res = await api.post('/quiz/submit', { domain, difficulty, answers: answerMap, questions })
      setResult(res.data)
      setStage('result')
      api.post('/progress/quiz/save', { topic: domain, difficulty, score: res.data.score, total: res.data.total }).catch(() => {})
    } catch (e: any) {
      alert('Submit failed: ' + e.message)
    }
  }

  const reset = () => { setStage('setup'); setResult(null); setQuestions([]); setAnswers({}) }

  if (loading) return <Spinner message="Loading quiz questions..." />

  if (stage === 'setup') return (
    <div style={{ maxWidth:480, margin:'50px auto', padding:24 }}>
      <div style={{ textAlign:'center', marginBottom:24 }}>
        <div style={{ fontSize:40 }}>📚</div>
        <h1 style={{ fontSize:24, fontWeight:800, color:'#2d3748' }}>Take a Quiz</h1>
        <p style={{ color:'#718096', fontSize:13 }}>Test your knowledge with AI-powered questions</p>
      </div>

      <div style={{ background:'white', borderRadius:14, border:'1px solid #e2e8f0', padding:24, boxShadow:'0 2px 8px rgba(0,0,0,0.04)' }}>
        <div style={{ marginBottom:16 }}>
          <label style={{ fontSize:13, fontWeight:600, color:'#4a5568', display:'block', marginBottom:6 }}>📌 Topic</label>
          <select value={domain} onChange={e => setDomain(e.target.value)} style={{ width:'100%', border:'1.5px solid #e2e8f0', borderRadius:8, padding:'10px 14px', fontSize:14, outline:'none' }}>
            {DOMAINS.map(d => <option key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>)}
          </select>
        </div>

        <div style={{ marginBottom:16 }}>
          <label style={{ fontSize:13, fontWeight:600, color:'#4a5568', display:'block', marginBottom:6 }}>⚡ Difficulty</label>
          <div style={{ display:'flex', gap:8 }}>
            {['Easy','Medium','Hard'].map(d => (
              <button
                key={d}
                onClick={() => setDifficulty(d)}
                style={{ flex:1, padding:'9px 0', border:'1.5px solid', borderColor: difficulty===d ? '#6C63FF' : '#e2e8f0', borderRadius:8, fontWeight:700, fontSize:13, background: difficulty===d ? '#ede9fe' : 'white', color: difficulty===d ? '#6C63FF' : '#4a5568', cursor:'pointer' }}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom:22 }}>
          <label style={{ fontSize:13, fontWeight:600, color:'#4a5568', display:'block', marginBottom:6 }}>❓ Questions</label>
          <select value={count} onChange={e => setCount(Number(e.target.value))} style={{ width:'100%', border:'1.5px solid #e2e8f0', borderRadius:8, padding:'10px 14px', fontSize:14, outline:'none' }}>
            {[3,5,10].map(n => <option key={n} value={n}>{n} Questions</option>)}
          </select>
        </div>

        <button
          onClick={startQuiz}
          style={{ width:'100%', padding:'12px 0', background:'linear-gradient(135deg,#6C63FF,#764ba2)', color:'white', border:'none', borderRadius:8, fontSize:15, fontWeight:700, cursor:'pointer' }}
        >
          Start Quiz
        </button>
      </div>
    </div>
  )

  if (stage === 'result' && result) return (
    <div style={{ maxWidth:700, margin:'30px auto', padding:24 }}>
      <div style={{ textAlign:'center', marginBottom:24 }}>
        <div style={{ fontSize:40 }}>🎯</div>
        <h1 style={{ fontSize:24, fontWeight:800 }}>Quiz Complete!</h1>
      </div>

      <div style={{ background:'white', borderRadius:14, border:'1px solid #e2e8f0', padding:24, textAlign:'center', marginBottom:20 }}>
        <div style={{ fontSize:60, fontWeight:800, color: result.percentage >= 60 ? '#38a169' : '#e53e3e' }}>{result.percentage}%</div>
        <div style={{ fontWeight:700, fontSize:16, color:'#2d3748' }}>{result.score} out of {result.total} Correct</div>
        <div style={{ color:'#718096', fontSize:13, marginTop:4 }}>{domain} • {difficulty}</div>
      </div>

      {result.results?.map((r, i) => (
        <div key={i} style={{ background: r.is_correct ? '#f0fff4' : '#fff5f5', border:`1.5px solid ${r.is_correct ? '#c6f6d5' : '#fed7d7'}`, borderRadius:12, padding:16, marginBottom:12 }}>
          <div style={{ display:'flex', gap:8, marginBottom:8 }}>
            <span>{r.is_correct ? '✅' : '❌'}</span>
            <div style={{ fontWeight:600, fontSize:14 }}>Q{r.id}. {r.question}</div>
          </div>
          <div style={{ fontSize:13, paddingLeft:24 }}>
            <div><strong>Your answer:</strong> <span style={{ color: r.is_correct ? '#38a169' : '#e53e3e' }}>{r.user_answer || 'Not answered'}</span></div>
            <div><strong>Correct:</strong> <span style={{ color:'#38a169' }}>{r.correct_answer}</span></div>
            {r.explanation && <div style={{ marginTop:4, color:'#718096', fontStyle:'italic' }}>{r.explanation}</div>}
          </div>
        </div>
      ))}

      <div style={{ textAlign:'center', marginTop:16 }}>
        <button onClick={reset} style={{ padding:'11px 28px', background:'linear-gradient(135deg,#6C63FF,#764ba2)', color:'white', border:'none', borderRadius:10, fontSize:14, fontWeight:700, cursor:'pointer' }}>
          Take Another Quiz
        </button>
      </div>
    </div>
  )

  // Quiz in progress
  const q = questions[current]
  const progress = ((current + 1) / questions.length) * 100

  return (
    <div style={{ maxWidth:620, margin:'40px auto', padding:24 }}>
      <div style={{ display:'flex', justifyContent:'space-between', fontSize:13, color:'#718096', marginBottom:6 }}>
        <span>Question {current + 1} of {questions.length}</span>
        <span>{domain} • {difficulty}</span>
      </div>
      <div style={{ background:'#f0f0f0', borderRadius:99, height:6, marginBottom:22, overflow:'hidden' }}>
        <div style={{ background:'linear-gradient(90deg,#6C63FF,#764ba2)', height:'100%', width:`${progress}%`, transition:'width 0.3s' }} />
      </div>

      <div style={{ background:'white', borderRadius:14, border:'1px solid #e2e8f0', padding:24, marginBottom:16 }}>
        <h3 style={{ fontSize:16, fontWeight:700, color:'#2d3748', marginBottom:20 }}>{q.question}</h3>
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {q.options?.map((opt, i) => (
            <div
              key={i}
              onClick={() => setAnswers(p => ({ ...p, [q.id]: opt }))}
              style={{
                padding:'12px 16px', borderRadius:10, cursor:'pointer', transition:'all 0.15s',
                border: `2px solid ${answers[q.id] === opt ? '#6C63FF' : '#e2e8f0'}`,
                background: answers[q.id] === opt ? '#ede9fe' : 'white',
                color: answers[q.id] === opt ? '#6C63FF' : '#2d3748',
                fontWeight: answers[q.id] === opt ? 700 : 400, fontSize:14,
              }}
            >
              {opt}
            </div>
          ))}
        </div>
      </div>

      <div style={{ display:'flex', justifyContent:'space-between' }}>
        <button
          onClick={() => setCurrent(p => Math.max(0, p - 1))}
          disabled={current === 0}
          style={{ padding:'10px 20px', border:'1.5px solid #e2e8f0', borderRadius:8, background:'white', cursor: current===0 ? 'not-allowed' : 'pointer', fontWeight:600, opacity: current===0 ? 0.5 : 1, fontSize:14 }}
        >
          ← Previous
        </button>
        {current < questions.length - 1
          ? <button onClick={() => setCurrent(p => p + 1)} style={{ padding:'10px 22px', background:'linear-gradient(135deg,#6C63FF,#764ba2)', color:'white', border:'none', borderRadius:8, cursor:'pointer', fontWeight:700, fontSize:14 }}>Next →</button>
          : <button onClick={submitQuiz} style={{ padding:'10px 22px', background:'linear-gradient(135deg,#38a169,#276749)', color:'white', border:'none', borderRadius:8, cursor:'pointer', fontWeight:700, fontSize:14 }}>Submit Quiz ✓</button>
        }
      </div>
    </div>
  )
}
