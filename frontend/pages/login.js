import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Script from 'next/script'
import { useRouter } from 'next/router'
import api from '../lib/api'
import { setToken } from '../lib/auth'

export default function Login() {
  const router = useRouter()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [googleScriptLoaded, setGoogleScriptLoaded] = useState(false)
  const [googleClientId, setGoogleClientId] = useState('')
  const googleButtonRef = useRef(null)

  useEffect(() => {
    let isMounted = true
    api
      .get('/api/auth/google-config')
      .then(({ data }) => {
        if (!isMounted) return
        if (data?.enabled && typeof data.clientId === 'string') {
          setGoogleClientId(data.clientId)
        }
      })
      .catch(() => {
        // Silent failure keeps email/password auth working.
      })

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    if (!googleClientId) return
    if (!googleScriptLoaded) return
    if (typeof window === 'undefined' || !window.google || !googleButtonRef.current) return

    window.google.accounts.id.initialize({
      client_id: googleClientId,
      callback: async (response) => {
        if (!response?.credential) return
        setError('')
        setGoogleLoading(true)
        try {
          const { data } = await api.post('/api/auth/google', { token: response.credential })
          setToken(data.token)
          router.push('/dashboard')
        } catch (err) {
          setError(err.response?.data?.error || 'Google sign-in failed.')
        } finally {
          setGoogleLoading(false)
        }
      },
    })

    googleButtonRef.current.innerHTML = ''
    window.google.accounts.id.renderButton(googleButtonRef.current, {
      type: 'standard',
      shape: 'pill',
      size: 'large',
      text: 'signin_with',
      theme: 'outline',
      width: 320,
    })
  }, [googleClientId, googleScriptLoaded, router])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { data } = await api.post('/api/auth/login', form)
      setToken(data.token)
      router.push('/dashboard')
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid email or password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-bold text-blue-500">Catmio</Link>
          <p className="text-gray-400 mt-2">Welcome back</p>
        </div>

        <div className="bg-[#1e293b] border border-white/10 rounded-2xl p-8">
          <h1 className="text-2xl font-bold mb-6">Sign In</h1>

          {googleClientId && (
            <>
              <Script
                src="https://accounts.google.com/gsi/client"
                strategy="afterInteractive"
                onLoad={() => setGoogleScriptLoaded(true)}
              />
              <div className="mb-5 flex justify-center">
                <div ref={googleButtonRef} />
              </div>
              {googleLoading && (
                <p className="text-center text-sm text-gray-400 mb-4">Signing in with Google...</p>
              )}
              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-[#1e293b] px-2 text-gray-500">or continue with email</span>
                </div>
              </div>
            </>
          )}

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg px-4 py-3 mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="you@example.com"
                className="w-full bg-[#0f172a] border border-white/10 text-white placeholder-gray-600 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
                className="w-full bg-[#0f172a] border border-white/10 text-white placeholder-gray-600 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg py-3 transition-colors flex items-center justify-center gap-2"
            >
              {loading && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-6">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-blue-400 hover:text-blue-300">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
