import { createContext, useContext, useMemo, useState } from 'react'
import { currentClientId } from '../data/mockData'

const AuthContext = createContext(null)
const sessionKey = 'opdflow.session'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem(sessionKey)) } catch { return null }
  })
  const login = async ({ identifier, password, role }) => {
    if (!identifier || !password) throw new Error('Enter your demo credentials to continue.')
    const next = role === 'doctor'
      ? { id: 'd1', name: 'Dr. Sharma', role: 'doctor', email: identifier }
      : { id: currentClientId, name: 'Sahil Verma', role: 'client', email: identifier }
    localStorage.setItem(sessionKey, JSON.stringify(next))
    setUser(next)
    return next
  }
  const logout = () => { localStorage.removeItem(sessionKey); setUser(null) }
  const value = useMemo(() => ({ user, login, logout }), [user])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
