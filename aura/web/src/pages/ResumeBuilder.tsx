import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const STEPS = ['Personal Info','Education','Experience','Projects','Skills','Generate']

const inputStyle: React.CSSProperties = {
  width:'100%', border:'1.5px solid #e2e8f0', borderRadius:8,
  padding:'10px 14px', fontSize:14, outline:'none', fontFamily:'inherit',
}

const labelStyle: React.CSSProperties = {
  fontSize:13, fontWeight:600, color:'#4a5568', display:'block', marginBottom:5,
}

export default function ResumeBuilder() {
  const nav = useNavigate()
  const [step, setStep] = useState(0)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName]   = useState('')
  const [email, setEmail]         = useState('')
  const [phone, setPhone]         = useState('')
  const [location, setLocation]   = useState('')
  const [summary, setSummary]     = useState('')
  const [education, setEducation] = useState([{ degree:'', institution:'', year:'', gpa:'' }])
  const [experience, setExperience] = useState([{ jobTitle:'', company:'', duration:'', description:'' }])
  const [projects, setProjects]   = useState([{ title:'', description:'', technologies:'', link:'' }])
  const [skills, setSkills]       = useState([''])

  const addEdu  = () => setEducation(p => [...p, { degree:'', institution:'', year:'', gpa:'' }])
  const addExp  = () => setExperience(p => [...p, { jobTitle:'', company:'', duration:'', description:'' }])
  const addProj = () => setProjects(p => [...p, { title:'', description:'', technologies:'', link:'' }])
  const addSkill = () => setSkills(p => [...p, ''])

  const generate = () => {
    const data = { firstName, lastName, email, phone, location, summary, education, experience, projects, skills: skills.filter(Boolean) }
    localStorage.setItem('builtResume', JSON.stringify(data))
    localStorage.setItem('resumeAnalysis', JSON.stringify({
      name: `${firstName} ${lastName}`, email, phone, location,
      skills: skills.filter(Boolean),
      experience: experience.map(e => e.jobTitle).filter(Boolean),
      education: education.map(e => e.degree).filter(Boolean),
      overall_score: 80,
      strengths: ['Profile manually built','All sections completed'],
      recommendations: ['Upload to a real PDF to improve formatting','Add quantified achievements'],
    }))
    nav('/domain')
  }

  return (
    <div style={{ maxWidth:680, margin:'30px auto', padding:24 }}>
      {/* Step indicators */}
      <div style={{ display:'flex', alignItems:'center', marginBottom:30 }}>
        {STEPS.map((s, i) => (
          <div key={i} style={{ display:'flex', alignItems:'center', flex: i < STEPS.length-1 ? 1 : 0 }}>
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center' }}>
              <div style={{ width:30, height:30, borderRadius:'50%', background: i < step ? '#38a169' : i===step ? '#6C63FF' : '#e2e8f0', color: i <= step ? 'white' : '#718096', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontSize:12 }}>
                {i < step ? '✓' : i + 1}
              </div>
              <div style={{ fontSize:10, fontWeight:600, color: i===step ? '#6C63FF' : '#718096', marginTop:3, whiteSpace:'nowrap' }}>{s}</div>
            </div>
            {i < STEPS.length-1 && <div style={{ flex:1, height:2, background: i < step ? '#38a169' : '#e2e8f0', margin:'0 4px', marginBottom:16 }} />}
          </div>
        ))}
      </div>

      <div style={{ background:'white', borderRadius:14, border:'1px solid #e2e8f0', padding:24, boxShadow:'0 2px 8px rgba(0,0,0,0.04)' }}>

        {/* STEP 0 */}
        {step === 0 && (
          <div>
            <h3 style={{ fontWeight:700, marginBottom:18, fontSize:16 }}>👤 Personal Information</h3>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:12 }}>
              <div><label style={labelStyle}>First Name</label><input value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="John" style={inputStyle} /></div>
              <div><label style={labelStyle}>Last Name</label><input value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Doe" style={inputStyle} /></div>
            </div>
            <div style={{ marginBottom:12 }}><label style={labelStyle}>Email</label><input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="john@example.com" style={inputStyle} /></div>
            <div style={{ marginBottom:12 }}><label style={labelStyle}>Phone</label><input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+91 9876543210" style={inputStyle} /></div>
            <div style={{ marginBottom:12 }}><label style={labelStyle}>Location</label><input value={location} onChange={e => setLocation(e.target.value)} placeholder="City, Country" style={inputStyle} /></div>
            <div><label style={labelStyle}>Professional Summary</label><textarea value={summary} onChange={e => setSummary(e.target.value)} placeholder="Brief professional summary..." rows={3} style={inputStyle} /></div>
          </div>
        )}

        {/* STEP 1 */}
        {step === 1 && (
          <div>
            <h3 style={{ fontWeight:700, marginBottom:18, fontSize:16 }}>🎓 Education</h3>
            {education.map((edu, i) => (
              <div key={i} style={{ border:'1.5px solid #e2e8f0', borderRadius:10, padding:16, marginBottom:12 }}>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:12 }}>
                  <div><label style={labelStyle}>Degree</label><input value={edu.degree} onChange={e => { const a=[...education]; a[i]={...a[i],degree:e.target.value}; setEducation(a) }} placeholder="B.Tech Computer Science" style={inputStyle} /></div>
                  <div><label style={labelStyle}>Institution</label><input value={edu.institution} onChange={e => { const a=[...education]; a[i]={...a[i],institution:e.target.value}; setEducation(a) }} placeholder="IIT Delhi" style={inputStyle} /></div>
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                  <div><label style={labelStyle}>Year</label><input value={edu.year} onChange={e => { const a=[...education]; a[i]={...a[i],year:e.target.value}; setEducation(a) }} placeholder="2020 - 2024" style={inputStyle} /></div>
                  <div><label style={labelStyle}>GPA (Optional)</label><input value={edu.gpa} onChange={e => { const a=[...education]; a[i]={...a[i],gpa:e.target.value}; setEducation(a) }} placeholder="8.5/10" style={inputStyle} /></div>
                </div>
              </div>
            ))}
            <button onClick={addEdu} style={{ width:'100%', border:'2px dashed #e2e8f0', borderRadius:10, padding:12, color:'#6C63FF', fontWeight:700, background:'none', cursor:'pointer', fontSize:14 }}>+ Add Education</button>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div>
            <h3 style={{ fontWeight:700, marginBottom:18, fontSize:16 }}>🏢 Work Experience</h3>
            {experience.map((exp, i) => (
              <div key={i} style={{ border:'1.5px solid #e2e8f0', borderRadius:10, padding:16, marginBottom:12 }}>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:12 }}>
                  <div><label style={labelStyle}>Job Title</label><input value={exp.jobTitle} onChange={e => { const a=[...experience]; a[i]={...a[i],jobTitle:e.target.value}; setExperience(a) }} placeholder="Software Developer" style={inputStyle} /></div>
                  <div><label style={labelStyle}>Company</label><input value={exp.company} onChange={e => { const a=[...experience]; a[i]={...a[i],company:e.target.value}; setExperience(a) }} placeholder="Google" style={inputStyle} /></div>
                </div>
                <div style={{ marginBottom:12 }}><label style={labelStyle}>Duration</label><input value={exp.duration} onChange={e => { const a=[...experience]; a[i]={...a[i],duration:e.target.value}; setExperience(a) }} placeholder="Jan 2022 - Present" style={inputStyle} /></div>
                <div><label style={labelStyle}>Description</label><textarea value={exp.description} onChange={e => { const a=[...experience]; a[i]={...a[i],description:e.target.value}; setExperience(a) }} placeholder="Describe your responsibilities..." rows={3} style={inputStyle} /></div>
              </div>
            ))}
            <button onClick={addExp} style={{ width:'100%', border:'2px dashed #e2e8f0', borderRadius:10, padding:12, color:'#6C63FF', fontWeight:700, background:'none', cursor:'pointer', fontSize:14 }}>+ Add Experience</button>
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div>
            <h3 style={{ fontWeight:700, marginBottom:18, fontSize:16 }}>🛠️ Projects</h3>
            {projects.map((proj, i) => (
              <div key={i} style={{ border:'1.5px solid #e2e8f0', borderRadius:10, padding:16, marginBottom:12 }}>
                <div style={{ marginBottom:12 }}><label style={labelStyle}>Project Title</label><input value={proj.title} onChange={e => { const a=[...projects]; a[i]={...a[i],title:e.target.value}; setProjects(a) }} placeholder="E-Commerce Website" style={inputStyle} /></div>
                <div style={{ marginBottom:12 }}><label style={labelStyle}>Description</label><textarea value={proj.description} onChange={e => { const a=[...projects]; a[i]={...a[i],description:e.target.value}; setProjects(a) }} placeholder="What does this project do?" rows={2} style={inputStyle} /></div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                  <div><label style={labelStyle}>Technologies</label><input value={proj.technologies} onChange={e => { const a=[...projects]; a[i]={...a[i],technologies:e.target.value}; setProjects(a) }} placeholder="React, Node.js, MongoDB" style={inputStyle} /></div>
                  <div><label style={labelStyle}>Link (Optional)</label><input value={proj.link} onChange={e => { const a=[...projects]; a[i]={...a[i],link:e.target.value}; setProjects(a) }} placeholder="https://github.com/..." style={inputStyle} /></div>
                </div>
              </div>
            ))}
            <button onClick={addProj} style={{ width:'100%', border:'2px dashed #e2e8f0', borderRadius:10, padding:12, color:'#6C63FF', fontWeight:700, background:'none', cursor:'pointer', fontSize:14 }}>+ Add Project</button>
          </div>
        )}

        {/* STEP 4 */}
        {step === 4 && (
          <div>
            <h3 style={{ fontWeight:700, marginBottom:8, fontSize:16 }}>📋 Skills</h3>
            <p style={{ fontSize:13, color:'#718096', marginBottom:16 }}>Add your technical and soft skills one by one.</p>
            {skills.map((sk, i) => (
              <div key={i} style={{ marginBottom:10 }}>
                <input value={sk} onChange={e => { const a=[...skills]; a[i]=e.target.value; setSkills(a) }} placeholder="e.g. JavaScript, Python, Communication" style={inputStyle} />
              </div>
            ))}
            <button onClick={addSkill} style={{ width:'100%', border:'2px dashed #e2e8f0', borderRadius:10, padding:12, color:'#6C63FF', fontWeight:700, background:'none', cursor:'pointer', fontSize:14 }}>+ Add Skill</button>
          </div>
        )}

        {/* STEP 5 */}
        {step === 5 && (
          <div style={{ textAlign:'center', padding:'20px 0' }}>
            <div style={{ fontSize:48, marginBottom:12 }}>🎉</div>
            <h3 style={{ fontWeight:800, fontSize:20, marginBottom:8 }}>Resume Ready!</h3>
            <p style={{ color:'#718096', marginBottom:6 }}>Your information has been collected successfully.</p>
            <p style={{ color:'#718096', fontSize:13, marginBottom:24 }}>Click below to save and proceed to career planning.</p>
            <button onClick={generate} style={{ padding:'13px 40px', background:'linear-gradient(135deg,#6C63FF,#764ba2)', color:'white', border:'none', borderRadius:10, fontSize:16, fontWeight:700, cursor:'pointer' }}>
              Save & Continue →
            </button>
          </div>
        )}

        {/* Navigation */}
        <div style={{ display:'flex', justifyContent:'space-between', marginTop:24 }}>
          <button
            onClick={() => setStep(p => Math.max(0, p - 1))}
            disabled={step === 0}
            style={{ padding:'10px 20px', border:'1.5px solid #e2e8f0', borderRadius:8, background:'white', cursor: step===0 ? 'not-allowed' : 'pointer', fontWeight:600, fontSize:14, opacity: step===0 ? 0.4 : 1 }}
          >
            ← Previous
          </button>
          {step < 5 && (
            <button
              onClick={() => setStep(p => p + 1)}
              style={{ padding:'10px 24px', background:'linear-gradient(135deg,#6C63FF,#764ba2)', color:'white', border:'none', borderRadius:8, fontSize:14, fontWeight:700, cursor:'pointer' }}
            >
              Next →
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
