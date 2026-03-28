import { type FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function AdminLogin() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const { signIn, isAdmin } = useAuth()
  const navigate = useNavigate()

  if (isAdmin) {
    navigate('/admin', { replace: true })
    return null
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
    } else {
      navigate('/admin')
    }
  }

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <h1 className="section-title animate-fade-up">Admin Login</h1>
        </div>
      </section>
      <section className="reservation-section">
        <div className="container" style={{ maxWidth: 460 }}>
          <div className="reservation-form animate-fade-up">
            <h3>Sign In</h3>
            {error && <div className="form-error-banner">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" name="email" placeholder="admin@delightdining.com" required />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input type="password" id="password" name="password" placeholder="••••••••" required />
              </div>
              <button type="submit" className="btn btn-wine form-submit" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  )
}
