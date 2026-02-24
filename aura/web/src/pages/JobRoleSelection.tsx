import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const ROLES = [
  { title:'Software Engineer',   demand:'High',   salary:'₹15-25 LPA', exp:'2-5 yrs', skills:['JavaScript','Python','React','SQL'] },
  { title:'Data Scientist',      demand:'High',   salary:'₹18-30 LPA', exp:'3-6 yrs', skills:['Python','ML','SQL','TensorFlow'] },
  { title:'DevOps Engineer',     demand:'High',   salary:'₹18-28 LPA', exp:'3-7 yrs', skills:['AWS','Docker','Kubernetes','CI/CD'] },
  { title:'Product Manager',     demand:'Medium', salary:'₹20-35 LPA', exp:'4-8 yrs', skills:['Agile','Analytics','Roadmapping','Jira'] },
  { title:'Frontend Developer',  demand:'High',   salary:'₹12-22 LPA', exp:'2-5 yrs', skills:['React','TypeScript','HTML','CSS'] },
  { title:'Full Stack Engineer', demand:'High',   salary:'₹18-30 LPA', exp:'3-6 yrs', skills:['React','Node.js','Python','SQL'] },
  { title:'AI Developer',        demand:'High',   salary:'₹22-40 LPA', exp:'2-6 yrs', skills:['Python','TensorFlow','OpenAI','NLP'] },
  { title:'Financial Analyst',   demand:'Medium', salary:'₹10-20 LPA', exp:'2-5 yrs', skills:['Excel','SQL','Python','Power BI'] },
  { title:'Backend Developer',   demand:'High',   salary:'₹15-28 LPA', exp:'2-5 yrs', skills:['Python','Java','SQL','Docker'] },
  { title:'Data Engineer',       demand:'High',   salary:'₹18-32 LPA', exp:'3-6 yrs', skills:['Python','SQL','Spark','AWS'] },
]

const DEMAND_COLOR: Record<string, string> = { High:'#38a169', Medium:'#d69e2e', Low:'#e53e3e' }

export default function JobRoleSelection() {
  const nav = useNavigate()
  const [search, setSearch] = useState('')

  const filtered = ROLES.filter(r =>
    r.title.toLowerCase().includes(search.toLowerCase()) ||
    r.skills.some(s => s.toLowerCase().includes(search.toLowerCase()))
  )

  const selectRole = (role: typeof ROLES[0]) => {
    localStorage.setItem('selectedJobRole', JSON.stringify(role))
    const analysis = localStorage.getItem('resumeAnalysis')
    const userSkills = analysis ? JSON.parse(analysis).skills : []
    nav('/eligibility', { state: { role, userSkills } })
  }

  return (
    <div style={{ maxWidth:1000, margin:'40px auto', padding:24 }}>
      <div style={{ textAlign:'center', marginBottom:28 }}>
        <div style={{ fontSize:40 }}>🎯</div>
        <h1 style={{ fontSize:26, fontWeight:800, color:'#2d3748', marginBottom:8 }}>Select Your Target Role</h1>
        <p style={{ color:'#718096', fontSize:14 }}>We'll analyze your eligibility and create a personalized learning plan.</p>
      </div>

      <input
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="🔍  Search job roles or skills..."
        style={{ width:'100%', border:'1.5px solid #e2e8f0', borderRadius:10, padding:'11px 16px', fontSize:14, outline:'none', fontFamily:'inherit', marginBottom:24 }}
      />

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:16 }}>
        {filtered.map((role, i) => (
          <div
            key={i}
            onClick={() => selectRole(role)}
            style={{ background:'white', borderRadius:14, border:'2px solid #e2e8f0', padding:20, cursor:'pointer', transition:'all 0.2s', boxShadow:'0 2px 8px rgba(0,0,0,0.04)' }}
            onMouseOver={e => { e.currentTarget.style.borderColor='#6C63FF'; e.currentTarget.style.transform='translateY(-2px)' }}
            onMouseOut={e  => { e.currentTarget.style.borderColor='#e2e8f0'; e.currentTarget.style.transform='none' }}
          >
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:8 }}>
              <h3 style={{ fontWeight:700, fontSize:14, color:'#2d3748' }}>{role.title}</h3>
              <span style={{ background:`${DEMAND_COLOR[role.demand]}20`, color:DEMAND_COLOR[role.demand], fontSize:11, fontWeight:700, padding:'2px 8px', borderRadius:6, whiteSpace:'nowrap', marginLeft:8 }}>
                {role.demand} Demand
              </span>
            </div>
            <div style={{ fontSize:12, color:'#718096', marginBottom:10 }}>
              📅 {role.exp} &nbsp;|&nbsp; 💰 {role.salary}
            </div>
            <div style={{ display:'flex', flexWrap:'wrap', gap:5 }}>
              {role.skills.map((s, j) => (
                <span key={j} style={{ background:'#ede9fe', color:'#6C63FF', fontSize:11, fontWeight:600, padding:'3px 9px', borderRadius:99 }}>{s}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
