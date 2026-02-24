import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useState } from 'react'
import type { User } from './types'
import Navbar from './components/Navbar' 
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Resume from './pages/Resume'
import ResumeBuilder from './pages/ResumeBuilder'
import ResumeAnalysis from './pages/ResumeAnalysis'
import DomainSelection from './pages/DomainSelection'
import JobRoleSelection from './pages/JobRoleSelection'
import EligibilityCheck from './pages/EligibilityCheck'
import Plan from './pages/Plan'
import Quiz from './pages/Quiz'
import Interview from './pages/Interview'
import Jobs from './pages/Jobs'
import Progress from './pages/Progress'

export default function App() {
  // Initializing state with a safety check for JSON parsing to avoid crashes
  const [user, setUser] = useState<User | null>(() => {
    try {
      const s = localStorage.getItem('vm_user')
      return s ? JSON.parse(s) : null
    } catch (e) {
      console.error("Failed to parse user session:", e)
      return null
    }
  })

  const handleLogin = (userData: User) => {
    setUser(userData)
    localStorage.setItem('vm_user', JSON.stringify(userData))
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem('vm_user')
  }

  return (
    <BrowserRouter>
      {/* Root container ensuring consistent background color across the app */}
      <div style={{ minHeight: '100vh', background: '#f5f6fa' }}>
        
        {/* Navbar is pinned at the top using position: fixed in its component */}
        {user && <Navbar user={user} onLogout={handleLogout} />}
        
        {/* MAIN WRAPPER: 
            This padding-top (88px) accounts for the 64px Navbar height 
            plus 24px of extra space to stop the "Hi there" banner from touching the top.
        */}
        <main style={{ paddingTop: user ? '64px' : '0' }}> 
          <Routes>
            {/* Auth Routes: Redirects to Dashboard if already logged in */}
            <Route 
              path="/login" 
              element={!user ? <Login onLogin={handleLogin} /> : <Navigate to="/dashboard" replace />} 
            />
            <Route 
              path="/register" 
              element={!user ? <Register onRegister={handleLogin} /> : <Navigate to="/dashboard" replace />} 
            />

            {/* Protected Routes: Redirects to Login if user is null */}
            <Route path="/dashboard" element={user ? <Dashboard user={user} /> : <Navigate to="/login" replace />} />
            <Route path="/resume" element={user ? <Resume /> : <Navigate to="/login" replace />} />
            <Route path="/resume/build" element={user ? <ResumeBuilder /> : <Navigate to="/login" replace />} />
            <Route path="/resume/analysis" element={user ? <ResumeAnalysis /> : <Navigate to="/login" replace />} />
            <Route path="/domain" element={user ? <DomainSelection /> : <Navigate to="/login" replace />} />
            <Route path="/role" element={user ? <JobRoleSelection /> : <Navigate to="/login" replace />} />
            <Route path="/eligibility" element={user ? <EligibilityCheck /> : <Navigate to="/login" replace />} />
            <Route path="/plan" element={user ? <Plan /> : <Navigate to="/login" replace />} />
            <Route path="/quiz" element={user ? <Quiz /> : <Navigate to="/login" replace />} />
            <Route path="/interview" element={user ? <Interview /> : <Navigate to="/login" replace />} />
            <Route path="/jobs" element={user ? <Jobs /> : <Navigate to="/login" replace />} />
            <Route path="/progress" element={user ? <Progress /> : <Navigate to="/login" replace />} />

            {/* Fallback Catch-all: Always keeps the user on a valid page */}
            <Route path="*" element={<Navigate to={user ? '/dashboard' : '/login'} replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}