import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:5000/api/auth/register",
        form,
      );

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      alert("Account Created Successfully");

      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    // <div className="min-h-screen bg-black flex items-center justify-center px-4 py-10">
    <div className="min-h-screen bg-[#f7f7f5] flex items-center justify-center px-4 py-10">
      <div
        className="
        w-full
        max-w-md
        rounded-3xl
        border
       border-[#e5e0d5]
        bg-white
        p-8
        shadow-x1
        "
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl tracking-[8px] text-[#d6b45a] font-serif">
            LUMIERE
          </h1>

          <p className="text-xs tracking-[4px] text-[#9c8450] mt-2">
            BEAUTY RETAIL SUITE
          </p>
        </div>

        <hr className="border-[#2c2412] mb-8" />

        <h2 className="text-[#d6b45a] text-2xl font-serif mb-1">
          Create your account
        </h2>

        <p className="text-gray-500 text-sm mb-6">
          Fill in your details to get started
        </p>

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              name="first_name"
              placeholder="First Name"
              value={form.first_name}
              onChange={handleChange}
              required
              className="bg-[#fafafa] border border-gray-300 rounded-lg px-4 py-3 text-gray-800 w-full focus:outline-none focus:border-[#d6b45a]"
            />

            <input
              type="text"
              name="last_name"
              placeholder="Last Name"
              value={form.last_name}
              onChange={handleChange}
              required
              className="bg-[#fafafa] border border-gray-300 rounded-lg px-4 py-3 text-gray-800 w-full focus:outline-none focus:border-[#d6b45a]"
            />
          </div>

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            required
            className="bg-[#fafafa] border border-gray-300 rounded-lg px-4 py-3 text-gray-800 w-full focus:outline-none focus:border-[#d6b45a]"
          />

          <input
            type="text"
            name="phone"
            placeholder="+92 300 0000000"
            value={form.phone}
            onChange={handleChange}
            className="bg-[#fafafa] border border-gray-300 rounded-lg px-4 py-3 text-gray-800 w-full focus:outline-none focus:border-[#d6b45a]"
          />

          <input
            type="password"
            name="password"
            placeholder="Password (min. 8 characters)"
            value={form.password}
            onChange={handleChange}
            required
            className="bg-[#fafafa] border border-gray-300 rounded-lg px-4 py-3 text-gray-800 w-full focus:outline-none focus:border-[#d6b45a]"
          />

          <button
            type="submit"
            disabled={loading}
            className="
            w-full
            bg-[#d6b45a]
            text-black
            font-semibold
            py-4
            rounded-lg
            hover:brightness-110
            "
          >
            {loading ? "Creating..." : "CREATE ACCOUNT"}
          </button>
        </form>

        <p className="text-center text-xs text-gray-500 mt-5">
          JWT secured session
        </p>

        <p className="text-center text-gray-400 mt-5">
          Already have an account?
          <Link to="/login" className="text-[#d6b45a] ml-2">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
