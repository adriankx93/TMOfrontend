import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTasks } from "../hooks/useTasks";
import { useTechnicians } from "../hooks/useTechnicians";
import { sheetsService } from "../services/sheetsService";

export default function Dashboard() {
  const navigate = useNavigate();
  const { tasks } = useTasks();
  const { technicians } = useTechnicians();
  const [todayShift, setTodayShift] = useState(null);
  const [loading, setLoading] = useState(true);
  const [weather, setWeather] = useState(null);
  const [dbStatus, setDbStatus] = useState({ connected: false, message: "Sprawdzanie..." });
  const [dashboardStats, setDashboardStats] = useState({
    activeTechnicians: 0,
    currentTasks: 0,
    completedToday: 0,
    poolTasks: 0
  });

  // ----------- ŻYWY ZEGAR ------------
  const [clock, setClock] = useState({
    time: new Date().toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' }),
    date: new Date().toLocaleDateString('pl-PL', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setClock({
        time: new Date().toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' }),
        date: new Date().toLocaleDateString('pl-PL', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
      });
    }, 1000); // odświeżanie co sekundę

    return () => clearInterval(interval);
  }, []);
  // ----------- /ŻYWY ZEGAR ------------

  useEffect(() => {
    fetchTodayShift();
    fetchWeatherData();
    checkDatabaseStatus();
    calculateStats();
    
    const interval = setInterval(() => {
      fetchTodayShift();
      fetchWeatherData();
      checkDatabaseStatus();
    }, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, [tasks, technicians]);

  const fetchWeatherData = async () => {
    const mockWeather = {
      temperature: Math.round(15 + Math.random() * 10),
      humidity: Math.round(45 + Math.random() * 30),
      pressure: Math.round(1010 + Math.random() * 20),
      windSpeed: Math.round(5 + Math.random() * 10),
      description: "Częściowo pochmurno",
      icon: "⛅",
      city: "Warszawa"
    };
    setWeather(mockWeather);
  };

  const checkDatabaseStatus = async () => {
    try {
      const hasTasksData = tasks.length > 0;
      const hasTechniciansData = technicians.length > 0;
      if (hasTasksData || hasTechniciansData) {
        setDbStatus({ connected: true, message: "Operacyjna" });
      } else {
        setDbStatus({ connected: true, message: "Połączono (brak danych)" });
      }
    } catch (error) {
      setDbStatus({ connected: false, message: "Problem z połączeniem" });
    }
  };

  const fetchTodayShift = async () => {
    try {
      setLoading(true);
      const data = await sheetsService.getCurrentMonthData();
      const today = new Date();
      const todayDay = today.getDate();
      const shift = data.shifts.find(shift => shift.dayNumber === todayDay);
      setTodayShift(shift || null);
    } catch (error) {
      //
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = () => {
    const activeTechnicians = todayShift ? todayShift.totalWorking : 0;
    const currentTasks = tasks.filter(t => ['assigned', 'in_progress'].includes(t.status)).length;
    const poolTasks = tasks.filter(t => t.status === 'pool').length;
    const today = new Date().toDateString();
    const completedToday = tasks.filter(t =>
      t.status === 'completed' &&
      t.completedAt &&
      new Date(t.completedAt).toDateString() === today
    ).length;

    setDashboardStats({
      activeTechnicians,
      currentTasks,
      completedToday,
      poolTasks
    });
  };

  const currentHour = new Date().getHours();
  const isDay = currentHour >= 7 && currentHour < 19;

  const getCurrentShiftTechnicians = () => {
    if (!todayShift) return [];
    if (currentHour >= 7 && currentHour < 19) {
      return todayShift.dayTechnicians;
    } else {
      return todayShift.nightTechnicians;
    }
  };

  const getNextShiftTechnicians = () => {
    if (!todayShift) return [];
    if (currentHour >= 7 && currentHour < 19) {
      return todayShift.nightTechnicians;
    } else {
      return todayShift.dayTechnicians;
    }
  };

  const getCurrentShiftName = () => {
    if (currentHour >= 7 && currentHour < 19) return "Zmiana dzienna";
    return "Zmiana nocna";
  };

  const getNextShiftName = () => {
    if (currentHour >= 7 && currentHour < 19) return "Zmiana nocna";
    return "Zmiana dzienna";
  };

  const getCurrentShiftTime = () => {
    if (currentHour >= 7 && currentHour < 19) return "07:00 - 19:00";
    return "19:00 - 07:00";
  };

  const getNextShiftTime = () => {
    if (currentHour >= 7 && currentHour < 19) return "19:00 - 07:00";
    return "07:00 - 19:00";
  };

  const currentShiftTechnicians = getCurrentShiftTechnicians();
  const nextShiftTechnicians = getNextShiftTechnicians();

  const getCurrentShiftTasks = () => {
    const currentShift = isDay ? "Dzienna" : "Nocna";
    return tasks.filter(task =>
      task.shift === currentShift &&
      ['assigned', 'in_progress'].includes(task.status)
    );
  };

  const currentShiftTasks = getCurrentShiftTasks();

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header with System Status */}
      <div className="glass-card p-4 md:p-8">
        <div className="flex justify-between items-start">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 md:gap-4 mb-4">
              <div className="w-12 h-12 md:w-16 md:h-16 gradient-primary rounded-2xl flex items-center justify-center shadow-lg glow-blue">
                <span className="text-white text-xl md:text-2xl">🏢</span>
              </div>
              <div>
                <h1 className="text-2xl md:text-4xl font-bold text-white mb-2">TechSPIE Dashboard</h1>
                <p className="text-slate-300 text-sm md:text-lg">
                  Technical Facility Management System - Miasteczko Orange
                </p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6 text-slate-300">
              <div className="flex items-center gap-2">
                <div className="status-indicator bg-green-400"></div>
                <span className="text-sm font-medium">System Online</span>
              </div>
              <div className="text-xs md:text-sm font-medium">
                {clock.date}
              </div>
              <div className="text-base md:text-lg font-bold text-white">
                {clock.time}
              </div>
            </div>
          </div>
          {/* Weather Widget */}
          {weather && (
            <div className="glass-card-light p-4 md:p-6 min-w-[200px] md:min-w-[280px] hidden lg:block">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{weather.icon}</span>
                  <div>
                    <div className="font-semibold text-white">{weather.city}</div>
                    <div className="text-sm text-slate-400">{weather.description}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-white">{weather.temperature}°C</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="text-center">
                  <div className="text-slate-400">Wilgotność</div>
                  <div className="font-semibold text-white">{weather.humidity}%</div>
                </div>
                <div className="text-center">
                  <div className="text-slate-400">Wiatr</div>
                  <div className="font-semibold text-white">{weather.windSpeed} km/h</div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-600 text-xs text-slate-400 text-center">
                Ostatnia aktualizacja: {clock.time}
              </div>
            </div>
          )}
        </div>
      </div>
      {/* ...reszta komponentu bez zmian... */}
      {/* Skopiuj resztę Twojego Dashboardu, nie musisz zmieniać nigdzie indziej zegarka! */}
    </div>
  );
}
