import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar/Navbar";

const faqs = [
  {
    q: "How do I update my profile?",
    a: "Navigate to your profile and click the edit button to update your information.",
  },
  {
    q: "How can I reset my password?",
    a: 'Use the "Forgot password?" option on the login page to reset your password via email.',
  },
  {
    q: "How do I delete my account?",
    a: "Contact support or access account settings to request account deletion.",
  },
];

function Help() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(null);

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
                <circle cx="12" cy="12" r="10"/>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Help Center</h1>
              <p className="text-sm text-gray-500 mt-0.5">Frequently asked questions</p>
            </div>
          </div>

          {/* Accordion FAQs */}
          <div className="flex flex-col divide-y divide-gray-100">
            {faqs.map((faq, i) => (
              <div key={i} className="py-4">
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="w-full flex items-center justify-between text-left gap-4 group"
                >
                  <span className="text-sm font-medium text-gray-800 group-hover:text-indigo-600 transition">
                    {faq.q}
                  </span>
                  <svg
                    width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    className={`shrink-0 text-gray-400 transition-transform duration-200 ${open === i ? "rotate-180" : ""}`}
                  >
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </button>
                {open === i && (
                  <p className="mt-3 text-sm text-gray-500 leading-relaxed">
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Contact nudge */}
          <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
            <p className="text-xs text-gray-400">Still need help?</p>
            <a
              href="mailto:support@wemeet.app"
              className="text-xs font-medium text-indigo-600 hover:text-indigo-700 transition"
            >
              Contact support →
            </a>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Help;