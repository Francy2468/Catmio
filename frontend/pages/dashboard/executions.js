import { useEffect, useState, useCallback } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import LoadingSpinner from '../../components/LoadingSpinner'
import api from '../../lib/api'

export default function Executions() {
  const [executions, setExecutions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filters, setFilters] = useState({ script_name: '', game_name: '' })
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const limit = 20

  const fetchExecutions = useCallback(() => {
    setLoading(true)
    const params = { page, limit, ...filters }
    api
      .get('/api/executions', { params })
      .then(({ data }) => {
        setExecutions(data.executions || data.data || [])
        setTotalPages(data.totalPages || Math.ceil((data.total || 0) / limit) || 1)
      })
      .catch(() => setError('Failed to load executions.'))
      .finally(() => setLoading(false))
  }, [page, filters])

  useEffect(() => {
    fetchExecutions()
  }, [fetchExecutions])

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value })
    setPage(1)
  }

  const formatDate = (d) => (d ? new Date(d).toLocaleString() : '—')

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Executions</h1>
        <p className="text-gray-400 text-sm mt-1">All script execution logs for your account</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          name="script_name"
          value={filters.script_name}
          onChange={handleFilterChange}
          placeholder="Filter by script name…"
          className="bg-[#1e293b] border border-white/10 text-white placeholder-gray-600 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm flex-1"
        />
        <input
          type="text"
          name="game_name"
          value={filters.game_name}
          onChange={handleFilterChange}
          placeholder="Filter by game name…"
          className="bg-[#1e293b] border border-white/10 text-white placeholder-gray-600 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm flex-1"
        />
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
                    <th className="px-4 py-3 font-medium">Script Name</th>
                    <th className="px-4 py-3 font-medium">Game Name</th>
                    <th className="px-4 py-3 font-medium">IP Address</th>
                    <th className="px-4 py-3 font-medium">HWID</th>
                    <th className="px-4 py-3 font-medium">Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {executions.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                        No executions found.
                      </td>
                    </tr>
                  ) : (
                    executions.map((ex, i) => (
                      <tr key={ex.id || i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="px-4 py-3 text-white">{ex.script_name || '—'}</td>
                        <td className="px-4 py-3 text-gray-300">{ex.game_name || '—'}</td>
                        <td className="px-4 py-3 text-gray-300 font-mono text-xs">{ex.ip_address || '—'}</td>
                        <td className="px-4 py-3 text-gray-300 font-mono text-xs truncate max-w-[160px]">
                          {ex.hwid || '—'}
                        </td>
                        <td className="px-4 py-3 text-gray-400">{formatDate(ex.created_at || ex.timestamp)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-gray-500">
                Page {page} of {totalPages}
              </p>
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
    </DashboardLayout>
  )
}
