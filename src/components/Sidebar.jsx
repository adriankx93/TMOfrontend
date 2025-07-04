import { NavLink } from "react-router-dom";

export default function Sidebar() {
  const navItems = [
    { to: "/", label: "Dashboard", icon: "📊" },
    { to: "/technicy", label: "Technicy", icon: "👷" },
    { to: "/zgloszenia", label: "Zgłoszenia", icon: "🎫" },
    { to: "/ustawienia", label: "Ustawienia", icon: "⚙️" }
  ];

  return (
    <aside className="hidden md:flex flex-col w-72 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white min-h-screen shadow-2xl border-r border-slate-700/50">
      {/* Header */}
      <div className="p-8 border-b border-slate-700/50">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-xl flex items-center justify-center font-bold text-white shadow-lg">
            T
          </div>
          <div className="font-bold text-2xl tracking-wide bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            TMO
          </div>
        </div>
        <p className="text-slate-400 text-sm font-medium">System zarządzania</p>
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
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25 transform scale-[1.02]" 
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
        </div>
      </nav>

      {/* Footer */}
      <div className="p-6 border-t border-slate-700/50">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center font-bold text-white text-sm shadow-lg">
            A
          </div>
          <div>
            <div className="font-semibold text-sm text-white">Admin</div>
            <div className="text-xs text-slate-400">admin@tmo.pl</div>
          </div>
        </div>
        <div className="text-slate-500 text-xs">
          © {new Date().getFullYear()} TMO. Wszystkie prawa zastrzeżone.
        </div>
      </div>
    </aside>
  );
}