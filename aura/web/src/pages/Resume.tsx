import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

export default function Resume() {
  const nav = useNavigate()
  const [choice, setChoice] = useState<'ask' | 'upload'>('ask')
  const [file, setFile] = useState<File | null>(null)
  const [dragging, setDragging] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const f = e.dataTransfer.files[0]
    if (f) setFile(f)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) { setError('Please select a file first'); return }
    setError(''); setLoading(true)
    try {
      const form = new FormData()
      form.append('file', file, file.name)
      const res = await api.post('/resume/parse', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      localStorage.setItem('resumeAnalysis', JSON.stringify(res.data))
      nav('/resume/analysis')
    } catch (err: any) {
      setError(err?.response?.data?.detail || err.message || 'Failed to parse resume. Make sure backend is running.')
    } finally {
      setLoading(false)
    }
  }

  // ==========================================
  // VIEW 1: ASK (Modern Stacked Layout)
  // ==========================================
  if (choice === 'ask') {
    return (
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '80px 24px', backgroundColor: '#FFFFFF', minHeight: '100vh' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <img 
            src="https://img.icons8.com/color/96/resume.png" 
            alt="Resume" 
            style={{ width: 72, height: 72, marginBottom: 20, display: 'block', margin: '0 auto' }} 
          />
          <h1 style={{ fontSize: 36, fontWeight: 800, color: '#1A202C', marginBottom: 12 }}>How would you like to start?</h1>
          <p style={{ color: '#718096', fontSize: 16, maxWidth: 500, margin: '0 auto', lineHeight: 1.6 }}>
            Choose an option below to set up your profile. We'll use this to tailor your career roadmap and job matches.
          </p>
        </div>

        {/* Stacked Horizontal Action Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 640, margin: '0 auto' }}>
          
          {/* Card 1: Upload */}
          <div
            onClick={() => setChoice('upload')}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              border: '1px solid #E2E8F0', 
              borderRadius: 16, 
              padding: '24px 32px', 
              cursor: 'pointer', 
              background: 'white',
              boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
              transition: 'all 0.2s ease',
            }}
            onMouseOver={e => { 
              e.currentTarget.style.borderColor = '#6C63FF'; 
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 12px 24px rgba(108, 99, 255, 0.1)';
            }}
            onMouseOut={e => { 
              e.currentTarget.style.borderColor = '#E2E8F0'; 
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.02)';
            }}
          >
            <div style={{ background: '#F0EEFF', width: 64, height: 64, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 24, flexShrink: 0 }}>
              <img src="https://img.icons8.com/color/96/upload-to-cloud--v1.png" alt="Upload" style={{ width: 32, height: 32 }} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 800, fontSize: 18, color: '#1A202C', marginBottom: 4 }}>Upload Existing Resume</div>
              <div style={{ color: '#718096', fontSize: 14, lineHeight: 1.5 }}>I already have a resume. Let AI analyze it for skill gaps.</div>
            </div>
            <img src="https://img.icons8.com/color/48/forward.png" alt="Go" style={{ width: 24, height: 24, opacity: 0.6 }} />
          </div>

          {/* Card 2: Build */}
          <div
            onClick={() => nav('/resume/build')}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              border: '1px solid #E2E8F0', 
              borderRadius: 16, 
              padding: '24px 32px', 
              cursor: 'pointer', 
              background: 'white',
              boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
              transition: 'all 0.2s ease',
            }}
            onMouseOver={e => { 
              e.currentTarget.style.borderColor = '#ED8936'; 
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 12px 24px rgba(237, 137, 54, 0.1)';
            }}
            onMouseOut={e => { 
              e.currentTarget.style.borderColor = '#E2E8F0'; 
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.02)';
            }}
          >
            <div style={{ background: '#FFF4E5', width: 64, height: 64, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 24, flexShrink: 0 }}>
              <img src="https://img.icons8.com/color/96/create-new.png" alt="Build" style={{ width: 32, height: 32 }} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 800, fontSize: 18, color: '#1A202C', marginBottom: 4 }}>Build with AI</div>
              <div style={{ color: '#718096', fontSize: 14, lineHeight: 1.5 }}>I don't have one. Help me build an ATS-friendly resume from scratch.</div>
            </div>
            <img src="https://img.icons8.com/color/48/forward.png" alt="Go" style={{ width: 24, height: 24, opacity: 0.6 }} />
          </div>

        </div>
      </div>
    )
  }

  // ==========================================
  // VIEW 2: UPLOAD (Premium Drag & Drop UI)
  // ==========================================
  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '60px 24px', backgroundColor: '#FFFFFF', minHeight: '100vh' }}>
      
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <h2 style={{ fontSize: 32, fontWeight: 800, color: '#1A202C', marginBottom: 12 }}>Upload Document</h2>
        <p style={{ color: '#718096', fontSize: 15 }}>Supports PDF, DOC, and DOCX formats (Max 5MB)</p>
      </div>

      <form onSubmit={handleSubmit} style={{ maxWidth: 640, margin: '0 auto' }}>
        
        {/* Dynamic Drag & Drop Zone */}
        <div
          onClick={() => !file && inputRef.current?.click()}
          onDragOver={e => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          style={{
            border: file ? '1px solid #E2E8F0' : `2px dashed ${dragging ? '#6C63FF' : '#CBD5E0'}`,
            borderRadius: 24, 
            padding: file ? '40px 24px' : '64px 24px', 
            textAlign: 'center', 
            cursor: file ? 'default' : 'pointer',
            background: dragging ? '#F0EEFF' : file ? '#F8FAFC' : '#FFFFFF',
            marginBottom: 32, 
            transition: 'all 0.2s ease',
          }}
        >
          {/* STATE A: No File Selected */}
          {!file && (
            <div>
              <img 
                src="https://img.icons8.com/color/96/export.png" 
                alt="Drag Drop" 
                style={{ width: 56, height: 56, marginBottom: 16, display: 'block', margin: '0 auto', opacity: dragging ? 1 : 0.8 }} 
              />
              <div style={{ fontWeight: 700, color: '#2D3748', fontSize: 18, marginBottom: 8 }}>
                Click to browse or drag file here
              </div>
            </div>
          )}

          {/* STATE B: File Successfully Attached */}
          {file && (
            <div style={{ 
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
              background: 'white', padding: '16px 24px', borderRadius: 16, 
              boxShadow: '0 4px 12px rgba(0,0,0,0.04)', maxWidth: 480, margin: '0 auto',
              border: '1px solid #E2E8F0'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, overflow: 'hidden' }}>
                <img src="https://img.icons8.com/color/48/pdf.png" alt="File" style={{ width: 36, height: 36, flexShrink: 0 }} />
                <div style={{ textAlign: 'left', overflow: 'hidden' }}>
                  <div style={{ fontWeight: 700, color: '#1A202C', fontSize: 15, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {file.name}
                  </div>
                  <div style={{ color: '#718096', fontSize: 13, marginTop: 4 }}>
                    {(file.size / 1024).toFixed(1)} KB • Ready to upload
                  </div>
                </div>
              </div>
              
              {/* Change File Button */}
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setFile(null); }}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 8 }}
                title="Remove File"
              >
                <img src="https://img.icons8.com/color/48/cancel--v1.png" alt="Remove" style={{ width: 24, height: 24 }} />
              </button>
            </div>
          )}

          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.doc,.docx"
            style={{ display: 'none' }}
            onChange={e => { if (e.target.files?.[0]) setFile(e.target.files[0]) }}
          />
        </div>

        {/* Error Message */}
        {error && (
          <div style={{ background: '#FFF5F5', border: '1px solid #FED7D7', borderRadius: 12, padding: '16px', color: '#E53E3E', fontSize: 14, fontWeight: 500, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
            <img src="https://img.icons8.com/color/48/error--v1.png" alt="Error" style={{ width: 24, height: 24 }} />
            {error}
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: 16 }}>
          <button
            type="button"
            onClick={() => { setChoice('ask'); setFile(null); setError('') }}
            style={{ 
              flex: 1, 
              padding: '16px 0', 
              border: '1px solid #E2E8F0', 
              borderRadius: 14, 
              background: 'white', 
              color: '#4A5568',
              cursor: 'pointer', 
              fontWeight: 700, 
              fontSize: 16,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              transition: 'all 0.2s ease', 
            }}
            onMouseOver={e => { e.currentTarget.style.background = '#F7FAFC' }}
            onMouseOut={e => { e.currentTarget.style.background = 'white' }}
          >
            Cancel
          </button>
          
          <button
            type="submit"
            disabled={loading || !file}
            style={{ 
              flex: 2, 
              padding: '16px 0', 
              background: loading || !file ? '#E2E8F0' : 'linear-gradient(135deg,#6C63FF,#764ba2)', 
              color: loading || !file ? '#A0AEC0' : 'white', 
              border: 'none', 
              borderRadius: 14, 
              fontSize: 16, 
              fontWeight: 700, 
              cursor: loading || !file ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 12,
              boxShadow: loading || !file ? 'none' : '0 4px 16px rgba(108, 99, 255, 0.3)',
              transition: 'all 0.2s ease',
            }}
            onMouseOver={e => {
              if (!loading && file) { e.currentTarget.style.transform = 'translateY(-2px)' }
            }}
            onMouseOut={e => {
              if (!loading && file) { e.currentTarget.style.transform = 'translateY(0)' }
            }}
          >
            {loading ? 'Analyzing Document...' : 'Analyze Resume'}
          </button>
        </div>
      </form>
    </div>
  )
}