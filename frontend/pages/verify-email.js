import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import api from '../lib/api'

export default function VerifyEmail() {
  const router = useRouter()
  const [status, setStatus] = useState('loading') // loading | success | error
  const [message, setMessage] = useState('')

  useEffect(() => {
    const { token } = router.query
    if (!router.isReady) return
    if (!token) {
      setStatus('error')
      setMessage('No verification token found in the URL.')
      return
    }

    api
      .get(`/api/auth/verify-email?token=${token}`)
      .then(() => {
        setStatus('success')
        setMessage('Your email has been verified successfully!')
      })
      .catch((err) => {
        setStatus('error')
        setMessage(err.response?.data?.message || 'Verification failed. The link may have expired.')
      })
  }, [router.isReady, router.query])

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <Link href="/" className="text-3xl font-bold text-blue-500 inline-block mb-8">
          Catmio
        </Link>

        <div className="bg-[#1e293b] border border-white/10 rounded-2xl p-10">
          {status === 'loading' && (
            <>
              <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-400">Verifying your email…</p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="text-5xl mb-4">✅</div>
              <h1 className="text-2xl font-bold mb-2">Email Verified</h1>
              <p className="text-gray-400 mb-6">{message}</p>
              <Link
                href="/login"
                className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl px-8 py-3 transition-colors"
              >
                Go to Login
              </Link>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="text-5xl mb-4">❌</div>
              <h1 className="text-2xl font-bold mb-2">Verification Failed</h1>
              <p className="text-gray-400 mb-6">{message}</p>
              <Link
                href="/register"
                className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl px-8 py-3 transition-colors"
              >
                Register Again
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
