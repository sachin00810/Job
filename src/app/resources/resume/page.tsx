import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Resume Tips | appname",
  description: "Write a resume that gets noticed by Australian employers.",
};

const tips = [
  {
    title: "Keep it to 2 pages",
    body: "Australian employers expect a concise resume. Two pages is the sweet spot — enough to show experience, short enough to hold attention.",
  },
  {
    title: "Use a clean, simple format",
    body: "Avoid tables, text boxes, and graphics. Applicant tracking systems (ATS) strip complex formatting, and recruiters prefer clarity over design.",
  },
  {
    title: "Start with a strong summary",
    body: "A 2–3 sentence professional summary at the top tells the reader who you are and what you bring before they read a single bullet point.",
  },
  {
    title: "Quantify your achievements",
    body: 'Use numbers wherever possible. "Grew sales by 30%" is far more compelling than "responsible for increasing sales".',
  },
  {
    title: "Tailor it to the job",
    body: "Mirror the keywords from the job description. This helps your resume pass ATS filters and signals you've read the role carefully.",
  },
  {
    title: "List skills relevant to the role",
    body: "Put the most relevant technical and soft skills near the top. Include certifications, software, and tools by name.",
  },
];

export default function ResumeTipsPage() {
  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="bg-indigo-600 text-white py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <p className="text-indigo-300 text-sm font-medium mb-2">Resources</p>
          <h1 className="text-4xl font-bold">Resume Tips</h1>
          <p className="mt-4 text-indigo-100 text-lg">
            Write a resume that gets you to the interview stage.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-16 space-y-12">
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-6">6 Rules for a Great Resume</h2>
          <div className="space-y-4">
            {tips.map((tip, i) => (
              <div key={tip.title} className="bg-white rounded-xl border border-slate-200 p-6 flex gap-4">
                <div className="shrink-0 w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
                  {i + 1}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">{tip.title}</h3>
                  <p className="text-sm text-slate-600">{tip.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Quick checklist before you apply</h2>
          <ul className="space-y-2">
            {[
              "Spell-checked and proofread",
              "Contact details are up to date",
              "All dates are consistent (month/year format)",
              "No gaps left unexplained",
              "Tailored to the specific role",
              "Saved as a PDF",
            ].map((item) => (
              <li key={item} className="flex items-center gap-2 text-sm text-slate-700">
                <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </section>

        <div className="text-center">
          <Link
            href="/jobs"
            className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
          >
            Browse Jobs
          </Link>
        </div>
      </div>
    </div>
  );
}
