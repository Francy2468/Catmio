import { useEffect, useState } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import DashboardLayout from '../../layouts/DashboardLayout'
import StatCard from '../../components/StatCard'
import LoadingSpinner from '../../components/LoadingSpinner'
import api from '../../lib/api'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler)

export default function DashboardOverview() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api
      .get('/api/executions/stats')
      .then(({ data }) => setStats(data))
      .catch(() => setError('Failed to load stats.'))
      .finally(() => setLoading(false))
  }, [])

  const chartData = {
    labels: stats?.daily?.map((d) => d.date) || [],
    datasets: [
      {
        label: 'Executions',
        data: stats?.daily?.map((d) => d.count) || [],
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59,130,246,0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 3,
        pointBackgroundColor: '#3b82f6',
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
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Overview</h1>
        <p className="text-gray-400 text-sm mt-1">Your account at a glance</p>
      </div>

      {loading && <LoadingSpinner />}

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {!loading && !error && stats && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
            <StatCard title="Total Executions" value={stats.total_executions ?? 0} />
            <StatCard
              title="Last Execution"
              value={stats.last_execution ? new Date(stats.last_execution).toLocaleString() : 'Never'}
            />
            <StatCard
              title="Account Status"
              value={stats.banned ? 'Banned' : 'Active'}
              color={stats.banned ? 'red' : 'green'}
            />
            <StatCard title="HWID" value={stats.hwid || 'Not registered'} truncate />
          </div>

          <div className="bg-[#1e293b] border border-white/5 rounded-2xl p-6">
            <h2 className="font-semibold mb-4">Executions — Last 30 Days</h2>
            <div className="h-64">
              <Line data={chartData} options={chartOptions} />
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  )
}
