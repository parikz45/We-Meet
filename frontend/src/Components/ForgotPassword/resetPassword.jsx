// ResetPassword.jsx
import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`https://we-meet-1-h00i.onrender.com/api/auth/reset-password/${token}`, { password });
      toast.success("Password reset successful");
      navigate("/login");
    } catch {
      toast.error("Invalid or expired link");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto mt-20 p-6 bg-white rounded-xl shadow">
      <h2 className="text-lg font-semibold mb-4">Reset Password</h2>
      <input
        type="password"
        className="w-full p-2 border rounded mb-4"
        placeholder="New password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button className="w-full bg-black text-white py-2 rounded">Reset Password</button>
    </form>
  );
}