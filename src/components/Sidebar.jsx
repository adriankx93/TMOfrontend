// src/components/Sidebar.jsx
import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="hidden md:flex flex-col w-64 bg-gradient-to-br from-blue-900 to-blue-700 text-white min-h-screen py-10 px-6 gap-6 shadow-2xl">
      <div className="font-extrabold text-2xl mb-12 tracking-wide">TMO</div>
      <nav className="flex flex-col gap-2" aria-label="Główna nawigacja">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `py-3 px-4 rounded-xl font-semibold transition ${
              isActive ? "bg-white/20" : "bg-white/10 hover:bg-white/20"
            }`
          }
        >
          Dashboard
        </NavLink>
        <NavLink
          to="/technicy"
          className={({ isActive }) =>
            `py-3 px-4 rounded-xl font-semibold transition ${
              isActive ? "bg-white/20" : "hover:bg-white/10"
            }`
          }
        >
          Technicy
        </NavLink>
        <NavLink
          to="/zgloszenia"
          className={({ isActive }) =>
            `py-3 px-4 rounded-xl font-semibold transition ${
              isActive ? "bg-white/20" : "hover:bg-white/10"
            }`
          }
        >
          Zgłoszenia
        </NavLink>
        <NavLink
          to="/ustawienia"
          className={({ isActive }) =>
            `py-3 px-4 rounded-xl font-semibold transition ${
              isActive ? "bg-white/20" : "hover:bg-white/10"
            }`
          }
        >
          Ustawienia
        </NavLink>
      </nav>
      <div className="flex-1" />
      <div className="text-white/60 text-xs">© {new Date().getFullYear()} TMO</div>
    </aside>
  );
}
