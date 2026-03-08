import Link from 'next/link'
import Navbar from '../components/Navbar'

export default function Terms() {
  return (
    <div className="min-h-screen bg-[#0f172a] text-white">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 pt-24 pb-20">
        <div className="mb-10">
          <h1 className="text-4xl font-bold mb-3">Terms of Service</h1>
          <p className="text-gray-400">Last updated: {new Date().getFullYear()}</p>
        </div>

        <div className="space-y-10 text-gray-300 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">1. Acceptance of Terms</h2>
            <p>
              By creating an account or using Catmio (&quot;the Service&quot;), you agree to be bound by these Terms of
              Service. If you do not agree to these terms, do not use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">2. Acceptable Use</h2>
            <p className="mb-3">You agree to use Catmio only for lawful purposes. You must not:</p>
            <ul className="list-disc list-inside space-y-1 text-gray-400">
              <li>Use the Service to distribute malicious software or scripts</li>
              <li>Attempt to reverse-engineer, hack, or compromise the platform</li>
              <li>Abuse the platform to harass, threaten, or harm others</li>
              <li>Create multiple accounts to circumvent bans or restrictions</li>
              <li>Use automated tools to scrape or abuse the API beyond reasonable use</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">3. User Responsibility</h2>
            <p>
              You are solely responsible for the content of scripts you protect and distribute using Catmio. We do
              not review script contents and take no responsibility for how your scripts are used by end users. You
              agree to indemnify Catmio against any claims arising from your use of the Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">4. Account Suspension Rights</h2>
            <p>
              Catmio reserves the right to suspend or permanently ban any account at any time, with or without prior
              notice, if we determine that the account is being used in violation of these Terms of Service or in a
              manner that is harmful to the platform or its users.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">5. Limitations of Liability</h2>
            <p>
              Catmio is provided &quot;as is&quot; without warranties of any kind. We are not liable for any indirect,
              incidental, or consequential damages arising from your use of the Service, including but not limited to
              loss of data, lost revenue, or service interruption.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">6. Changes to Terms</h2>
            <p>
              We may update these Terms at any time. Continued use of the Service after changes are posted constitutes
              your acceptance of the revised Terms. We recommend reviewing this page periodically.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">7. Contact</h2>
            <p>
              Questions about these Terms?{' '}
              <a href="mailto:catmiosupport@gmail.com" className="text-blue-400 hover:text-blue-300">
                catmiosupport@gmail.com
              </a>
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
