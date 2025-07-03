// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useNavigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import UsersPage from "./pages/UsersPage";
import EditUserPage from "./pages/EditUserPage";
import ProfilePage from "./pages/ProfilePage";
import { useState } from "react";

// Komponent do ochrony trasy (wymaga zalogowania)
function RequireAuth({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
}

// Pasek nawigacji u góry strony
function NavBar() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const navigate = useNavigate();

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  }

  // Ukryj navbar na stronie logowania
  if (window.location.pathname === "/login") return null;

  return (
    <nav className="flex items-center justify-between bg-blue-700 text-white px-6 py-3 mb-6 shadow-lg">
      <div className="flex items-center gap-4 font-semibold text-lg">
        <Link to="/">TMO</Link>
        <Link to="/">Panel główny</Link>
        {(user.role === "Admin" || user.role === "Koordynator") && (
          <Link to="/users">Użytkownicy</Link>
        )}
        <Link to="/profile">Profil</Link>
      </div>
      <div className="flex items-center gap-4">
        <span className="hidden sm:block">{user.firstName} {user.lastName} ({user.role})</span>
        <button
          onClick={logout}
          className="px-3 py-1 bg-red-600 hover:bg-red-800 rounded-lg font-semibold"
        >
          Wyloguj
        </button>
      </div>
    </nav>
  );
}

export default function App() {
  // Render NavBar na wszystkich trasach oprócz /login
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <RequireAuth>
              <Dashboard />
            </RequireAuth>
          }
        />
        <Route
          path="/users"
          element={
            <RequireAuth>
              <UsersPage />
            </RequireAuth>
          }
        />
        <Route
          path="/users/:id/edit"
          element={
            <RequireAuth>
              <EditUserPage />
            </RequireAuth>
          }
        />
        <Route
          path="/profile"
          element={
            <RequireAuth>
              <ProfilePage />
            </RequireAuth>
          }
        />
        {/* fallback dla nieistniejącej ścieżki */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}
