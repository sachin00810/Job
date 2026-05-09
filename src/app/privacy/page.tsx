import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | appname",
  description: "Read the appname Privacy Policy.",
};

export default function PrivacyPage() {
  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="bg-slate-900 text-white py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold">Privacy Policy</h1>
          <p className="mt-4 text-slate-400">Last updated: 1 May 2026</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-16">
        <div className="space-y-10 text-slate-700">
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">1. Information We Collect</h2>
            <p className="leading-relaxed text-sm">
              We collect information you provide directly to us when you create an account, post a
              listing, or contact support. This may include your name, email address, and any
              content you submit.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">2. How We Use Your Information</h2>
            <p className="leading-relaxed text-sm">
              We use the information we collect to operate and improve the Service, communicate
              with you, and ensure the safety of our platform. We do not sell your personal
              information to third parties.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">3. Cookies</h2>
            <p className="leading-relaxed text-sm">
              We use cookies and similar technologies to remember your preferences and analyse how
              the Service is used. You can control cookie settings through your browser, though
              disabling cookies may affect some functionality.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">4. Data Storage</h2>
            <p className="leading-relaxed text-sm">
              Your data is stored on servers located in Australia. We implement reasonable security
              measures to protect your information from unauthorised access or disclosure.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">5. Your Rights</h2>
            <p className="leading-relaxed text-sm">
              Under the Australian Privacy Act 1988, you have the right to access, correct, and
              request deletion of your personal information. To exercise these rights, contact us
              at privacy@appname.com.au.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">6. Third-Party Services</h2>
            <p className="leading-relaxed text-sm">
              We may use third-party services such as analytics providers. These services have
              their own privacy policies and we encourage you to review them.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">7. Changes to This Policy</h2>
            <p className="leading-relaxed text-sm">
              We may update this Privacy Policy from time to time. We will notify you of
              significant changes by posting a notice on the Service.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
