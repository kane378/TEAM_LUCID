import type { User } from '../types'

export const authService = {
  getUser(): User | null {
    const s = localStorage.getItem('vm_user')
    return s ? JSON.parse(s) : null
  },

  saveUser(user: User): void {
    localStorage.setItem('vm_user', JSON.stringify(user))
  },

  logout(): void {
    localStorage.removeItem('vm_user')
  },

  register(username: string, data: any): void {
    localStorage.setItem('vm_registered_' + username, JSON.stringify(data))
  },

  getRegistered(username: string): any | null {
    const s = localStorage.getItem('vm_registered_' + username)
    return s ? JSON.parse(s) : null
  },
}
