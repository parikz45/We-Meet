import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar/Navbar";

const sections = [
  {
    title: "Data We Collect",
    body: "We collect only the information necessary to provide and improve our services, such as your email and profile details.",
  },
  {
    title: "How We Use It",
    body: "Your data is used solely to operate and personalize your experience. It is never sold or shared with third parties without your consent.",
  },
  {
    title: "Security",
    body: "We use industry-standard security practices to protect your data from unauthorized access or disclosure.",
  },
  {
    title: "Your Rights",
    body: "You may request to view, update, or delete your personal data at any time by contacting support.",
  },
];

function Privacy() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f5f5f7] flex flex-col items-center">
      <Navbar />

      <div className="w-full max-w-2xl mx-auto px-4 py-10 flex flex-col gap-2">

        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-indigo-600 transition mb-6 group"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-0.5 transition-transform">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          Back
        </button>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm px-8 py-8 flex flex-col gap-8">

          {/* Header */}
          <div className="flex items-center gap-4 pb-6 border-b border-gray-100">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shrink-0">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Privacy Policy</h1>
              <p className="text-sm text-gray-500 mt-0.5">Last updated June 2025</p>
            </div>
          </div>

          {/* Sections */}
          <div className="flex flex-col gap-6">
            {sections.map((s, i) => (
              <div key={i} className="flex gap-4">
                <span className="text-xs font-semibold text-indigo-400 w-5 shrink-0 pt-0.5">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="flex flex-col gap-1">
                  <h3 className="text-sm font-semibold text-gray-800">{s.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{s.body}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Footer note */}
          <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
            <p className="text-xs text-gray-400">Questions about your data?</p>
            <a
              href="mailto:privacy@wemeet.app"
              className="text-xs font-medium text-indigo-600 hover:text-indigo-700 transition"
            >
              privacy@wemeet.app →
            </a>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Privacy;