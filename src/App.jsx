import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useNavigate } from "react-router-dom";

// ... (NavBar, Hero, Footer bez zmian)

function LoginPage({ onLogin }) {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    // tutaj możesz dodać prawdziwe sprawdzenie loginu z backendem!
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
          element={isLogged ? <Dashboard /> : <Navigate to="/login" />}
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

// ...i reszta komponentów Hero, Footer, Dashboard – jak wcześniej
