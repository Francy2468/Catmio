import DashboardLayout from '../../layouts/DashboardLayout'

const faqs = [
  {
    q: 'How do I get my loader key?',
    a: 'Your loader key is available in the dashboard overview. It is generated automatically when you first register.',
  },
  {
    q: 'Why am I getting a HWID mismatch error?',
    a: 'HWID errors occur when your hardware ID has changed (e.g., after a system reinstall). Go to Settings → Reset HWID to clear it.',
  },
  {
    q: 'How do I set up webhook notifications?',
    a: 'Navigate to Settings → Webhook, paste your Discord or HTTP webhook URL, and click Save. Use the Test button to verify it works.',
  },
  {
    q: 'What obfuscation preset should I use?',
    a: 'For maximum protection use "Strong". For balance between size and security use "Medium". "Minify" only reduces file size without adding security.',
  },
  {
    q: 'What happens if I get banned?',
    a: 'If your account is banned you will not be able to execute scripts. Contact support at catmiosupport@gmail.com for assistance.',
  },
]

export default function Support() {
  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Support</h1>
        <p className="text-gray-400 text-sm mt-1">Get help with your Catmio account</p>
      </div>

      <div className="max-w-2xl space-y-6">
        {/* Contact */}
        <div className="bg-[#1e293b] border border-white/5 rounded-2xl p-6">
          <h2 className="font-semibold mb-4 text-lg">Contact Us</h2>
          <div className="flex items-start gap-4">
            <div className="text-3xl">📧</div>
            <div>
              <p className="text-gray-300 mb-1">
                Email us at{' '}
                <a
                  href="mailto:catmiosupport@gmail.com"
                  className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                >
                  catmiosupport@gmail.com
                </a>
              </p>
              <p className="text-sm text-gray-500">
                We typically respond within <span className="text-gray-300 font-medium">24–48 hours</span> on business days.
              </p>
            </div>
          </div>
        </div>

        {/* Response time notice */}
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-2xl p-5">
          <div className="flex items-start gap-3">
            <span className="text-blue-400 text-xl">ℹ️</span>
            <div>
              <p className="text-blue-300 font-medium text-sm mb-1">Response Time</p>
              <p className="text-sm text-blue-200/70">
                Support requests are answered within 24–48 hours. For faster assistance, include your account email,
                a description of the issue, and any relevant error messages.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-[#1e293b] border border-white/5 rounded-2xl p-6">
          <h2 className="font-semibold mb-5 text-lg">Frequently Asked Questions</h2>
          <div className="space-y-5">
            {faqs.map((faq, i) => (
              <div key={i} className="border-b border-white/5 last:border-0 pb-5 last:pb-0">
                <h3 className="font-medium text-white mb-1.5">{faq.q}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
