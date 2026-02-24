import { useState, useRef } from 'react'

import { useNavigate } from 'react-router-dom'

import { Upload, FileText, PlusCircle, ArrowLeft, ShieldCheck } from 'lucide-react' // Install lucide-react

import api from '../services/api'


export default function Resume() {

  const nav = useNavigate()

  const [choice, setChoice] = useState<'ask' | 'upload'>('ask')

  const [file, setFile] = useState<File | null>(null)

  const [loading, setLoading] = useState(false)

  const [error, setError] = useState('')

  const inputRef = useRef<HTMLInputElement>(null)


  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault()

    if (!file) return

    setError(''); setLoading(true)

    try {

      const form = new FormData()

      form.append('file', file)

      const res = await api.post('/resume/parse', form)

      localStorage.setItem('resumeAnalysis', JSON.stringify(res.data))

      nav('/resume/analysis')

    } catch (err: any) {

      setError(err?.response?.data?.detail || 'System error: Ensure backend is connected.')

    } finally {

      setLoading(false)

    }

  }


  // --- UI COMPONENTS ---


  const Header = () => (

    <div style={{ marginBottom: 40 }}>

      <h1 style={{ fontSize: '32px', fontWeight: 800, color: '#1a202c', letterSpacing: '-0.5px' }}>

        Resume <span style={{ color: '#6C63FF' }}>Intelligence</span>

      </h1>

      <p style={{ color: '#64748b', marginTop: 8 }}>

        Upload your professional profile for an AI-driven competitive analysis.

      </p>

    </div>

  )


  if (choice === 'ask') {

    return (

      <div style={{ maxWidth: '1000px', margin: '80px auto', padding: '0 24px' }}>

        <Header />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>

          

          {/* Option 1: Upload */}

          <div 

            onClick={() => setChoice('upload')}

            style={cardStyle('#6C63FF')}

          >

            <div style={iconBoxStyle('#f5f3ff')}><FileText color="#6C63FF" /></div>

            <h3 style={{ margin: '16px 0 8px', fontSize: '18px' }}>Analyze Existing</h3>

            <p style={{ color: '#64748b', fontSize: '14px', lineHeight: 1.5 }}>

              Have a resume? Upload it to check your ATS score and get improvement tips.

            </p>

          </div>


          {/* Option 2: Build */}

          <div 

            onClick={() => nav('/resume/build')}

            style={cardStyle('#10b981')}

          >

            <div style={iconBoxStyle('#ecfdf5')}><PlusCircle color="#10b981" /></div>

            <h3 style={{ margin: '16px 0 8px', fontSize: '18px' }}>Build from Scratch</h3>

            <p style={{ color: '#64748b', fontSize: '14px', lineHeight: 1.5 }}>

              Don't have one? Use our AI-guided builder to create a winning resume.

            </p>

          </div>

        </div>

      </div>

    )

  }


  return (

    <div style={{ maxWidth: '600px', margin: '60px auto', padding: '32px', background: '#fff', borderRadius: '24px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>

      <button onClick={() => setChoice('ask')} style={backBtnStyle}><ArrowLeft size={16}/> Back</button>

      <h2 style={{ fontSize: '24px', fontWeight: 700, margin: '20px 0 8px' }}>Upload Document</h2>

      

      <form onSubmit={handleSubmit}>

        <div 

          onClick={() => inputRef.current?.click()}

          style={dropzoneStyle(!!file)}

        >

          <Upload size={40} color={file ? '#6C63FF' : '#cbd5e1'} />

          <p style={{ fontWeight: 600, marginTop: 12 }}>{file ? file.name : 'Click to select file'}</p>

          <p style={{ fontSize: '12px', color: '#94a3b8' }}>PDF or DOCX up to 10MB</p>

          <input ref={inputRef} type="file" accept=".pdf,.docx" hidden onChange={e => setFile(e.target.files?.[0] || null)} />

        </div>


        {error && <div style={errorStyle}>{error}</div>}


        <button type="submit" disabled={!file || loading} style={submitBtnStyle(!!file && !loading)}>

          {loading ? 'Processing...' : 'Run AI Analysis'}

        </button>

      </form>

    </div>

  )

}


// --- STYLES ---

const cardStyle = (color: string) => ({

  padding: '40px', background: '#fff', borderRadius: '20px', border: '1px solid #e2e8f0', cursor: 'pointer', transition: 'all 0.3s ease',

  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',

  ':hover': { transform: 'translateY(-5px)', borderColor: color }

} as any)


const iconBoxStyle = (bg: string) => ({

  width: '48px', height: '48px', borderRadius: '12px', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center'

})


const dropzoneStyle = (isActive: boolean) => ({

  border: `2px dashed ${isActive ? '#6C63FF' : '#e2e8f0'}`, padding: '60px 20px', borderRadius: '16px', textAlign: 'center' as const, cursor: 'pointer', background: isActive ? '#f8faff' : '#fff', transition: '0.2s'

})


const submitBtnStyle = (active: boolean) => ({

  width: '100%', marginTop: '24px', padding: '14px', borderRadius: '12px', border: 'none', background: active ? '#6C63FF' : '#cbd5e1', color: '#fff', fontWeight: 700, cursor: active ? 'pointer' : 'not-allowed'

})


const backBtnStyle = { border: 'none', background: 'none', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 500 }

const errorStyle = { marginTop: '16px', padding: '12px', background: '#fef2f2', color: '#b91c1c', borderRadius: '8px', fontSize: '13px' }