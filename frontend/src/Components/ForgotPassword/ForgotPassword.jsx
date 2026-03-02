import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { MailOutline, ArrowBack } from "@mui/icons-material";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.post("https://we-meet-1-h00i.onrender.com/api/auth/forgot-password", { email });
      toast.success("If this email exists, a reset link has been sent");
    } catch {
      toast.error("If this email exists, a reset link has been sent");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="relative w-full flex flex-col gap-[20px] max-w-md bg-white rounded-2xl shadow-xl p-8"
      >
        {/* Back to login */}
        <button
          type="button"
          onClick={() => navigate("/login")}
          className="absolute cursor-pointer -top-10 left-4 flex items-center gap-1 text-sm text-gray-600 hover:text-black transition"
        >
          <ArrowBack fontSize="small" />
          
        </button>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Forgot your password?
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          Enter your email and we’ll send you a reset link.
        </p>

        <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-3 py-2 mb-4">
          <MailOutline className="text-gray-500" />
          <input
            type="email"
            required
            placeholder="Enter your email"
            className="bg-transparent outline-none flex-1 text-sm"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <button
          disabled={loading}
          className="w-full cursor-pointer bg-black text-white py-2 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-60"
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>

        <p className="text-xs text-gray-400 mt-4 text-center">
          You’ll receive an email if the account exists.
        </p>
      </form>
    </div>
  );
}