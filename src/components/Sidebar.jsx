import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import { authService } from "../services/authService";
import { 
  Home, 
  ClipboardList, 
  Search, 
  AlertTriangle, 
  Settings as SettingsIcon, 
  Building2, 
  Users, 
  Wrench, 
  Package, 
  ShoppingCart, 
  FileText, 
  BarChart4, 
  TrendingUp, 
  Settings, 
  FileSignature 
} from "lucide-react";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [user, setUser] = useState(null);

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

  useEffect(() => {
    // Uwaga! Jeśli masz inną nazwę funkcji niż getCurrentUser, zamień na getUser!
    const currentUser = authService.getUser ? authService.getUser() : authService.getCurrentUser();
    setUser(currentUser);
  }, []);

  const handleLogout = () => {
    authService.logout();
    window.location.href = '/login';
  };

  const navItems = [
    { to: "/", label: "Dashboard", icon: <Home size={18} />, description: "Przegląd systemu" },
    { to: "/zadania", label: "Zadania", icon: <ClipboardList size={18} />, description: "Zarządzanie zadaniami" },
    { to: "/przeglady", label: "Przeglądy", icon: <Search size={18} />, description: "Przeglądy i inspekcje" },
    { to: "/usterki", label: "Usterki", icon: <AlertTriangle size={18} />, description: "Zgłoszenia i awarie" },
    { to: "/urzadzenia", label: "Urządzenia", icon: <SettingsIcon size={18} />, description: "Sprzęt i maszyny" },
    { to: "/budynki", label: "Budynki", icon: <Building2 size={18} />, description: "Infrastruktura" },
    { to: "/technicy", label: "Zespół", icon: <Users size={18} />, description: "Technicy i specjaliści" },
    { to: "/narzedzia", label: "Narzędzia", icon: <Wrench size={18} />, description: "Inwentaryzacja narzędzi" },
    { to: "/magazyn", label: "Magazyn", icon: <Package size={18} />, description: "Inwentarz i zasoby" },
    { to: "/materialy", label: "Materiały", icon: <ShoppingCart size={18} />, description: "Zamówienia i dostawy" },
    { to: "/notatnik", label: "Notatnik", icon: <FileText size={18} />, description: "Notatki i komunikacja" },
    { to: "/raporty", label: "Analityka", icon: <BarChart4 size={18} />, description: "Raporty i KPI" },
    { to: "/analiza-trendow", label: "Trendy", icon: <TrendingUp size={18} />, description: "Analiza awaryjności" },
    { to: "/ustawienia", label: "Ustawienia", icon: <Settings size={18} />, description: "Konfiguracja systemu" },
    { to: "/protokol", label: "Protokół", icon: <FileSignature size={18} />, description: "Generator protokołów" }
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      {isMobile && (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="fixed top-1 left-1 z-50 p-2 bg-slate-800 rounded-md shadow-lg"
          style={{ minHeight: '36px', minWidth: '36px' }}
        >
          <span className="text-white text-xl">{isOpen ? '✕' : '☰'}</span>
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
        ${isMobile ? 'fixed' : 'static'} inset-y-0 left-0 z-50 w-56 md:w-72 bg-slate-900 border-r border-slate-700/50 
        min-h-screen flex flex-col shadow-2xl transform transition-transform duration-300 ease-in-out
        ${isMobile ? (isOpen ? 'translate-x-0' : '-translate-x-full') : 'translate-x-0'}
        ${isMobile ? 'animate-slide-in-left' : ''}
      `}>
        {/* Header */}
        <div className="p-3 md:p-6 border-b border-slate-700/50">
          <div className="flex items-center gap-2 md:gap-4 mb-3 md:mb-5">
            <div className="w-8 h-8 md:w-12 md:h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg md:rounded-2xl flex items-center justify-center font-bold text-white shadow-lg">
              <span className="text-xl md:text-2xl">T</span>
            </div>
            <div>
              <div className="font-bold text-base md:text-xl text-white">TechSPIE</div>
              <div className="text-xs md:text-sm text-slate-400 font-medium">
                CMMS/CAFM System
              </div>
            </div>
          </div>
          <div className="p-2 md:p-3 bg-slate-800 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full" />
              <span className="text-xs md:text-sm font-semibold text-slate-200">
                System Online
              </span>
            </div>
            <div className="text-xs md:text-sm text-slate-400">
              {new Date().toLocaleTimeString("pl-PL", {
                hour: "2-digit",
                minute: "2-digit"
              })}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-1 md:px-3 py-1 md:py-3 overflow-y-auto">
          <div className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => isMobile && setIsOpen(false)}
                className={({ isActive }) =>
                  `group flex items-center gap-2 md:gap-4 py-2 md:py-3 px-3 rounded-lg font-medium transition-all duration-200 no-select ${
                    isActive
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md"
                      : "text-slate-300 hover:text-white hover:bg-slate-800/70"
                  }`
                }
              >
                <span>{item.icon}</span>
                <div>
                  <div className="font-semibold text-sm">{item.label}</div>
                  <div className="text-xs opacity-70 hidden lg:block">{item.description}</div>
                </div>
              </NavLink>
            ))}
          </div>
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-slate-700/50 mt-auto">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center font-bold text-white text-lg shadow-lg">
              {user?.firstName?.[0]?.toUpperCase() || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm text-white truncate">
                {user?.firstName} {user?.lastName}
              </div>
              <div className="text-xs text-slate-400 truncate">{user?.role}</div>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full py-2 px-3 bg-slate-700/50 rounded-lg text-sm text-slate-300 text-center hover:bg-slate-600/50 transition-all duration-200"
          >
            <span>🔒</span>
            <span className="ml-2">Wyloguj się</span>
          </button>
          <div className="text-slate-500 text-xs text-center mt-3">
            © {new Date().getFullYear()} TechSPIE v1.0
          </div>
        </div>
      </aside>
    </>
  );
}
