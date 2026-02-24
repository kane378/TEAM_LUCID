import { useState } from 'react'
import type { User } from '../types'

export function useAuth() {
  const [user, setUser] = useState<User | null>(() => {
    const s = localStorage.getItem('vm_user')
    return s ? JSON.parse(s) : null
  })

  const login = (u: Omit<User, 'email'>) => {
    const full: User = { ...u, email: `${u.username}@example.com` }
    setUser(full)
    localStorage.setItem('vm_user', JSON.stringify(full))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('vm_user')
  }

  return { user, login, logout }
}
