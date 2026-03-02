import React from "react";

function Help() {
  return (
    <div className=" bg-neutral-100 px-6 py-12 flex justify-center items-center min-h-screen">
      <div className="w-full max-w-3xl bg-white rounded-3xl 
                      shadow-[0_20px_60px_-25px_rgba(0,0,0,0.25)]
                      ring-1 ring-black/5
                      px-10 py-12
                      flex flex-col gap-10">

        <div className="flex flex-col gap-3">
          <h1 className="text-3xl font-semibold tracking-tight text-black">
            Help Center
          </h1>
          <p className="text-neutral-500 text-sm">
            Frequently asked questions and support.
          </p>
        </div>

        <div className="flex flex-col gap-8">

          <div className="flex flex-col gap-2">
            <h3 className="font-semibold text-black">How do I update my profile?</h3>
            <p className="text-neutral-600 text-[15px] leading-relaxed">
              Navigate to your profile and click the edit button to update your information.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="font-semibold text-black">How can I reset my password?</h3>
            <p className="text-neutral-600 text-[15px] leading-relaxed">
              Use the “Forgot password?” option on the login page to reset your password.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="font-semibold text-black">How do I delete my account?</h3>
            <p className="text-neutral-600 text-[15px] leading-relaxed">
              Contact support or access account settings to request account deletion.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}

export default Help;