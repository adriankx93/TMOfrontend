import { NavLink } from "react-router-dom";

export default function Sidebar() {
  // Mock user data since authentication is disabled
  const user = {
    firstName: "Administrator",
    lastName: "Systemu",
    role: "Admin"
  };

  const navItems = [
    { to: "/", label: "Dashboard", icon: "🏠", description: "Przegląd systemu" },
    { to: "/zadania", label: "Zadania", icon: "📋", description: "Zarządzanie zadaniami" },
    { to: "/przeglady", label: "Przeglądy", icon: "🔍", description: "Przeglądy i inspekcje" },
    { to: "/usterki", label: "Usterki", icon: "⚠️", description: "Zgłoszenia i awarie" },
    { to: "/urzadzenia", label: "Urządzenia", icon: "⚙️", description: "Sprzęt i maszyny" },
    { to: "/budynki", label: "Budynki", icon: "🏢", description: "Infrastruktura" },
    { to: "/technicy", label: "Zespół", icon: "👥", description: "Technicy i specjaliści" },
    { to: "/narzedzia", label: "Narzędzia", icon: "🔧", description: "Inwentaryzacja narzędzi" },
    { to: "/magazyn", label: "Magazyn", icon: "📦", description: "Inwentarz i zasoby" },
    { to: "/materialy", label: "Materiały", icon: "🛒", description: "Zamówienia i dostawy" },
    { to: "/notatnik", label: "Notatnik", icon: "📝", description: "Notatki i komunikacja" },
    { to: "/raporty", label: "Analityka", icon: "📊", description: "Raporty i KPI" },
    { to: "/analiza-trendow", label: "Trendy", icon: "📈", description: "Analiza awaryjności" },
    { to: "/ustawienia", label: "Ustawienia", icon: "⚙️", description: "Konfiguracja systemu" },
    // NOWY LINK:
    { to: "/protokol", label: "Protokół", icon: "📝", description: "Generator protokołów" }
  ];

  const currentShift =
    new Date().getHours() >= 7 && new Date().getHours() < 19
      ? "Dzienna"
      : "Nocna";
  const shiftTime =
    currentShift === "Dzienna" ? "07:00 - 19:00" : "19:00 - 07:00";

  return (
    <aside className="w-80 bg-slate-900 border-r border-slate-700/50 min-h-screen flex flex-col shadow-2xl">
      {/* Header */}
      <div className="p-8 border-b border-slate-700/50">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 gradient-primary rounded-2xl flex items-center justify-center font-bold text-white shadow-lg">
            <span className="text-xl">🏢</span>
          </div>
          <div>
            <div className="font-bold text-xl text-white">TechSPIE</div>
            <div className="text-xs text-slate-400 font-medium">
              CMMS/CAFM System
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="glass-card-light p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="status-indicator bg-green-400"></div>
              <span className="text-sm font-semibold text-slate-200">
                System Online
              </span>
            </div>
            <div className="text-xs text-slate-400">
              {new Date().toLocaleTimeString("pl-PL", {
                hour: "2-digit",
                minute: "2-digit"
              })}
            </div>
          </div>

          <div className="text-xs text-slate-400 mb-2">Aktualna zmiana</div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-white">
              {currentShift}
            </span>
            <span className="text-xs text-slate-400">{shiftTime}</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav
        className="flex-1 px-4 py-4 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-800"
        aria-label="Główna nawigacja"
      >
        <div className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `group flex items-center gap-3 py-2 px-3 rounded-lg font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md transform scale-[1.02]"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/50 hover:shadow-sm hover:scale-[1.01]"
                }`
              }
            >
              <div className="flex items-center gap-3 flex-1">
                <span className="text-lg group-hover:scale-110 transition-transform duration-200">
                  {item.icon}
                </span>
                <div>
                  <div className="font-semibold">{item.label}</div>
                  <div className="text-xs opacity-70">{item.description}</div>
                </div>
              </div>
            </NavLink>
          ))}
        </div>
      </nav>

      {/* User Profile */}
      <div className="p-6 border-t border-slate-700/50">
        <div className="glass-card-light p-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 gradient-accent rounded-full flex items-center justify-center font-bold text-white text-sm shadow-lg">
              {user?.firstName?.[0] || "A"}
            </div>
            <div className="flex-1">
              <div className="font-semibold text-sm text-white">
                {user?.firstName} {user?.lastName}
              </div>
              <div className="text-xs text-slate-400">{user?.role}</div>
            </div>
          </div>

          <div className="w-full py-2 px-4 bg-slate-700/50 rounded-lg text-sm text-slate-300 text-center">
            <span>🔓</span>
            <span className="ml-2">Tryb demo</span>
          </div>
        </div>

        <div className="text-slate-500 text-xs text-center mt-4">
          © {new Date().getFullYear()} TechSPIE v1.0
        </div>
      </div>
    </aside>
  );
}
