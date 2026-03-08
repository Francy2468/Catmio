import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { getToken, getUser, isAdmin, logout } from '../lib/auth'

const adminLinks = [
  { href: '/admin', label: 'Overview' },
  { href: '/admin/users', label: 'Users' },
  { href: '/admin/analytics', label: 'Analytics' },
  { href: '/admin/executions', label: 'Executions' },
]

export default function AdminLayout({ children }) {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    const token = getToken()
    if (!token) {
      router.replace('/login')
      return
    }
    if (!isAdmin()) {
      router.replace('/dashboard')
      return
    }
    setUser(getUser())
  }, [router])

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0f172a] flex">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-[#1e293b] flex flex-col z-30 transform transition-transform duration-200
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:z-auto`}
      >
        <div className="p-6 border-b border-white/10">
          <Link href="/admin" className="text-2xl font-bold text-blue-500">
            Catmio
          </Link>
          <p className="text-xs text-gray-500 mt-1">Admin Panel</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {adminLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition-colors
                ${router.pathname === link.href
                  ? 'bg-blue-500/20 text-blue-400'
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <Link
            href="/dashboard"
            className="flex items-center px-4 py-2 rounded-lg text-xs text-gray-500 hover:text-gray-300 transition-colors"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-[#1e293b] border-b border-white/10 px-4 lg:px-8 py-4 flex items-center justify-between">
          <button
            className="lg:hidden text-gray-400 hover:text-white"
            onClick={() => setSidebarOpen(true)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex items-center gap-3 ml-auto">
            <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded font-medium">Admin</span>
            <span className="text-sm text-gray-400 hidden sm:block">{user?.email}</span>
            <button
              onClick={logout}
              className="text-sm text-gray-400 hover:text-red-400 transition-colors px-3 py-1.5 rounded-lg hover:bg-red-500/10"
            >
              Logout
            </button>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
