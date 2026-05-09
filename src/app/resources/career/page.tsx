import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Career Advice | appname",
  description: "Tips and guides to help you land your next job in Australia.",
};

const articles = [
  {
    category: "Interviews",
    title: "How to Prepare for a Behavioural Interview",
    excerpt: "Master the STAR method and walk into your next interview with confidence.",
    readTime: "5 min read",
  },
  {
    category: "Job Search",
    title: "10 Ways to Stand Out in a Competitive Market",
    excerpt: "Practical strategies to get your application noticed by hiring managers.",
    readTime: "7 min read",
  },
  {
    category: "Salary",
    title: "How to Negotiate Your Salary in Australia",
    excerpt: "Know your worth and learn how to have the money conversation without awkwardness.",
    readTime: "6 min read",
  },
  {
    category: "Visa & Work Rights",
    title: "Working in Australia on a Student Visa",
    excerpt: "Everything you need to know about work hour limits and finding your first job.",
    readTime: "8 min read",
  },
  {
    category: "Career Change",
    title: "Switching Careers at 30: A Practical Guide",
    excerpt: "It's never too late. Here's how to make a confident leap into a new field.",
    readTime: "9 min read",
  },
  {
    category: "Remote Work",
    title: "Landing a Remote Job in Australia",
    excerpt: "The best platforms, strategies, and red flags to watch for when job hunting remotely.",
    readTime: "5 min read",
  },
];

export default function CareerAdvicePage() {
  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="bg-indigo-600 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <p className="text-indigo-300 text-sm font-medium mb-2">Resources</p>
          <h1 className="text-4xl font-bold">Career Advice</h1>
          <p className="mt-4 text-indigo-100 text-lg max-w-xl">
            Expert tips and practical guides to help you grow your career in Australia.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <div
              key={article.title}
              className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md transition-shadow"
            >
              <span className="inline-block text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full mb-3">
                {article.category}
              </span>
              <h2 className="font-bold text-slate-900 mb-2 leading-snug">{article.title}</h2>
              <p className="text-sm text-slate-500 mb-4">{article.excerpt}</p>
              <p className="text-xs text-slate-400">{article.readTime}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-indigo-50 rounded-2xl p-8 text-center border border-indigo-100">
          <h3 className="font-bold text-slate-900 text-lg mb-2">Ready to find your next role?</h3>
          <p className="text-slate-600 text-sm mb-5">Browse thousands of jobs across Australia.</p>
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
