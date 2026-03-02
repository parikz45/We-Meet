import React from "react";

function About() {
  return (
    <div className="bg-neutral-100 px-6 py-12 flex justify-center items-center min-h-screen">
      <div className="w-full max-w-3xl bg-white rounded-3xl 
                      shadow-[0_20px_60px_-25px_rgba(0,0,0,0.25)] 
                      ring-1 ring-black/5
                      px-10 py-12
                      flex flex-col gap-8">

        <div className="flex flex-col gap-3">
          <h1 className="text-3xl font-semibold tracking-tight text-black">
            About We-Meet
          </h1>
          <p className="text-neutral-500 text-sm">
            Learn more about our mission and vision.
          </p>
        </div>

        <div className="flex flex-col gap-6 text-neutral-700 leading-relaxed text-[15px]">
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

      </div>
    </div>
  );
}

export default About;