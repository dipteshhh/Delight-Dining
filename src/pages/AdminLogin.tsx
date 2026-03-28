import { type FormEvent, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../components/Toast'
import { isSupabaseConfigured } from '../lib/supabase'

export default function AdminLogin() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const { signIn, isAdmin } = useAuth()
  const navigate = useNavigate()
  const { addToast } = useToast()

  if (isAdmin) {
    return <Navigate to="/admin" replace />
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const form = new FormData(e.currentTarget)
    const err = await signIn(form.get('email') as string, form.get('password') as string)
    setLoading(false)
    if (err) {
      setError(err)
      addToast(err, 'error')
    } else {
      addToast('Signed in.', 'success')
      navigate('/admin')
    }
  }

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <span className="section-label animate-fade-up">Operations Access</span>
          <h1 className="section-title animate-fade-up">Admin Login</h1>
          <p className="section-subtitle mx-auto animate-fade-up delay-1">
            Access reservations, catering inquiries, menu updates, and order status.
          </p>
        </div>
      </section>
      <section className="reservation-section">
        <div className="container" style={{ maxWidth: 460 }}>
          <div className="reservation-form animate-fade-up">
            <h3>Sign In</h3>
            {!isSupabaseConfigured && (
              <div className="form-info-banner">
                Demo mode: use <strong>admin@delightdining.com</strong> /{' '}
                <strong>delight-demo</strong>.
              </div>
            )}
            {error && <div className="form-error-banner">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="admin@delightdining.com"
                  defaultValue={!isSupabaseConfigured ? 'admin@delightdining.com' : ''}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  defaultValue={!isSupabaseConfigured ? 'delight-demo' : ''}
                  required
                />
              </div>
              <button type="submit" className="btn btn-wine form-submit" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
            <Link className="admin-login-back" to="/">
              Back to the restaurant site
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
