import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from "react-router-dom";

function Dashboard() {
  return (
    <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-lg p-8 mt-8">
      <h1 className="text-2xl font-bold mb-2">Panel TMO</h1>
      <p className="text-slate-700">Witaj w systemie TMO! To jest przykładowy pulpit.</p>
    </div>
  );
}

function NavBar() {
  return (
    <nav className="flex gap-6 bg-blue-700 text-white px-6 py-3 mb-6 shadow-lg">
      <Link to="/" className="font-bold text-lg">TMO</Link>
      <Link to="/">Panel</Link>
      <Link to="/login">Logowanie</Link>
    </nav>
  );
}

function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center h-[50vh]">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-sm w-full">
        <h2 className="text-xl font-bold mb-4">Zaloguj się</h2>
        <input className="mb-3 w-full p-2 border rounded-xl" placeholder="Login" />
        <input type="password" className="mb-6 w-full p-2 border rounded-xl" placeholder="Hasło" />
        <button className="w-full py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition">Zaloguj się</button>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}
