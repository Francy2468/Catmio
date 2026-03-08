import { useEffect, useState, useCallback } from 'react'
import AdminLayout from '../../layouts/AdminLayout'
import LoadingSpinner from '../../components/LoadingSpinner'
import api from '../../lib/api'

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [actionLoading, setActionLoading] = useState({})
  const limit = 20

  const fetchUsers = useCallback(() => {
    setLoading(true)
    api
      .get('/api/admin/users', { params: { page, limit } })
      .then(({ data }) => {
        setUsers(data.users || data.data || [])
        setTotalPages(data.totalPages || Math.ceil((data.total || 0) / limit) || 1)
      })
      .catch(() => setError('Failed to load users.'))
      .finally(() => setLoading(false))
  }, [page])

  useEffect(() => { fetchUsers() }, [fetchUsers])

  const doAction = async (userId, endpoint, method = 'post', label) => {
    if (!window.confirm(`Are you sure you want to ${label}?`)) return
    setActionLoading((s) => ({ ...s, [`${userId}-${label}`]: true }))
    try {
      await api[method](endpoint)
      fetchUsers()
    } catch (err) {
      alert(err.response?.data?.message || `Failed to ${label}.`)
    } finally {
      setActionLoading((s) => ({ ...s, [`${userId}-${label}`]: false }))
    }
  }

  const formatDate = (d) => (d ? new Date(d).toLocaleDateString() : '—')

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Users</h1>
        <p className="text-gray-400 text-sm mt-1">Manage all registered users</p>
      </div>

      {loading && <LoadingSpinner />}

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg px-4 py-3 text-sm mb-4">
          {error}
        </div>
      )}

      {!loading && !error && (
        <>
          <div className="bg-[#1e293b] border border-white/5 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-gray-400 text-left">
                    <th className="px-4 py-3 font-medium">ID</th>
                    <th className="px-4 py-3 font-medium">Email</th>
                    <th className="px-4 py-3 font-medium">Role</th>
                    <th className="px-4 py-3 font-medium">Verified</th>
                    <th className="px-4 py-3 font-medium">Banned</th>
                    <th className="px-4 py-3 font-medium">HWID</th>
                    <th className="px-4 py-3 font-medium">Created</th>
                    <th className="px-4 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                        No users found.
                      </td>
                    </tr>
                  ) : (
                    users.map((u) => (
                      <tr key={u.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="px-4 py-3 text-gray-500 font-mono text-xs">{u.id}</td>
                        <td className="px-4 py-3 text-white">{u.email}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${u.role === 'admin' ? 'bg-blue-500/20 text-blue-400' : 'bg-white/5 text-gray-400'}`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={u.verified ? 'text-green-400' : 'text-gray-500'}>
                            {u.verified ? '✓' : '✗'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={u.banned ? 'text-red-400 font-medium' : 'text-gray-500'}>
                            {u.banned ? 'Yes' : 'No'}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-mono text-xs text-gray-400 max-w-[120px] truncate">
                          {u.hwid || '—'}
                        </td>
                        <td className="px-4 py-3 text-gray-400">{formatDate(u.created_at)}</td>
                        <td className="px-4 py-3">
                          <div className="flex gap-1.5 flex-wrap">
                            <button
                              onClick={() =>
                                doAction(
                                  u.id,
                                  u.banned ? `/api/admin/users/${u.id}/unban` : `/api/admin/users/${u.id}/ban`,
                                  'post',
                                  u.banned ? 'unban user' : 'ban user'
                                )
                              }
                              className={`text-xs px-2.5 py-1 rounded-lg transition-colors ${
                                u.banned
                                  ? 'bg-green-500/10 text-green-400 hover:bg-green-500/20'
                                  : 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
                              }`}
                            >
                              {u.banned ? 'Unban' : 'Ban'}
                            </button>
                            <button
                              onClick={() =>
                                doAction(u.id, `/api/admin/users/${u.id}/ban-hwid`, 'post', 'ban HWID')
                              }
                              className="text-xs px-2.5 py-1 rounded-lg bg-orange-500/10 text-orange-400 hover:bg-orange-500/20 transition-colors"
                            >
                              Ban HWID
                            </button>
                            <button
                              onClick={() =>
                                doAction(u.id, `/api/admin/users/${u.id}/reset-hwid`, 'post', 'reset HWID')
                              }
                              className="text-xs px-2.5 py-1 rounded-lg bg-white/5 text-gray-400 hover:bg-white/10 transition-colors"
                            >
                              Reset HWID
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-gray-500">Page {page} of {totalPages}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 text-sm bg-[#1e293b] border border-white/10 rounded-lg disabled:opacity-40 hover:bg-white/5 transition-colors"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 text-sm bg-[#1e293b] border border-white/10 rounded-lg disabled:opacity-40 hover:bg-white/5 transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </AdminLayout>
  )
}
