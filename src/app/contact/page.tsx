import type { Metadata } from "next";
import Link from "next/link";
import { Mail, MessageCircle, HelpCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact | appname",
  description: "Get in touch with the appname team.",
};

export default function ContactPage() {
  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="bg-indigo-600 text-white py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold">Contact Us</h1>
          <p className="mt-4 text-indigo-100 text-lg">
            We&apos;d love to hear from you.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-16">
        <div className="grid sm:grid-cols-3 gap-6 mb-16">
          <div className="bg-white rounded-xl p-6 border border-slate-200 text-center">
            <Mail className="h-8 w-8 text-indigo-600 mx-auto mb-3" />
            <h3 className="font-semibold text-slate-900 mb-1">Email</h3>
            <p className="text-sm text-slate-500">hello@appname.com.au</p>
          </div>
          <div className="bg-white rounded-xl p-6 border border-slate-200 text-center">
            <MessageCircle className="h-8 w-8 text-indigo-600 mx-auto mb-3" />
            <h3 className="font-semibold text-slate-900 mb-1">Live Chat</h3>
            <p className="text-sm text-slate-500">Available Mon–Fri, 9am–5pm AEST</p>
          </div>
          <div className="bg-white rounded-xl p-6 border border-slate-200 text-center">
            <HelpCircle className="h-8 w-8 text-indigo-600 mx-auto mb-3" />
            <h3 className="font-semibold text-slate-900 mb-1">Help Centre</h3>
            <Link href="/help" className="text-sm text-indigo-600 hover:underline">
              Browse articles
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-8">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Send a message</h2>
          <form className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Name</label>
                <input
                  type="text"
                  required
                  placeholder="Your name"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Subject</label>
              <input
                type="text"
                required
                placeholder="How can we help?"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Message</label>
              <textarea
                required
                rows={5}
                placeholder="Tell us more..."
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
              />
            </div>
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
            >
              Send message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
