import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar/Navbar";

const sections = [
  {
    title: "Acceptable Use",
    body: "By using We-Meet, you agree to comply with our platform rules and community guidelines at all times.",
  },
  {
    title: "User Responsibility",
    body: "Users are responsible for the content they share and must not post harmful, illegal, or abusive material.",
  },
  {
    title: "Account Suspension",
    body: "We reserve the right to suspend or terminate accounts that violate our policies without prior notice.",
  },
  {
    title: "Updates to Terms",
    body: "These terms may be updated periodically to reflect changes in our service. Continued use constitutes acceptance.",
  },
];

function Terms() {
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
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
                <polyline points="10 9 9 9 8 9"/>
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Terms of Service</h1>
              <p className="text-sm text-gray-500 mt-0.5">Last updated June 2025</p>
            </div>
          </div>

          {/* Sections */}
          <div className="flex flex-col gap-6">
            {sections.map((s, i) => (
              <div key={i} className="flex gap-4">
                <span className="mt-0.5 text-xs font-semibold text-indigo-400 w-5 shrink-0 pt-0.5">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="flex flex-col gap-1">
                  <h3 className="text-sm font-semibold text-gray-800">{s.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{s.body}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}

export default Terms;