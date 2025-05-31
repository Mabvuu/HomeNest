import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    idNumber: '',
    email: '',
    phoneNumber: '',
    province: '',
    password: '',
  });
  const [message, setMessage] = useState('');

  const provinces = [
    'Bulawayo', 'Harare', 'Manicaland', 'Mashonaland Central',
    'Mashonaland East', 'Mashonaland West', 'Masvingo',
    'Matabeleland North', 'Matabeleland South', 'Midlands'
  ];

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setMessage('');
    try {
      const res = await axios.post('http://localhost:3000/auth/signup', formData);
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.error || 'An error occurred.');
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      {/* outer light lavender-blue border */}
      <div className="border-8 border-[#8faeff] p-4">
        {/* white gutter and inner darker-blue border */}
        <div className="border-4 border-[#6f8ae0] bg-white shadow-lg rounded-lg p-8 max-w-xl w-full">
          <div className="flex items-center justify-between mb-6">
            <img src="/images/logo.png" alt="logo" className="h-16" />
            <Link
              to="/login"
              className="px-3 py-1 border border-gray-800 rounded text-sm hover:bg-gray-100"
            >
              Login
            </Link>
          </div>

          <h2 className="text-center text-2xl font-semibold mb-6 text-gray-800">
            Welcome to Home Nest
          </h2>

          {message && (
            <p className={`text-center mb-4 ${
              message.toLowerCase().includes('success')
                ? 'text-green-600'
                : 'text-red-600'
            }`}>
              {message}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6f8ae0]"
            />
            <input
              name="idNumber"
              placeholder="ID Number"
              value={formData.idNumber}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6f8ae0]"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6f8ae0]"
            />
            <input
              name="phoneNumber"
              placeholder="Phone Number"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6f8ae0]"
            />
            <select
              name="province"
              value={formData.province}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6f8ae0]"
            >
              <option value="">Select Province</option>
              {provinces.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6f8ae0]"
            />
            <button
              type="submit"
              className="w-full py-2 rounded bg-gray-800 text-white hover:bg-gray-900 transition"
            >
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
