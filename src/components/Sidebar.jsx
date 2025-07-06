import { NavLink } from "react-router-dom";
import { authService } from "../services/authService";

export default function Sidebar() {
  const user = authService.getCurrentUser();

  const handleLogout = () => {
    authService.logout();
    window.location.reload();
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
    { to: "/ustawienia", label: "Ustawienia", icon: "⚙️", description: "Konfiguracja systemu" }
  ];

  const currentShift = new Date().getHours() >= 7 && new Date().getHours() < 19 ? "Dzienna" : "Nocna";
  const shiftTime = currentShift === "Dzienna" ? "07:00 - 19:00" : "19:00 - 07:00";

  return (
    <aside className="w-80 bg-slate-900 border-r border-slate-700/50 min-h-screen flex flex-col shadow-2xl">
      {/* Header */}
      <div className="p-8 border-b border-slate-700/50">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 gradient-primary rounded-2xl flex items-center justify-center font-bold text-white shadow-lg">
            <span className="text-xl">🏢</span>
          </div>
          <div>
            <div className="font-bold text-xl text-white">
              TechSPIE
            </div>
            <div className="text-xs text-slate-400 font-medium">CMMS/CAFM System</div>
          </div>
        </div>

        {/* System Status */}
        <div className="glass-card-light p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="status-indicator bg-green-400"></div>
              <span className="text-sm font-semibold text-slate-200">System Online</span>
            </div>
            <div className="text-xs text-slate-400">
              {new Date().toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
          
          <div className="text-xs text-slate-400 mb-2">Aktualna zmiana</div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-white">{currentShift}</span>
            <span className="text-xs text-slate-400">{shiftTime}</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-6 py-8 overflow-y-auto" aria-label="Główna nawigacja">
        <div className="space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `group flex items-center gap-4 py-4 px-4 rounded-xl font-medium transition-all duration-200 ${
                  isActive 
                    ? "gradient-primary text-white shadow-lg glow-blue transform scale-[1.02]" 
                    : "text-slate-300 hover:text-white hover:bg-slate-800/50 hover:transform hover:scale-[1.01]"
                }`
              }
            >
              <div className="flex items-center gap-4 flex-1">
                <span className="text-xl group-hover:scale-110 transition-transform duration-200">
                  {item.icon}
                </span>
                <div>
                  <div className="font-semibold">Grafik zmian</div>
                  <div className="text-xs opacity-70">Harmonogram zespołu</div>
                  <div className="text-xs opacity-70">{item.description}</div>
                </div>
              </div>
            </NavLink>
          ))}
          
          <NavLink
            to="/current-month"
            className={({ isActive }) =>
              `group flex items-center gap-4 py-4 px-4 rounded-xl font-medium transition-all duration-200 ${
                isActive 
                  ? "gradient-primary text-white shadow-lg glow-blue transform scale-[1.02]" 
                  : "text-slate-300 hover:text-white hover:bg-slate-800/50 hover:transform hover:scale-[1.01]"
              }`
            }
          >
            <div className="flex items-center gap-4 flex-1">
              <span className="text-xl group-hover:scale-110 transition-transform duration-200">
                📅
              </span>
                <div className="font-semibold">Grafik zmian</div>
                <div className="text-xs opacity-70">Dane z arkusza</div>
              </div>
            </div>
          </NavLink>
        </div>
      </nav>

      {/* User Profile */}
      <div className="p-6 border-t border-slate-700/50">
        <div className="glass-card-light p-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 gradient-accent rounded-full flex items-center justify-center font-bold text-white text-sm shadow-lg">
              {user?.firstName?.[0] || 'A'}
            </div>
            <div className="flex-1">
              <div className="font-semibold text-sm text-white">{user?.firstName} {user?.lastName}</div>
              <div className="text-xs text-slate-400">{user?.role}</div>
            </div>
          </div>
          
          <button
            onClick={handleLogout}
            className="w-full py-2 px-4 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg text-sm text-slate-300 hover:text-white transition-all duration-200 flex items-center gap-2"
          >
            <span>🚪</span>
            <span>Wyloguj się</span>
          </button>
        </div>
        
        <div className="text-slate-500 text-xs text-center mt-4">
          © {new Date().getFullYear()} TechSPIE v1.0
        </div>
      </div>
    </aside>
  );
}