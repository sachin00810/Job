import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | appname",
  description: "Read the appname Terms of Service.",
};

export default function TermsPage() {
  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="bg-slate-900 text-white py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold">Terms of Service</h1>
          <p className="mt-4 text-slate-400">Last updated: 1 May 2026</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-16 prose prose-slate">
        <div className="space-y-10 text-slate-700">
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">1. Acceptance of Terms</h2>
            <p className="leading-relaxed text-sm">
              By accessing or using appname (&ldquo;the Service&rdquo;), you agree to be bound by
              these Terms of Service. If you do not agree to these terms, please do not use the
              Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">2. Use of the Service</h2>
            <p className="leading-relaxed text-sm">
              You may use the Service only for lawful purposes and in accordance with these Terms.
              You agree not to post false, misleading, or fraudulent listings. appname reserves the
              right to remove any content that violates these Terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">3. User Accounts</h2>
            <p className="leading-relaxed text-sm">
              You are responsible for maintaining the confidentiality of your account credentials.
              You must notify us immediately of any unauthorised use of your account. appname is
              not liable for any loss resulting from unauthorised account access.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">4. Listings and Content</h2>
            <p className="leading-relaxed text-sm">
              Employers and landlords are solely responsible for the accuracy and legality of their
              listings. appname does not endorse, verify, or guarantee any job or room listing and
              is not a party to any transaction between users.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">5. Intellectual Property</h2>
            <p className="leading-relaxed text-sm">
              All content on the Service, excluding user-submitted content, is the property of
              appname and protected by Australian copyright law. You may not reproduce or
              redistribute any part of the Service without our express written permission.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">6. Limitation of Liability</h2>
            <p className="leading-relaxed text-sm">
              To the fullest extent permitted by law, appname shall not be liable for any indirect,
              incidental, or consequential damages arising from your use of the Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">7. Governing Law</h2>
            <p className="leading-relaxed text-sm">
              These Terms are governed by the laws of New South Wales, Australia. Any disputes
              shall be subject to the exclusive jurisdiction of the courts of New South Wales.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">8. Changes to Terms</h2>
            <p className="leading-relaxed text-sm">
              We may update these Terms from time to time. Continued use of the Service after
              changes constitutes your acceptance of the new Terms.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
