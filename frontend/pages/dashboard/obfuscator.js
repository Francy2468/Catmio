import { useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import api from '../../lib/api'

const PRESETS = ['Minify', 'Weak', 'Medium', 'Strong', 'DisableAntiTamper']

export default function Obfuscator() {
  const [code, setCode] = useState('')
  const [preset, setPreset] = useState('Medium')
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const handleObfuscate = async () => {
    if (!code.trim()) {
      setError('Please enter code to obfuscate.')
      return
    }
    setError('')
    setLoading(true)
    try {
      const { data } = await api.post('/api/obfuscator', { code, preset })
      setOutput(data.result || data.output || '')
    } catch (err) {
      setError(err.response?.data?.message || 'Obfuscation failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = async () => {
    if (!output) return
    await navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    if (!output) return
    const blob = new Blob([output], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'obfuscated.lua'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Obfuscator</h1>
        <p className="text-gray-400 text-sm mt-1">Protect your Lua scripts with obfuscation</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Input */}
        <div className="bg-[#1e293b] border border-white/5 rounded-2xl p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <h2 className="font-semibold text-sm text-gray-300">Input Code</h2>
            <div className="flex items-center gap-3">
              <label className="text-sm text-gray-400">Preset:</label>
              <select
                value={preset}
                onChange={(e) => setPreset(e.target.value)}
                className="bg-[#0f172a] border border-white/10 text-white rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {PRESETS.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
          </div>

          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="-- Paste your Lua code here..."
            className="flex-1 min-h-[300px] bg-[#0f172a] border border-white/10 text-white placeholder-gray-600 rounded-lg px-4 py-3 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {error && (
            <p className="text-red-400 text-sm">{error}</p>
          )}

          <button
            onClick={handleObfuscate}
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg py-3 transition-colors flex items-center justify-center gap-2"
          >
            {loading && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
            {loading ? 'Obfuscating…' : 'Obfuscate'}
          </button>
        </div>

        {/* Output */}
        <div className="bg-[#1e293b] border border-white/5 rounded-2xl p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-sm text-gray-300">Output</h2>
            {output && (
              <div className="flex gap-2">
                <button
                  onClick={handleCopy}
                  className="text-xs bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1.5 rounded-lg transition-colors"
                >
                  {copied ? '✓ Copied' : 'Copy'}
                </button>
                <button
                  onClick={handleDownload}
                  className="text-xs bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/30 px-3 py-1.5 rounded-lg transition-colors"
                >
                  Download
                </button>
              </div>
            )}
          </div>

          <textarea
            readOnly
            value={output}
            placeholder="Obfuscated code will appear here…"
            className="flex-1 min-h-[300px] bg-[#0f172a] border border-white/10 text-green-400 placeholder-gray-600 rounded-lg px-4 py-3 font-mono text-sm resize-none focus:outline-none"
          />
        </div>
      </div>
    </DashboardLayout>
  )
}
