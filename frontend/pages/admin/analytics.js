import { useEffect, useState } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'
import AdminLayout from '../../layouts/AdminLayout'
import LoadingSpinner from '../../components/LoadingSpinner'
import api from '../../lib/api'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export default function AdminAnalytics() {
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api
      .get('/api/admin/analytics')
      .then(({ data }) => setAnalytics(data))
      .catch(() => setError('Failed to load analytics.'))
      .finally(() => setLoading(false))
  }, [])

  const chartData = {
    labels: analytics?.daily?.map((d) => d.date) || [],
    datasets: [
      {
        label: 'Executions',
        data: analytics?.daily?.map((d) => d.count) || [],
        backgroundColor: 'rgba(59,130,246,0.7)',
        borderColor: '#3b82f6',
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1e293b',
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        titleColor: '#fff',
        bodyColor: '#94a3b8',
      },
    },
    scales: {
      x: {
        grid: { color: 'rgba(255,255,255,0.05)' },
        ticks: { color: '#94a3b8', maxTicksLimit: 10 },
      },
      y: {
        grid: { color: 'rgba(255,255,255,0.05)' },
        ticks: { color: '#94a3b8' },
        beginAtZero: true,
      },
    },
  }

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-gray-400 text-sm mt-1">Platform-wide execution analytics</p>
      </div>

      {loading && <LoadingSpinner />}

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg px-4 py-3 text-sm mb-4">
          {error}
        </div>
      )}

      {!loading && !error && analytics && (
        <div className="space-y-6">
          {/* Bar chart */}
          <div className="bg-[#1e293b] border border-white/5 rounded-2xl p-6">
            <h2 className="font-semibold mb-4">Executions — Last 30 Days</h2>
            <div className="h-64">
              <Bar data={chartData} options={chartOptions} />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top scripts */}
            <div className="bg-[#1e293b] border border-white/5 rounded-2xl p-6">
              <h2 className="font-semibold mb-4">Top Scripts</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10 text-gray-400 text-left">
                      <th className="pb-3 font-medium">#</th>
                      <th className="pb-3 font-medium">Script Name</th>
                      <th className="pb-3 font-medium text-right">Executions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(analytics.top_scripts || []).length === 0 ? (
                      <tr>
                        <td colSpan={3} className="py-4 text-center text-gray-500">No data</td>
                      </tr>
                    ) : (
                      (analytics.top_scripts || []).map((s, i) => (
                        <tr key={i} className="border-b border-white/5 last:border-0">
                          <td className="py-2.5 text-gray-500">{i + 1}</td>
                          <td className="py-2.5 text-white">{s.script_name || '—'}</td>
                          <td className="py-2.5 text-right text-blue-400 font-medium">{s.count}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Most active users */}
            <div className="bg-[#1e293b] border border-white/5 rounded-2xl p-6">
              <h2 className="font-semibold mb-4">Most Active Users</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10 text-gray-400 text-left">
                      <th className="pb-3 font-medium">#</th>
                      <th className="pb-3 font-medium">Email</th>
                      <th className="pb-3 font-medium text-right">Executions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(analytics.top_users || []).length === 0 ? (
                      <tr>
                        <td colSpan={3} className="py-4 text-center text-gray-500">No data</td>
                      </tr>
                    ) : (
                      (analytics.top_users || []).map((u, i) => (
                        <tr key={i} className="border-b border-white/5 last:border-0">
                          <td className="py-2.5 text-gray-500">{i + 1}</td>
                          <td className="py-2.5 text-white">{u.email || '—'}</td>
                          <td className="py-2.5 text-right text-blue-400 font-medium">{u.count}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
