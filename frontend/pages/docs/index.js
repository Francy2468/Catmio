import Link from 'next/link'
import Navbar from '../../components/Navbar'

const sections = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    content: [
      {
        heading: 'Create an Account',
        body: 'Register at catmio.io/register with your email and password. After registration you will receive a verification email — click the link to activate your account.',
      },
      {
        heading: 'Access Your Dashboard',
        body: 'Once verified, log in and you will be taken to your dashboard. Here you can view execution stats, manage settings, and use the obfuscator.',
      },
      {
        heading: 'Integrate Your Script',
        body: 'Use the Loader API (see below) to load your script. Catmio will log every execution and optionally send webhook notifications.',
      },
    ],
  },
  {
    id: 'obfuscator',
    title: 'Obfuscator Guide',
    content: [
      {
        heading: 'Available Presets',
        body: 'Minify: Removes whitespace and comments only. Weak: Basic variable renaming and string encoding. Medium: String encryption, control flow obfuscation. Strong: Full obfuscation with anti-debug and string splitting. DisableAntiTamper: Like Strong but without integrity checks (for compatibility).',
      },
      {
        heading: 'Usage',
        body: 'Paste your Lua code into the input field, select a preset, and click Obfuscate. The output can be copied or downloaded as a .lua file.',
      },
      {
        heading: 'Recommendations',
        body: 'Use Medium or Strong for production scripts. Note that heavier obfuscation increases script size and may slightly impact load time.',
      },
    ],
  },
  {
    id: 'loader-api',
    title: 'Loader API',
    content: [
      {
        heading: 'Endpoint',
        body: 'POST /api/loader/execute — Submit a script execution event.',
      },
      {
        heading: 'Request Body',
        body: 'JSON: { "script_name": "MyScript", "game_name": "MyGame", "hwid": "<hardware_id>" }. Include the Authorization: Bearer <token> header.',
      },
      {
        heading: 'Response',
        body: '200 OK: { "status": "ok" }. 403 Forbidden: { "message": "HWID banned" }. 401 Unauthorized: Token missing or invalid.',
      },
    ],
  },
  {
    id: 'webhooks',
    title: 'Webhook System',
    content: [
      {
        heading: 'Setup',
        body: 'Go to Dashboard → Settings → Webhook. Paste a Discord webhook URL or any HTTP endpoint that accepts POST with a JSON body.',
      },
      {
        heading: 'Payload Format',
        body: 'Every execution sends: { "event": "execution", "script_name": "...", "game_name": "...", "ip": "...", "hwid": "...", "timestamp": "ISO8601" }.',
      },
      {
        heading: 'Testing',
        body: 'Use the Test button in settings to send a sample payload to your configured webhook URL.',
      },
    ],
  },
  {
    id: 'security',
    title: 'Security Features',
    content: [
      {
        heading: 'HWID Binding',
        body: 'Each user account can be bound to a hardware ID. On first execution the HWID is registered. Subsequent executions from different hardware will be blocked.',
      },
      {
        heading: 'HWID Ban System',
        body: 'Admins can ban specific HWIDs to prevent abusive users from re-registering with a different account.',
      },
      {
        heading: 'IP Logging',
        body: 'Every execution logs the originating IP address for security auditing purposes.',
      },
      {
        heading: 'Email Verification',
        body: 'All accounts require email verification before access is granted, preventing spam registrations.',
      },
    ],
  },
]

export default function Docs() {
  return (
    <div className="min-h-screen bg-[#0f172a] text-white">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 pt-24 pb-20">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-3">Documentation</h1>
          <p className="text-gray-400 text-lg">Everything you need to know about using Catmio.</p>
        </div>

        {/* TOC */}
        <div className="bg-[#1e293b] border border-white/5 rounded-2xl p-6 mb-10">
          <h2 className="font-semibold text-sm text-gray-400 uppercase tracking-wider mb-3">Contents</h2>
          <ul className="space-y-2">
            {sections.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className="text-blue-400 hover:text-blue-300 transition-colors text-sm"
                >
                  {s.title}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Sections */}
        <div className="space-y-12">
          {sections.map((section) => (
            <div key={section.id} id={section.id}>
              <h2 className="text-2xl font-bold mb-6 pb-3 border-b border-white/10">{section.title}</h2>
              <div className="space-y-6">
                {section.content.map((item, i) => (
                  <div key={i}>
                    <h3 className="text-lg font-semibold mb-2 text-blue-400">{item.heading}</h3>
                    <p className="text-gray-300 leading-relaxed">{item.body}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 text-center">
          <p className="text-gray-500 text-sm">
            Need more help?{' '}
            <Link href="/dashboard/support" className="text-blue-400 hover:text-blue-300">
              Contact support
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
