import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { setToken } from '../../lib/auth'

/**
 * /auth/callback
 *
 * The backend Google OAuth flow redirects here with ?token=<jwt>.
 * We store the token and redirect the user to the dashboard.
 */
export default function AuthCallback() {
  const router = useRouter()
  const [error, setError] = useState('')

  useEffect(() => {
    if (!router.isReady) return

    const { token, error: oauthError } = router.query

    if (oauthError === 'banned') {
      setError('Your account has been banned.')
      return
    }
    if (oauthError === 'google_denied') {
      router.replace('/login')
      return
    }
    if (oauthError || !token) {
      setError('Google sign-in failed. Please try again.')
      return
    }

    setToken(token)
    router.replace('/dashboard')
  }, [router.isReady, router.query]) // eslint-disable-line react-hooks/exhaustive-deps

  if (error) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <div className="text-5xl mb-4">⚠️</div>
          <h1 className="text-xl font-semibold text-white mb-2">Sign-in failed</h1>
          <p className="text-gray-400 text-sm mb-6">{error}</p>
          <a href="/login" className="text-blue-400 hover:text-blue-300 text-sm">
            Return to login
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-400 text-sm">Signing you in…</p>
      </div>
    </div>
  )
}
