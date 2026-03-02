import React from "react";

function Privacy() {
  return (
    <div className="bg-neutral-100 px-6 py-12 flex justify-center items-center min-h-screen">
      <div className="w-full max-w-3xl bg-white rounded-3xl 
                      shadow-[0_20px_60px_-25px_rgba(0,0,0,0.25)]
                      ring-1 ring-black/5
                      px-10 py-12
                      flex flex-col gap-8">

        <h1 className="text-3xl font-semibold tracking-tight text-black">
          Privacy Policy
        </h1>

        <div className="flex flex-col gap-6 text-neutral-700 leading-relaxed text-[15px]">
          <p>
            Your privacy is important to us. We collect only the information
            necessary to provide and improve our services.
          </p>

          <p>
            Personal data such as email and profile details are securely stored
            and not shared with third parties without consent.
          </p>

          <p>
            We use standard security practices to protect user data.
          </p>

          <p>
            You may request data updates or deletion at any time.
          </p>
        </div>

      </div>
    </div>
  );
}

export default Privacy;