/*import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email: form.email,
        password: form.password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      alert("Login Successful");

      navigate("/");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-3xl bg-white border border-gray-200 p-10 shadow-lg">
        <div className="text-center mb-10">
          <h1 className="text-5xl tracking-[8px] text-[#d6b45a] font-serif">
            LUMIERE
          </h1>

          <p className="text-xs tracking-[4px] text-gray-500 mt-3">
            BEAUTY RETAIL SUITE
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-xs uppercase tracking-[2px] text-gray-600 mb-2">
              Email Address
            </label>

            <div className="relative">
              <Mail
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="admin@lumiere.com"
                required
                className="w-full pl-12 pr-4 py-4 rounded-xl bg-gray-100 border border-gray-300 text-black focus:outline-none focus:border-[#d6b45a]"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs uppercase tracking-[2px] text-gray-600 mb-2">
              Password
            </label>

            <div className="relative">
              <Lock
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="********"
                required
                className="w-full pl-12 pr-4 py-4 rounded-xl bg-gray-100 border border-gray-300 text-black focus:outline-none focus:border-[#d6b45a]"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl bg-[#d6b45a] text-black font-semibold hover:brightness-110"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
          //google buton{" "}
          <div className="mt-4">
            <button
              type="button"
              onClick={() => {
                window.location.href = "http://localhost:5000/api/auth/google";
              }}
              className="w-full py-4 rounded-xl border border-gray-300 bg-white text-black font-medium hover:bg-gray-50"
            >
              Continue with Google
            </button>
          </div>
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">JWT secured session</p>

          <p className="mt-5 text-gray-700">
            Don't have an account?
            <Link to="/register" className="ml-2 text-[#d6b45a] font-medium">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}*/
import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrorMsg("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setErrorMsg("");

      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email: form.email,
        password: form.password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // ── Redirect back to intended page (e.g. /checkout), else home ──
      const redirect = sessionStorage.getItem("redirectAfterLogin") || "/";
      sessionStorage.removeItem("redirectAfterLogin");
      navigate(redirect);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-3xl bg-white border border-gray-200 p-10 shadow-lg">
        <div className="text-center mb-10">
          <h1 className="text-5xl tracking-[8px] text-[#d6b45a] font-serif">
            LUMIERE
          </h1>
          <p className="text-xs tracking-[4px] text-gray-500 mt-3">
            BEAUTY RETAIL SUITE
          </p>
        </div>

        {/* Inline error banner instead of alert() */}
        {errorMsg && (
          <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 text-red-600 text-sm text-center rounded-xl">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-xs uppercase tracking-[2px] text-gray-600 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                className="w-full pl-12 pr-4 py-4 rounded-xl bg-gray-100 border border-gray-300 text-black focus:outline-none focus:border-[#d6b45a]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-[2px] text-gray-600 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="w-full pl-12 pr-4 py-4 rounded-xl bg-gray-100 border border-gray-300 text-black focus:outline-none focus:border-[#d6b45a]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl bg-[#d6b45a] text-black font-semibold hover:brightness-110 transition disabled:opacity-60"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>

          <div>
            <button
              type="button"
              onClick={() => {
                window.location.href = "http://localhost:5000/api/auth/google";
              }}
              className="w-full py-4 rounded-xl border border-gray-300 bg-white text-black font-medium hover:bg-gray-50 transition"
            >
              Continue with Google
            </button>
          </div>
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">JWT secured session</p>
          <p className="mt-5 text-gray-700">
            Don't have an account?
            <Link to="/register" className="ml-2 text-[#d6b45a] font-medium">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
