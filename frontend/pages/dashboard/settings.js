import { useEffect, useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import LoadingSpinner from '../../components/LoadingSpinner'
import api from '../../lib/api'
import { getUser } from '../../lib/auth'

export default function Settings() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Email form
  const [emailForm, setEmailForm] = useState({ email: '' })
  const [emailMsg, setEmailMsg] = useState({ type: '', text: '' })
  const [emailLoading, setEmailLoading] = useState(false)

  // Password form
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [pwMsg, setPwMsg] = useState({ type: '', text: '' })
  const [pwLoading, setPwLoading] = useState(false)

  // Webhook
  const [webhook, setWebhook] = useState('')
  const [webhookMsg, setWebhookMsg] = useState({ type: '', text: '' })
  const [webhookLoading, setWebhookLoading] = useState(false)

  // HWID
  const [hwid, setHwid] = useState('')
  const [hwidMsg, setHwidMsg] = useState({ type: '', text: '' })
  const [hwidLoading, setHwidLoading] = useState(false)

  useEffect(() => {
    api
      .get('/api/user/profile')
      .then(({ data }) => {
        setUser(data)
        setEmailForm({ email: data.email || '' })
        setWebhook(data.webhook_url || '')
        setHwid(data.hwid || '')
      })
      .catch(() => {
        const u = getUser()
        if (u) {
          setEmailForm({ email: u.email || '' })
        }
      })
      .finally(() => setLoading(false))
  }, [])

  const handleEmailSubmit = async (e) => {
    e.preventDefault()
    setEmailMsg({ type: '', text: '' })
    setEmailLoading(true)
    try {
      await api.put('/api/user/email', emailForm)
      setEmailMsg({ type: 'success', text: 'Email updated successfully.' })
    } catch (err) {
      setEmailMsg({ type: 'error', text: err.response?.data?.message || 'Failed to update email.' })
    } finally {
      setEmailLoading(false)
    }
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    setPwMsg({ type: '', text: '' })
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      setPwMsg({ type: 'error', text: 'New passwords do not match.' })
      return
    }
    if (pwForm.newPassword.length < 8) {
      setPwMsg({ type: 'error', text: 'Password must be at least 8 characters.' })
      return
    }
    setPwLoading(true)
    try {
      await api.put('/api/user/password', {
        currentPassword: pwForm.currentPassword,
        newPassword: pwForm.newPassword,
      })
      setPwMsg({ type: 'success', text: 'Password updated successfully.' })
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (err) {
      setPwMsg({ type: 'error', text: err.response?.data?.message || 'Failed to update password.' })
    } finally {
      setPwLoading(false)
    }
  }

  const handleWebhookSave = async () => {
    setWebhookMsg({ type: '', text: '' })
    setWebhookLoading(true)
    try {
      await api.put('/api/user/webhook', { webhook_url: webhook })
      setWebhookMsg({ type: 'success', text: 'Webhook URL saved.' })
    } catch (err) {
      setWebhookMsg({ type: 'error', text: err.response?.data?.message || 'Failed to save webhook.' })
    } finally {
      setWebhookLoading(false)
    }
  }

  const handleWebhookTest = async () => {
    setWebhookMsg({ type: '', text: '' })
    setWebhookLoading(true)
    try {
      await api.post('/api/user/webhook/test')
      setWebhookMsg({ type: 'success', text: 'Test webhook sent successfully.' })
    } catch (err) {
      setWebhookMsg({ type: 'error', text: err.response?.data?.message || 'Failed to send test webhook.' })
    } finally {
      setWebhookLoading(false)
    }
  }

  const handleHwidReset = async () => {
    if (!window.confirm('Are you sure you want to reset your HWID?')) return
    setHwidMsg({ type: '', text: '' })
    setHwidLoading(true)
    try {
      const { data } = await api.post('/api/user/hwid/reset')
      setHwid(data.hwid || '')
      setHwidMsg({ type: 'success', text: 'HWID reset successfully.' })
    } catch (err) {
      setHwidMsg({ type: 'error', text: err.response?.data?.message || 'Failed to reset HWID.' })
    } finally {
      setHwidLoading(false)
    }
  }

  const msgClass = (type) =>
    type === 'success'
      ? 'text-green-400 bg-green-500/10 border border-green-500/30'
      : 'text-red-400 bg-red-500/10 border border-red-500/30'

  const inputClass =
    'w-full bg-[#0f172a] border border-white/10 text-white placeholder-gray-600 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm'

  if (loading) return <DashboardLayout><LoadingSpinner /></DashboardLayout>

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-gray-400 text-sm mt-1">Manage your account preferences</p>
      </div>

      <div className="space-y-6 max-w-2xl">
        {/* Change Email */}
        <div className="bg-[#1e293b] border border-white/5 rounded-2xl p-6">
          <h2 className="font-semibold mb-4">Change Email</h2>
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <input
              type="email"
              value={emailForm.email}
              onChange={(e) => setEmailForm({ email: e.target.value })}
              placeholder="New email address"
              required
              className={inputClass}
            />
            {emailMsg.text && (
              <p className={`text-sm rounded-lg px-3 py-2 ${msgClass(emailMsg.type)}`}>{emailMsg.text}</p>
            )}
            <button
              type="submit"
              disabled={emailLoading}
              className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white font-medium rounded-lg px-6 py-2.5 text-sm transition-colors flex items-center gap-2"
            >
              {emailLoading && <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
              Save Email
            </button>
          </form>
        </div>

        {/* Change Password */}
        <div className="bg-[#1e293b] border border-white/5 rounded-2xl p-6">
          <h2 className="font-semibold mb-4">Change Password</h2>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <input
              type="password"
              value={pwForm.currentPassword}
              onChange={(e) => setPwForm({ ...pwForm, currentPassword: e.target.value })}
              placeholder="Current password"
              required
              className={inputClass}
            />
            <input
              type="password"
              value={pwForm.newPassword}
              onChange={(e) => setPwForm({ ...pwForm, newPassword: e.target.value })}
              placeholder="New password (min. 8 characters)"
              required
              className={inputClass}
            />
            <input
              type="password"
              value={pwForm.confirmPassword}
              onChange={(e) => setPwForm({ ...pwForm, confirmPassword: e.target.value })}
              placeholder="Confirm new password"
              required
              className={inputClass}
            />
            {pwMsg.text && (
              <p className={`text-sm rounded-lg px-3 py-2 ${msgClass(pwMsg.type)}`}>{pwMsg.text}</p>
            )}
            <button
              type="submit"
              disabled={pwLoading}
              className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white font-medium rounded-lg px-6 py-2.5 text-sm transition-colors flex items-center gap-2"
            >
              {pwLoading && <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
              Update Password
            </button>
          </form>
        </div>

        {/* Webhook */}
        <div className="bg-[#1e293b] border border-white/5 rounded-2xl p-6">
          <h2 className="font-semibold mb-4">Webhook</h2>
          <div className="space-y-4">
            <input
              type="url"
              value={webhook}
              onChange={(e) => setWebhook(e.target.value)}
              placeholder="https://discord.com/api/webhooks/…"
              className={inputClass}
            />
            {webhookMsg.text && (
              <p className={`text-sm rounded-lg px-3 py-2 ${msgClass(webhookMsg.type)}`}>{webhookMsg.text}</p>
            )}
            <div className="flex gap-3">
              <button
                onClick={handleWebhookSave}
                disabled={webhookLoading}
                className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white font-medium rounded-lg px-6 py-2.5 text-sm transition-colors"
              >
                Save
              </button>
              <button
                onClick={handleWebhookTest}
                disabled={webhookLoading}
                className="bg-white/5 hover:bg-white/10 disabled:opacity-50 border border-white/10 text-white font-medium rounded-lg px-6 py-2.5 text-sm transition-colors"
              >
                Test
              </button>
            </div>
          </div>
        </div>

        {/* HWID */}
        <div className="bg-[#1e293b] border border-white/5 rounded-2xl p-6">
          <h2 className="font-semibold mb-4">Hardware ID (HWID)</h2>
          <div className="space-y-4">
            <div className="bg-[#0f172a] border border-white/10 rounded-lg px-4 py-3 font-mono text-sm text-gray-300 break-all">
              {hwid || 'No HWID registered'}
            </div>
            {hwidMsg.text && (
              <p className={`text-sm rounded-lg px-3 py-2 ${msgClass(hwidMsg.type)}`}>{hwidMsg.text}</p>
            )}
            <button
              onClick={handleHwidReset}
              disabled={hwidLoading}
              className="bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 font-medium rounded-lg px-6 py-2.5 text-sm transition-colors flex items-center gap-2"
            >
              {hwidLoading && <span className="w-3.5 h-3.5 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin" />}
              Reset HWID
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
