import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { getDemoAdminSession, saveDemoAdminSession } from '../lib/demoStore'
import type { Session } from '@supabase/supabase-js'

interface AuthContextValue {
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<string | null>
  signOut: () => Promise<void>
  isAdmin: boolean
}

const AuthContext = createContext<AuthContextValue | null>(null)
const DEMO_ADMIN_EMAIL = 'admin@delightdining.com'
const DEMO_ADMIN_PASSWORD = 'delight-demo'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [isDemoAdmin, setIsDemoAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setIsDemoAdmin(getDemoAdminSession())
      setLoading(false)
      return
    }

    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string): Promise<string | null> => {
    if (!isSupabaseConfigured) {
      const normalizedEmail = email.trim().toLowerCase()
      const isValidDemoLogin =
        normalizedEmail === DEMO_ADMIN_EMAIL && password === DEMO_ADMIN_PASSWORD

      if (!isValidDemoLogin) {
        return `Use ${DEMO_ADMIN_EMAIL} / ${DEMO_ADMIN_PASSWORD} in demo mode.`
      }

      saveDemoAdminSession(true)
      setIsDemoAdmin(true)
      return null
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return error?.message ?? null
  }

  const signOut = async () => {
    if (!isSupabaseConfigured) {
      saveDemoAdminSession(false)
      setIsDemoAdmin(false)
      return
    }

    await supabase.auth.signOut()
    setSession(null)
  }

  return (
    <AuthContext.Provider
      value={{
        session,
        loading,
        signIn,
        signOut,
        isAdmin: isSupabaseConfigured ? !!session : isDemoAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
