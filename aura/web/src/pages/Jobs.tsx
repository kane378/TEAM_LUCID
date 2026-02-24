import { useState } from 'react'
import api from '../services/api'

const LOCATIONS = ['Nationwide','Remote','Bangalore','Mumbai','Delhi NCR','Hyderabad','Pune','Chennai']
const TYPES = ['All Types','Full-time','Part-time','Contract','Remote']

export default function Jobs() {
  const stored = (() => { try { return JSON.parse(localStorage.getItem('resumeAnalysis') || '{}') } catch { return {} } })()
  const [skillsInput, setSkillsInput] = useState((stored.skills || []).join(', '))
  const [location, setLocation] = useState('Nationwide')
  const [jobType, setJobType] = useState('All Types')
  const [results, setResults] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const search = async () => {
    if (!skillsInput.trim()) { alert('Please enter at least one skill'); return }
    setLoading(true)
    try {
      const skills = skillsInput.split(',').map(s => s.trim()).filter(Boolean)
      const res = await api.post('/jobs/search', { skills, location, job_type: jobType })
      setResults(res.data)
    } catch (e: any) {
      alert('Search failed: ' + e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth:1000, margin:'30px auto', padding:24 }}>
      <h1 style={{ fontSize:24, fontWeight:800, color:'#2d3748', marginBottom:4 }}>💼 Job Opportunities</h1>
      <p style={{ color:'#718096', fontSize:13, marginBottom:20 }}>Find jobs matching your skills from Naukri and LinkedIn</p>

      <div style={{ background:'white', borderRadius:14, border:'1px solid #e2e8f0', padding:20, marginBottom:24 }}>
        <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr', gap:12, marginBottom:12 }}>
          <div>
            <label style={{ fontSize:12, fontWeight:600, color:'#4a5568', display:'block', marginBottom:4 }}>Your Skills (comma separated)</label>
            <input value={skillsInput} onChange={e => setSkillsInput(e.target.value)} placeholder="python, react, sql..." style={{ width:'100%', border:'1.5px solid #e2e8f0', borderRadius:8, padding:'10px 14px', fontSize:14, outline:'none' }} />
          </div>
          <div>
            <label style={{ fontSize:12, fontWeight:600, color:'#4a5568', display:'block', marginBottom:4 }}>Location</label>
            <select value={location} onChange={e => setLocation(e.target.value)} style={{ width:'100%', border:'1.5px solid #e2e8f0', borderRadius:8, padding:'10px 14px', fontSize:14, outline:'none' }}>
              {LOCATIONS.map(l => <option key={l}>{l}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize:12, fontWeight:600, color:'#4a5568', display:'block', marginBottom:4 }}>Job Type</label>
            <select value={jobType} onChange={e => setJobType(e.target.value)} style={{ width:'100%', border:'1.5px solid #e2e8f0', borderRadius:8, padding:'10px 14px', fontSize:14, outline:'none' }}>
              {TYPES.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
        </div>
        <button onClick={search} disabled={loading} style={{ width:'100%', padding:'11px 0', background: loading ? '#a0aec0' : 'linear-gradient(135deg,#6C63FF,#764ba2)', color:'white', border:'none', borderRadius:8, fontSize:14, fontWeight:700, cursor: loading ? 'not-allowed' : 'pointer' }}>
          {loading ? 'Searching...' : '🔍 Search Jobs'}
        </button>
      </div>

      {results && (
        <>
          <div style={{ marginBottom:16 }}>
            <h2 style={{ fontWeight:700, fontSize:18 }}>Found {results.total} Jobs</h2>
            <p style={{ fontSize:13, color:'#6C63FF' }}>Skills: {skillsInput}</p>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(290px,1fr))', gap:16 }}>
            {results.jobs?.map((job: any, i: number) => {
              const matchColor = job.match_score >= 70 ? '#38a169' : job.match_score >= 40 ? '#d69e2e' : '#e53e3e'
              return (
                <div key={i} style={{ background:'white', borderRadius:14, border:'1px solid #e2e8f0', padding:20, display:'flex', flexDirection:'column', boxShadow:'0 2px 8px rgba(0,0,0,0.04)' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:8 }}>
                    <h3 style={{ fontWeight:700, fontSize:14, color:'#2d3748' }}>{job.title}</h3>
                    <span style={{ background:`${matchColor}20`, color:matchColor, fontSize:11, fontWeight:700, padding:'2px 8px', borderRadius:6, whiteSpace:'nowrap', marginLeft:8 }}>⭐ {job.match_score}%</span>
                  </div>
                  <div style={{ fontSize:13, color:'#718096', marginBottom:4 }}>🏢 {job.company}</div>
                  <div style={{ fontSize:12, color: job.platform==='Naukri' ? '#e85d04' : '#0077b5', fontWeight:600, marginBottom:4 }}>
                    {job.platform==='Naukri' ? '🟠' : '🔵'} {job.platform}
                  </div>
                  <div style={{ fontSize:12, color:'#718096', marginBottom:4 }}>📍 {job.location} &nbsp;|&nbsp; ⏱ {job.type}</div>
                  <div style={{ fontSize:13, fontWeight:700, color:'#d69e2e', marginBottom:8 }}>💰 {job.salary}</div>
                  <div style={{ display:'flex', flexWrap:'wrap', gap:5, marginBottom:14, flex:1 }}>
                    {job.skills_required?.map((s: string, j: number) => (
                      <span key={j} style={{ background:'#f7fafc', border:'1px solid #e2e8f0', fontSize:11, padding:'2px 7px', borderRadius:99, color:'#4a5568' }}>{s}</span>
                    ))}
                  </div>
                  <a href={job.apply_url} target="_blank" rel="noopener noreferrer" style={{ display:'block', textAlign:'center', padding:'10px 0', background:'linear-gradient(135deg,#6C63FF,#764ba2)', color:'white', borderRadius:8, textDecoration:'none', fontWeight:700, fontSize:13 }}>
                    Apply Now ↗
                  </a>
                </div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
