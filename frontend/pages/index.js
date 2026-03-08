import Link from 'next/link'
import Navbar from '../components/Navbar'

const features = [
  {
    title: 'Script Protection',
    description: 'Obfuscate and protect your Lua scripts with multiple strength levels to prevent unauthorized access.',
    icon: '🔒',
  },
  {
    title: 'Execution Logging',
    description: 'Track every script execution with IP address, HWID, timestamp, and game information.',
    icon: '📋',
  },
  {
    title: 'HWID Ban System',
    description: 'Ban specific hardware IDs to prevent abusive users from accessing your scripts.',
    icon: '🚫',
  },
  {
    title: 'Webhook Notifications',
    description: 'Receive real-time notifications for every execution event via webhook integrations.',
    icon: '🔔',
  },
  {
    title: 'Admin Panel',
    description: 'Manage all users, view analytics, and control your platform from a powerful admin dashboard.',
    icon: '⚙️',
  },
  {
    title: 'Analytics',
    description: 'Visualize execution trends, top scripts, and user activity with detailed charts and tables.',
    icon: '📊',
  },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0f172a] text-white">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden pt-24 pb-20 px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-5xl mx-auto text-center relative">
          <span className="inline-block bg-blue-500/20 text-blue-400 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            Script Security Platform
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            Protect &amp; Track Your Scripts with{' '}
            <span className="text-blue-500">Catmio</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10">
            The complete platform for Lua script authors. Obfuscate, distribute, and monitor your
            scripts with enterprise-grade security and detailed analytics.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="px-8 py-3.5 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition-colors text-center"
            >
              Get Started — Free
            </Link>
            <Link
              href="/login"
              className="px-8 py-3.5 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-xl border border-white/10 transition-colors text-center"
            >
              Login
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-[#1e293b]/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Everything You Need</h2>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">
              Catmio provides all the tools you need to secure and manage your Lua scripts.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-[#1e293b] border border-white/5 rounded-2xl p-6 hover:border-blue-500/30 transition-colors"
              >
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to secure your scripts?</h2>
          <p className="text-gray-400 mb-8">
            Join Catmio today and take control of your script distribution.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="px-8 py-3.5 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition-colors"
            >
              Create Free Account
            </Link>
            <Link
              href="/docs"
              className="px-8 py-3.5 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-xl border border-white/10 transition-colors"
            >
              Read the Docs
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-blue-500 font-bold text-lg">Catmio</span>
          <div className="flex gap-6 text-sm text-gray-500">
            <Link href="/docs" className="hover:text-white transition-colors">Docs</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
          </div>
          <p className="text-sm text-gray-500">© {new Date().getFullYear()} Catmio. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
