import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useNavigate } from "react-router-dom";

// Navbar
function NavBar() {
  return (
    <nav className="flex gap-6 bg-blue-700 text-white px-6 py-3 mb-6 shadow-lg">
      <Link to="/" className="font-bold text-lg">TMO</Link>
      <Link to="/">Panel</Link>
      <Link to="/login">Logowanie</Link>
    </nav>
  );
}

// Hero section
function Hero() {
  return (
    <section className="bg-gradient-to-br from-blue-700 via-blue-400 to-slate-300 pt-20 pb-28 px-4 text-center shadow-xl relative">
      <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4 drop-shadow-lg">Technologiczny Panel TMO</h1>
      <p className="text-lg md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto drop-shadow-sm">
        Nowoczesny system do zarządzania techniką obiektów. Szybko, wygodnie, bezpiecznie.
      </p>
      <button className="bg-blue-900 hover:bg-blue-800 transition text-white font-semibold py-4 px-12 rounded-2xl shadow-xl text-lg">
        Dowiedz się więcej
      </button>
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] blur-3xl opacity-40 bg-gradient-to-r from-blue-500 via-blue-400 to-slate-200 rounded-full -z-10" />
    </section>
  );
}

// Footer
function Footer() {
  return (
    <footer className="bg-blue-900 text-white text-center py-6 mt-16 rounded-t-2xl shadow-2xl">
      &copy; {new Date().getFullYear()} TMO. Wszystkie prawa zastrzeżone.
    </footer>
  );
}

// Dashboard
function Dashboard() {
  return (
    <>
      <Hero />
      <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-lg p-8 mt-8">
        <h1 className="text-2xl font-bold mb-2">Panel TMO</h1>
        <p className="text-slate-700">Witaj w systemie TMO! To jest przykładowy pulpit.</p>
      </div>
      <Footer />
    </>
  );
}

// Logowanie (musi być osobny komponent do użycia useNavigate!)
function LoginPage({ onLogin }) {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    if (login === "admin" && password === "adrian128") {
      onLogin();
      navigate("/");
    } else {
      alert("Nieprawidłowy login lub hasło!");
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      <form onSubmit={handleSubmit} className="bg-white shadow-xl rounded-2xl p-10 max-w-sm w-full">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-900">Logowanie</h2>
        <input
          className="mb-4 w-full p-3 border border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
          placeholder="Login"
          value={login}
          onChange={e => setLogin(e.target.value)}
        />
        <input
          type="password"
          className="mb-6 w-full p-3 border border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
          placeholder="Hasło"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button
          type="submit"
          className="w-full py-3 bg-blue-700 text-white rounded-xl font-bold hover:bg-blue-800 transition text-lg shadow"
        >
          Zaloguj się
        </button>
      </form>
    </div>
  );
}

// App
export default function App() {
  const [isLogged, setIsLogged] = useState(false);

  function handleLogin() {
    setIsLogged(true);
  }

  return (
    <Router>
      <NavBar />
      <Routes>
        <Route
          path="/"
          element={isLogged ? <Dashboard /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/login"
          element={<LoginPage onLogin={handleLogin} />}
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}
