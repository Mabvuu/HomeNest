import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Home from './pages/Home';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login"  element={<Login />} />
        <Route path="/home"   element={<Home />} />
        <Route path="*"       element={<Signup />} />   {/* fallback */}
      </Routes>
    </BrowserRouter>
  );
}
