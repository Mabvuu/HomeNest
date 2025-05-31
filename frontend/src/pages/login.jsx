import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [msg, setMsg]   = useState('');
  const navigate        = useNavigate();

  const onChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    setMsg('');
    try {
      const res = await axios.post('http://localhost:3000/auth/login', form);
      setMsg(res.data.message);
      if (res.data.message.toLowerCase().includes('successful')) {
        navigate('/home');
      }
    } catch (err) {
      setMsg(err.response?.data?.error || 'Error occurred');
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      {/* outer light border */}
      <div className="border-8 border-[#8faeff] p-4">
        {/* white gutter then inner darker border */}
        <div className="border-4 border-[#6f8ae0] bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
          <div className="flex items-center justify-between mb-6">
            <img src="/images/logo.png" alt="logo" className="h-16" />
            <Link
              to="/signup"
              className="px-3 py-1 border border-gray-800 rounded text-sm hover:bg-gray-100"
            >
              Sign Up
            </Link>
          </div>

          <h2 className="text-center text-2xl font-semibold mb-6 text-gray-800">
            Login to Home Nest
          </h2>

          {msg && (
            <p
              className={`text-center mb-4 ${
                msg.toLowerCase().includes('successful')
                  ? 'text-green-600'
                  : 'text-red-600'
              }`}
            >
              {msg}
            </p>
          )}

          <form onSubmit={onSubmit} className="space-y-4">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={onChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6f8ae0]"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={onChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6f8ae0]"
            />
            <button
              type="submit"
              className="w-full py-2 rounded bg-gray-800 text-white hover:bg-gray-900 transition"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
