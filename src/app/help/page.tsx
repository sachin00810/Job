import type { Metadata } from "next";
import Link from "next/link";
import { Briefcase, Home, User, Shield } from "lucide-react";

export const metadata: Metadata = {
  title: "Help Centre | appname",
  description: "Find answers to common questions about using appname.",
};

const topics = [
  {
    icon: Briefcase,
    title: "Finding Jobs",
    items: [
      "How do I search for jobs?",
      "What does visa sponsorship mean?",
      "How do I apply for a job?",
      "Can I save jobs I like?",
    ],
  },
  {
    icon: Home,
    title: "Finding Rooms",
    items: [
      "How do I search for rooms?",
      "What is a bond?",
      "How do I contact a landlord?",
      "What does bills included mean?",
    ],
  },
  {
    icon: User,
    title: "My Account",
    items: [
      "How do I create an account?",
      "How do I reset my password?",
      "Can I change my email address?",
      "How do I delete my account?",
    ],
  },
  {
    icon: Shield,
    title: "Safety & Trust",
    items: [
      "How do I report a suspicious listing?",
      "Are employers verified?",
      "How do I stay safe when renting?",
      "What is the refund policy for ads?",
    ],
  },
];

export default function HelpPage() {
  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="bg-indigo-600 text-white py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-bold">Help Centre</h1>
          <p className="mt-4 text-indigo-100 text-lg">
            How can we help you today?
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="grid sm:grid-cols-2 gap-6 mb-12">
          {topics.map(({ icon: Icon, title, items }) => (
            <div key={title} className="bg-white rounded-xl p-6 border border-slate-200">
              <div className="flex items-center gap-3 mb-4">
                <Icon className="h-5 w-5 text-indigo-600" />
                <h2 className="font-semibold text-slate-900">{title}</h2>
              </div>
              <ul className="space-y-2">
                {items.map((item) => (
                  <li key={item}>
                    <button className="text-sm text-indigo-600 hover:underline text-left">
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="bg-indigo-50 rounded-2xl p-8 text-center border border-indigo-100">
          <h3 className="font-bold text-slate-900 text-lg mb-2">
            Still can&apos;t find an answer?
          </h3>
          <p className="text-slate-600 text-sm mb-5">
            Our support team is here Mon–Fri, 9am–5pm AEST.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
          >
            Contact support
          </Link>
        </div>
      </div>
    </div>
  );
}
