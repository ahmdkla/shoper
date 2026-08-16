import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

/**
 * Local-only accounts.
 *
 * Everything lives in this browser's localStorage — there is no server, no
 * session, and no recovery. Passwords are salted and hashed with SHA-256 via
 * SubtleCrypto rather than stored in the clear, which is the least we can do,
 * but this is NOT real authentication: anyone with access to the device can
 * read the store. Replace with a real provider before launch.
 */

const AuthContext = createContext(null)

const USERS_KEY = 'shoper.users'
const SESSION_KEY = 'shoper.session'

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function write(key, value) {
  try {
    // Signing out should clear the key, not park the string "null" in it.
    if (value === null || value === undefined) localStorage.removeItem(key)
    else localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* private mode / quota */
  }
}

const randomSalt = () =>
  Array.from(crypto.getRandomValues(new Uint8Array(16)))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')

async function hash(password, salt) {
  const data = new TextEncoder().encode(`${salt}:${password}`)
  const digest = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

const normalise = (email) => email.trim().toLowerCase()

export function AuthProvider({ children }) {
  const [users, setUsers] = useState(() => read(USERS_KEY, []))
  const [session, setSession] = useState(() => read(SESSION_KEY, null))
  const [ready, setReady] = useState(false)

  useEffect(() => setReady(true), [])
  useEffect(() => write(USERS_KEY, users), [users])
  useEffect(() => write(SESSION_KEY, session), [session])

  const user = useMemo(
    () => (session ? (users.find((u) => u.email === session.email) ?? null) : null),
    [session, users],
  )

  const signUp = useCallback(
    async ({ name, email, password }) => {
      const key = normalise(email)
      if (users.some((u) => u.email === key)) {
        return { ok: false, field: 'email', error: 'An account already exists for that email. Sign in instead.' }
      }
      const salt = randomSalt()
      const record = {
        id: `U-${Date.now().toString(36)}`,
        name: name.trim(),
        email: key,
        salt,
        hash: await hash(password, salt),
        createdAt: new Date().toISOString(),
        orders: [],
        addresses: [],
      }
      setUsers((prev) => [...prev, record])
      setSession({ email: key, since: Date.now() })
      return { ok: true }
    },
    [users],
  )

  const signIn = useCallback(
    async ({ email, password }) => {
      const key = normalise(email)
      const record = users.find((u) => u.email === key)
      // Same message for unknown email and wrong password — revealing which
      // one was wrong tells an attacker which emails are registered.
      const generic = { ok: false, field: 'password', error: 'That email and password do not match an account.' }
      if (!record) return generic
      const candidate = await hash(password, record.salt)
      if (candidate !== record.hash) return generic
      setSession({ email: key, since: Date.now() })
      return { ok: true }
    },
    [users],
  )

  const signOut = useCallback(() => setSession(null), [])

  const updateProfile = useCallback(
    (patch) => {
      if (!user) return
      setUsers((prev) => prev.map((u) => (u.email === user.email ? { ...u, ...patch } : u)))
    },
    [user],
  )

  /** Called by checkout so an order shows up in the account afterwards. */
  const recordOrder = useCallback(
    (order) => {
      if (!user) return
      setUsers((prev) =>
        prev.map((u) => (u.email === user.email ? { ...u, orders: [order, ...u.orders] } : u)),
      )
    },
    [user],
  )

  const value = useMemo(
    () => ({ user, ready, signUp, signIn, signOut, updateProfile, recordOrder }),
    [user, ready, signUp, signIn, signOut, updateProfile, recordOrder],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
