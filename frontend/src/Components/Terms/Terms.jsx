import React from "react";

function Terms() {
  return (
    <div className=" bg-neutral-100 px-6 py-12 flex justify-center items-center min-h-screen">
      <div className="w-full max-w-3xl bg-white rounded-3xl 
                      shadow-[0_20px_60px_-25px_rgba(0,0,0,0.25)]
                      ring-1 ring-black/5
                      px-10 py-12
                      flex flex-col gap-8">

        <h1 className="text-3xl font-semibold tracking-tight text-black">
          Terms of Service
        </h1>

        <div className="flex flex-col gap-6 text-neutral-700 leading-relaxed text-[15px]">
          <p>
            By using We-Meet, you agree to comply with our platform rules and community guidelines.
          </p>

          <p>
            Users are responsible for the content they share and must not post
            harmful, illegal, or abusive material.
          </p>

          <p>
            We reserve the right to suspend or terminate accounts that violate
            our policies.
          </p>

          <p>
            These terms may be updated periodically to reflect changes in our service.
          </p>
        </div>

      </div>
    </div>
  );
}

export default Terms;