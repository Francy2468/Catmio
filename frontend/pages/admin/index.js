import { useEffect, useState } from 'react'
import Link from 'next/link'
import AdminLayout from '../../layouts/AdminLayout'
import StatCard from '../../components/StatCard'
import LoadingSpinner from '../../components/LoadingSpinner'
import api from '../../lib/api'

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api
      .get('/api/admin/analytics')
      .then(({ data }) => setStats(data))
      .catch(() => setError('Failed to load admin stats.'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Admin Overview</h1>
        <p className="text-gray-400 text-sm mt-1">Platform-wide statistics</p>
      </div>

      {loading && <LoadingSpinner />}

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg px-4 py-3 text-sm mb-4">
          {error}
        </div>
      )}

      {!loading && !error && stats && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <StatCard title="Total Users" value={stats.total_users ?? 0} />
            <StatCard title="Total Executions" value={stats.total_executions ?? 0} />
            <StatCard title="Banned Users" value={stats.banned_users ?? 0} color="red" />
          </div>
        </>
      )}

      {/* Quick links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg">
        <Link
          href="/admin/users"
          className="bg-[#1e293b] border border-white/5 hover:border-blue-500/30 rounded-2xl p-5 transition-colors group"
        >
          <div className="text-2xl mb-2">👥</div>
          <h3 className="font-semibold group-hover:text-blue-400 transition-colors">Manage Users</h3>
          <p className="text-sm text-gray-500 mt-1">View, ban, and manage all users</p>
        </Link>
        <Link
          href="/admin/analytics"
          className="bg-[#1e293b] border border-white/5 hover:border-blue-500/30 rounded-2xl p-5 transition-colors group"
        >
          <div className="text-2xl mb-2">📊</div>
          <h3 className="font-semibold group-hover:text-blue-400 transition-colors">Analytics</h3>
          <p className="text-sm text-gray-500 mt-1">Charts, top scripts, active users</p>
        </Link>
      </div>
    </AdminLayout>
  )
}
