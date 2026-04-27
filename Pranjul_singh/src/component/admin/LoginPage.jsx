import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const rawUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
      const API_URL = rawUrl.replace(/\/$/, "");
      const { data } = await axios.post(`${API_URL}/admin/login`, { username, password });
      if (data.success) {
        localStorage.setItem("adminToken", data.token);
        toast.success("Logged in successfully!");
        navigate("/admin/dashboard");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#022c22]">
      <form onSubmit={handleLogin} className="bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-3xl w-96 space-y-6">
        <h2 className="text-3xl font-black text-white text-center">Admin Login</h2>
        <input
          type="text"
          placeholder="Username"
          className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="w-full bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold py-3 rounded-xl transition-colors">
          Login
        </button>
      </form>
    </div>
  );
}
