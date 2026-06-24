import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar/Navbar";

function About() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f5f5f7] flex flex-col items-center">
      <Navbar />

      <div className="w-full max-w-2xl mx-auto px-4 py-10 flex flex-col gap-2 ">

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
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">About We-Meet</h1>
              <p className="text-sm text-gray-500 mt-0.5">Our mission and vision</p>
            </div>
          </div>

          {/* Content */}
          <div className="flex flex-col gap-5 text-gray-600 text-[15px] leading-relaxed">
            <p>
              We-Meet is a modern social platform built to help people connect,
              share, and express themselves in meaningful ways.
            </p>
            <p>
              Our goal is to create a clean, distraction-free experience that
              focuses on real conversations and authentic engagement.
            </p>
            <p>
              We believe in simplicity, privacy, and thoughtful design —
              building tools that bring people closer together.
            </p>
          </div>

          {/* Tag line */}
          <div className="pt-4 border-t border-gray-100">
            <p className="text-xs font-medium text-indigo-600 uppercase tracking-widest">Speak. Create. Connect.</p>
          </div>

        </div>
      </div>
    </div>
  );
}

export default About;