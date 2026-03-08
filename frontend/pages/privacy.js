import Link from 'next/link'
import Navbar from '../components/Navbar'

export default function Privacy() {
  return (
    <div className="min-h-screen bg-[#0f172a] text-white">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 pt-24 pb-20">
        <div className="mb-10">
          <h1 className="text-4xl font-bold mb-3">Privacy Policy</h1>
          <p className="text-gray-400">Last updated: {new Date().getFullYear()}</p>
        </div>

        <div className="space-y-10 text-gray-300 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">1. Overview</h2>
            <p>
              Catmio (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) is committed to protecting your privacy. This Privacy Policy explains what
              data we collect, how we use it, and your rights regarding your information.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">2. Data We Collect</h2>
            <p className="mb-3">We collect the following categories of data:</p>
            <div className="space-y-3">
              <div className="bg-[#1e293b] rounded-xl p-4">
                <h3 className="font-medium text-white mb-1">Account Information</h3>
                <p className="text-sm text-gray-400">Email address and hashed password, collected at registration.</p>
              </div>
              <div className="bg-[#1e293b] rounded-xl p-4">
                <h3 className="font-medium text-white mb-1">IP Address</h3>
                <p className="text-sm text-gray-400">
                  Logged with every script execution for security and fraud detection purposes.
                </p>
              </div>
              <div className="bg-[#1e293b] rounded-xl p-4">
                <h3 className="font-medium text-white mb-1">Hardware ID (HWID)</h3>
                <p className="text-sm text-gray-400">
                  A hardware identifier provided by your application on execution. Used to bind your account
                  to a specific device and enforce HWID bans.
                </p>
              </div>
              <div className="bg-[#1e293b] rounded-xl p-4">
                <h3 className="font-medium text-white mb-1">Execution Logs</h3>
                <p className="text-sm text-gray-400">
                  Script name, game name, IP, HWID, and timestamp for every script execution.
                </p>
              </div>
              <div className="bg-[#1e293b] rounded-xl p-4">
                <h3 className="font-medium text-white mb-1">Webhook URL</h3>
                <p className="text-sm text-gray-400">
                  If configured, your webhook endpoint is stored to deliver execution notifications.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">3. How We Use Your Data</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-400">
              <li>To provide and operate the Catmio platform</li>
              <li>To authenticate your account and enforce security policies</li>
              <li>To detect and prevent abuse, fraud, and unauthorized access</li>
              <li>To deliver webhook notifications you have configured</li>
              <li>To provide execution analytics and statistics in your dashboard</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">4. Data Sharing</h2>
            <p>
              We do not sell, rent, or share your personal data with third parties except where required by law or
              to operate core platform functionality (e.g., email delivery services for verification emails).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">5. Data Retention</h2>
            <p>
              Account data is retained for as long as your account is active. Execution logs are retained for up to
              90 days by default. Upon account deletion, all personal data is permanently removed within 30 days.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">6. Your Rights</h2>
            <p className="mb-2">You have the right to:</p>
            <ul className="list-disc list-inside space-y-1 text-gray-400">
              <li>Access the data we hold about you</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your account and associated data</li>
              <li>Object to certain processing activities</li>
            </ul>
            <p className="mt-3">
              To exercise any of these rights, contact us at{' '}
              <a href="mailto:catmiosupport@gmail.com" className="text-blue-400 hover:text-blue-300">
                catmiosupport@gmail.com
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">7. Security</h2>
            <p>
              We implement industry-standard security measures including encrypted connections (HTTPS), hashed
              password storage, and JWT-based authentication. However, no system is 100% secure, and we encourage
              you to use a strong, unique password.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">8. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify users of significant changes via
              email or a dashboard notice. Continued use of the Service constitutes acceptance of the updated policy.
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10">
          <Link href="/" className="text-blue-400 hover:text-blue-300 text-sm">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
