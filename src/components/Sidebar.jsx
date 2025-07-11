import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setIsOpen(false);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
    { to: "/protokol", label: "Protokół", icon: "📝", description: "Generator protokołów" }
  ];

  const currentShift =
    new Date().getHours() >= 7 && new Date().getHours() < 19
      ? "Dzienna"
      : "Nocna";
  const shiftTime =
    currentShift === "Dzienna" ? "07:00 - 19:00" : "19:00 - 07:00";

  return (
    <>
      {/* Mobile Menu Button */}
      {isMobile && (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="fixed top-1 left-1 z-50 p-1.5 bg-slate-800 rounded-md shadow-lg mobile-touch"
          style={{ minHeight: '32px', minWidth: '32px' }}
        >
          <span className="text-white text-xs">{isOpen ? '✕' : '☰'}</span>
        </button>
      )}

      {/* Mobile Overlay */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 animate-fade-in"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        ${isMobile ? 'fixed' : 'static'} inset-y-0 left-0 z-40 w-56 md:w-80 bg-slate-900 border-r border-slate-700/50 
        min-h-screen flex flex-col shadow-2xl transform transition-transform duration-300 ease-in-out
        ${isMobile ? (isOpen ? 'translate-x-0' : '-translate-x-full') : 'translate-x-0'}
        ${isMobile ? 'animate-slide-in-left' : ''}
      `}>
        {/* Header */}
        <div className="p-2 md:p-6 border-b border-slate-700/50 safe-area-top">
          <div className="flex items-center gap-1 md:gap-3 mb-2 md:mb-4">
            <div className="w-6 h-6 md:w-10 md:h-10 gradient-primary rounded-md md:rounded-2xl flex items-center justify-center font-bold text-white shadow-lg">
              <span className="text-xs md:text-lg">🏢</span>
            </div>
            <div>
              <div className="font-bold text-xs md:text-lg text-white">TechSPIE</div>
              <div className="mobile-micro-text md:text-xs text-slate-400 font-medium">
                CMMS/CAFM System
              </div>
            </div>
          </div>

          {/* System Status */}
          <div className="glass-card-light p-1 md:p-3">
            <div className="flex items-center justify-between mb-0.5 md:mb-2">
              <div className="flex items-center gap-0.5 md:gap-2">
                <div className="status-indicator bg-green-400"></div>
                <span className="mobile-micro-text md:text-sm font-semibold text-slate-200">
                  System Online
                </span>
              </div>
              <div className="mobile-micro-text md:text-xs text-slate-400">
                {new Date().toLocaleTimeString("pl-PL", {
                  hour: "2-digit",
                  minute: "2-digit"
                })}
              </div>
            </div>

            <div className="mobile-micro-text md:text-xs text-slate-400 mb-0.5 md:mb-1">Aktualna zmiana</div>
            <div className="flex items-center justify-between">
              <span className="mobile-micro-text md:text-sm font-semibold text-white">
                {currentShift}
              </span>
              <span className="mobile-micro-text md:text-xs text-slate-400">{shiftTime}</span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-1 md:px-3 py-1 md:py-3 overflow-y-auto mobile-scroll">
          <div className="space-y-0.5 md:space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => isMobile && setIsOpen(false)}
                className={({ isActive }) =>
                  `group flex items-center gap-1 md:gap-3 py-1 md:py-3 px-1.5 md:px-3 rounded-md md:rounded-lg font-medium transition-all duration-200 mobile-touch no-select ${
                    isActive
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md"
                      : "text-slate-300 hover:text-white hover:bg-slate-800/50"
                  }`
                }
                style={{ minHeight: isMobile ? '32px' : '48px' }}
              >
                <div className="flex items-center gap-1 md:gap-3 flex-1">
                  <span className="text-xs md:text-lg group-hover:scale-110 transition-transform duration-200">
                    {item.icon}
                  </span>
                  <div>
                    <div className="font-semibold text-sm">{item.label}</div>
                    <div className="text-mobile-xs md:text-xs opacity-70 hidden lg:block">{item.description}</div>
                  </div>
                </div>
              </NavLink>
            ))}
          </div>
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-slate-700/50 safe-area-bottom">
          <div className="glass-card-light p-3">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 gradient-accent rounded-full flex items-center justify-center font-bold text-white text-sm shadow-lg">
                {user?.firstName?.[0] || "A"}
              </div>
              <div className="flex-1">
                <div className="font-semibold text-sm text-white">
                  {user?.firstName} {user?.lastName}
                </div>
                <div className="text-xs text-slate-400">{user?.role}</div>
              </div>
            </div>

            <div className="w-full py-2 px-3 bg-slate-700/50 rounded-lg text-sm text-slate-300 text-center">
              <span>🔓</span>
              <span className="ml-2">Tryb demo</span>
            </div>
          </div>

          <div className="text-slate-500 text-xs text-center mt-3">
            © {new Date().getFullYear()} TechSPIE v1.0
          </div>
        </div>
      </aside>
    </>
  );
}