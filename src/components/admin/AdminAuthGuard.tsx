'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminAuthGuard() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Authentification échouée')
        return
      }

      // Reload the page — the layout will now find the session cookie and render the dashboard
      router.refresh()
    } catch (err) {
      setError('Une erreur est survenue. Veuillez réessayer.')
      console.error('Login error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-hormadi-dark flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-hormadi-surface/80 backdrop-blur border border-hormadi-border rounded-2xl p-8 md:p-10 shadow-2xl shadow-black/20">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 rounded-full bg-hormadi-red flex items-center justify-center shadow-lg shadow-hormadi-red/30">
            <span className="text-white text-5xl font-bold">H</span>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-black text-white text-center mb-2 tracking-tight uppercase">
          Administration
        </h1>
        <p className="text-hormadi-muted text-center mb-8 text-sm">
          Accès réservé aux administrateurs
        </p>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
            <p className="text-red-400 text-sm text-center">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="guard-email" className="block text-sm font-medium text-hormadi-muted mb-2">
              Email
            </label>
            <input
              id="guard-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@hormadi.fr"
              className="w-full px-4 py-3 bg-hormadi-dark/60 border border-hormadi-border rounded-xl text-white placeholder-hormadi-muted/50 focus:outline-none focus:border-hormadi-red/50 focus:ring-1 focus:ring-hormadi-red/30 transition-all"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="guard-password" className="block text-sm font-medium text-hormadi-muted mb-2">
              Mot de passe
            </label>
            <input
              id="guard-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-hormadi-dark/60 border border-hormadi-border rounded-xl text-white placeholder-hormadi-muted/50 focus:outline-none focus:border-hormadi-red/50 focus:ring-1 focus:ring-hormadi-red/30 transition-all"
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="btn-primary w-full mt-2"
            disabled={loading}
          >
            {loading ? 'Connexion en cours...' : 'Se connecter'}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-hormadi-muted/60 text-xs mt-8">
          Hormadi Anglet Hockey © {new Date().getFullYear()}
        </p>
      </div>
    </div>
  )
}
