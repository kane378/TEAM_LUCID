import { useNavigate } from 'react-router-dom'

const DOMAINS = [
  { emoji:'💻', title:'Information Technology', desc:'Software, data science, AI, and cybersecurity', roles:['Software Engineer','Data Scientist','DevOps Engineer','AI Developer'] },
  { emoji:'💰', title:'Finance & Banking',       desc:'Investment, accounting, fintech, and analysis', roles:['Financial Analyst','Investment Banker','Risk Manager','Accountant'] },
  { emoji:'📢', title:'Sales & Marketing',      desc:'Growth, digital marketing, business development', roles:['Marketing Specialist','Sales Manager','Business Developer','Account Executive'] },
  { emoji:'🏛️', title:'Government & Public',    desc:'Civil services, policy, public administration', roles:['Civil Servant','Policy Analyst','Public Administrator'] },
  { emoji:'🏢', title:'Other Industries',       desc:'Healthcare, education, consulting, and more', roles:['Healthcare Pro','Teacher','Consultant','Operations Manager'] },
]

export default function DomainSelection() {
  const nav = useNavigate()

  const handleSelect = (title: string) => {
    localStorage.setItem('selectedDomain', title)
    nav('/role')
  }

  return (
    <div style={{ maxWidth:900, margin:'40px auto', padding:24 }}>
      <div style={{ textAlign:'center', marginBottom:32 }}>
        <div style={{ fontSize:40 }}>🌐</div>
        <h1 style={{ fontSize:26, fontWeight:800, color:'#2d3748', marginBottom:8 }}>Select Your Domain</h1>
        <p style={{ color:'#718096', maxWidth:480, margin:'0 auto', fontSize:14 }}>
          Choose the industry that aligns with your career goals for targeted job matching.
        </p>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(250px,1fr))', gap:18 }}>
        {DOMAINS.map((d, i) => (
          <div
            key={i}
            onClick={() => handleSelect(d.title)}
            style={{ background:'white', borderRadius:14, border:'2px solid #e2e8f0', padding:24, cursor:'pointer', transition:'all 0.2s', boxShadow:'0 2px 8px rgba(0,0,0,0.04)' }}
            onMouseOver={e => { e.currentTarget.style.borderColor='#6C63FF'; e.currentTarget.style.transform='translateY(-2px)' }}
            onMouseOut={e  => { e.currentTarget.style.borderColor='#e2e8f0'; e.currentTarget.style.transform='none' }}
          >
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10 }}>
              <div style={{ background:'#ede9fe', borderRadius:10, padding:'8px 10px', fontSize:20 }}>{d.emoji}</div>
              <h3 style={{ fontWeight:700, fontSize:14, color:'#2d3748' }}>{d.title}</h3>
            </div>
            <p style={{ fontSize:13, color:'#718096', marginBottom:12 }}>{d.desc}</p>
            <div style={{ fontSize:12, fontWeight:600, color:'#4a5568', marginBottom:8 }}>Popular Roles:</div>
            <div style={{ display:'flex', flexWrap:'wrap', gap:5 }}>
              {d.roles.map((r, j) => (
                <span key={j} style={{ background:'#f7fafc', border:'1px solid #e2e8f0', borderRadius:6, padding:'2px 8px', fontSize:11, color:'#4a5568' }}>{r}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
