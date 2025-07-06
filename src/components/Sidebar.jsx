import { NavLink } from "react-router-dom";

import { authService } from "../services/authService";

export default function Sidebar() {
  const user = authService.getCurrentUser();

  const handleLogout = () => {
    authService.logout();
    window.location.reload();
  };

  const navItems = [
    { to: "/", label: "Dashboard", icon: "📊" },
    { to: "/zadania", label: "Zadania", icon: "📋" },
    { to: "/budynki", label: "Budynki", icon: "🏢" },
    { to: "/technicy", label: "Technicy", icon: "👷" },
    { to: "/magazyn", label: "Magazyn", icon: "📦" },
    { to: "/materialy", label: "Materiały", icon: "🛒" },
    { to: "/raporty", label: "Raporty", icon: "📈" },
    { to: "/ustawienia", label: "Ustawienia", icon: "⚙️" }
  ];

  const currentShift = new Date().getHours() >= 7 && new Date().getHours() < 19 ? "Dzienna" : "Nocna";
  const shiftTime = currentShift === "Dzienna" ? "07:00 - 19:00" : "19:00 - 07:00";

  return (
    <aside className="hidden md:flex flex-col w-72 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white min-h-screen shadow-2xl border-r border-slate-700/50">
      {/* Header */}
      <div className="p-8 border-b border-slate-700/50">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-600 rounded-xl flex items-center justify-center font-bold text-white shadow-lg">
            M
          </div>
          <div>
            <div className="font-bold text-xl tracking-wide bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
              Miasteczko Orange
            </div>
            <div className="text-xs text-slate-400 font-medium">System TMO</div>
          </div>
        </div>

        {/* Current Shift Info */}
        <div className="mt-4 p-3 bg-slate-800/50 rounded-xl border border-slate-700/50">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-white">Zmiana {currentShift}</div>
              <div className="text-xs text-slate-400">{shiftTime}</div>
            </div>
            <div className={`w-3 h-3 rounded-full ${currentShift === "Dzienna" ? "bg-yellow-400" : "bg-blue-400"} animate-pulse`}></div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-6 py-8" aria-label="Główna nawigacja">
        <div className="space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `group flex items-center gap-4 py-4 px-4 rounded-2xl font-semibold transition-all duration-200 ${
                  isActive 
                    ? "bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-lg shadow-orange-500/25 transform scale-[1.02]" 
                    : "text-slate-300 hover:text-white hover:bg-slate-700/50 hover:transform hover:scale-[1.01]"
                }`
              }
            >
              <span className="text-xl group-hover:scale-110 transition-transform duration-200">
                {item.icon}
              </span>
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
           <NavLink
              to="/budynki"
              className={({ isActive }) =>
                `group flex items-center gap-4 py-4 px-4 rounded-2xl font-semibold transition-all duration-200 ${
                  isActive 
                    ? "bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-lg shadow-orange-500/25 transform scale-[1.02]" 
                    : "text-slate-300 hover:text-white hover:bg-slate-700/50 hover:transform hover:scale-[1.01]"
                }`
              }
            >
              <span className="text-xl group-hover:scale-110 transition-transform duration-200">
              🏢
              </span>
              <span className="font-medium">Budynki</span>
            </NavLink>
           <NavLink
              to="/current-month"
              className={({ isActive }) =>
                `group flex items-center gap-4 py-4 px-4 rounded-2xl font-semibold transition-all duration-200 ${
                  isActive 
                    ? "bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-lg shadow-orange-500/25 transform scale-[1.02]" 
                    : "text-slate-300 hover:text-white hover:bg-slate-700/50 hover:transform hover:scale-[1.01]"
                }`
              }
            >
              <span className="text-xl group-hover:scale-110 transition-transform duration-200">
              📅
              </span>
              <span className="font-medium">Aktualny miesiąc</span>
            </NavLink>
        </div>
      </nav>

      {/* Footer */}
      <div className="p-6 border-t border-slate-700/50">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center font-bold text-white text-sm shadow-lg">
            {user?.firstName?.[0] || 'A'}
          </div>
          <div>
            <div className="font-semibold text-sm text-white">{user?.firstName} {user?.lastName}</div>
            <div className="text-xs text-slate-400">{user?.email}</div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full py-2 px-4 bg-slate-700/50 hover:bg-slate-600/50 rounded-xl text-sm text-slate-300 hover:text-white transition-all duration-200"
        >
          Wyloguj się
        </button>
        <div className="text-slate-500 text-xs">
          © {new Date().getFullYear()} TMO Orange
        </div>
      </div>
    </aside>
  );
}