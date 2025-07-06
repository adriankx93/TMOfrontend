import { useEffect, useState } from "react";
import { useTasks } from "../hooks/useTasks";
import { useTechnicians } from "../hooks/useTechnicians";
import { sheetsService } from "../services/sheetsService";

interface WeatherData {
  temperature: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  description: string;
  icon: string;
  city: string;
}

export default function Dashboard() {
  const { tasks } = useTasks();
  const { technicians } = useTechnicians();
  const [todayShift, setTodayShift] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [dashboardStats, setDashboardStats] = useState({
    activeTechnicians: 0,
    currentTasks: 0,
    completedToday: 0,
    poolTasks: 0
  });

  useEffect(() => {
    fetchTodayShift();
    fetchWeather();
    calculateStats();

    const interval = setInterval(() => {
      fetchTodayShift();
      fetchWeather();
    }, 10 * 60 * 1000);

    return () => clearInterval(interval);
  }, [tasks, technicians]);

  const fetchWeather = async () => {
    try {
      const data = await fetchWeatherDataOpenMeteo();
      setWeather({
        temperature: Math.round(data.temperature2m[0]),
        humidity: Math.round(data.relativeHumidity2m[0]),
        pressure: 1015, // Możesz pobrać z innego API
        windSpeed: 5,   // jw.
        description: "Prognoza godzinowa",
        icon: "🌤️",
        city: "Warszawa"
      });
    } catch (err) {
      console.error("Błąd pobierania pogody:", err);
    }
  };

  const fetchWeatherDataOpenMeteo = async () => {
    const url = "https://api.open-meteo.com/v1/forecast";
    const params = new URLSearchParams({
      latitude: "52.2298",
      longitude: "21.0118",
      hourly: "temperature_2m,relative_humidity_2m,precipitation,evapotranspiration",
      forecast_days: "1",
      timezone: "Europe/Warsaw"
    });

    const response = await fetch(`${url}?${params.toString()}`);
    if (!response.ok) {
      throw new Error(`Błąd API pogody: ${response.status}`);
    }

    const data = await response.json();
    return {
      time: data.hourly.time.map((t: string) => new Date(t)),
      temperature2m: data.hourly.temperature_2m,
      relativeHumidity2m: data.hourly.relative_humidity_2m,
      precipitation: data.hourly.precipitation,
      evapotranspiration: data.hourly.evapotranspiration
    };
  };

  const fetchTodayShift = async () => {
    try {
      setLoading(true);
      const data = await sheetsService.getCurrentMonthData();
      const today = new Date();
      const shift = data.shifts.find(s => s.dayNumber === today.getDate());
      setTodayShift(shift || null);
    } catch (error) {
      console.error("Błąd pobierania zmiany:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = () => {
    const activeTechnicians = todayShift ? todayShift.totalWorking : 0;
    const currentTasks = tasks.filter(t => ["assigned", "in_progress"].includes(t.status)).length;
    const poolTasks = tasks.filter(t => t.status === "pool").length;
    const todayStr = new Date().toDateString();
    const completedToday = tasks.filter(
      t => t.status === "completed" && t.completedAt && new Date(t.completedAt).toDateString() === todayStr
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
    return isDay ? todayShift.dayTechnicians : todayShift.nightTechnicians;
  };

  const getNextShiftTechnicians = () => {
    if (!todayShift) return [];
    return isDay ? todayShift.nightTechnicians : todayShift.dayTechnicians;
  };

  const getCurrentShiftName = () => (isDay ? "Zmiana dzienna" : "Zmiana nocna");
  const getNextShiftName = () => (isDay ? "Zmiana nocna" : "Zmiana dzienna");
  const getCurrentShiftTime = () => (isDay ? "07:00 - 19:00" : "19:00 - 07:00");
  const getNextShiftTime = () => (isDay ? "19:00 - 07:00" : "07:00 - 19:00");

  const currentShiftTechnicians = getCurrentShiftTechnicians();
  const nextShiftTechnicians = getNextShiftTechnicians();

  return (
    <div className="space-y-8 animate-fade-in">
      {/* HEADER */}
      <div className="glass-card p-8">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white mb-2">TechSPIE Dashboard</h1>
            <p className="text-slate-300 mb-4">
              Technical Facility Management System – Miasteczko Orange
            </p>
            <div className="flex gap-6 text-slate-400">
              <div className="flex items-center gap-2">
                <div className="status-indicator bg-green-400"></div>
                <span>System Online</span>
              </div>
              <span>{new Date().toLocaleDateString("pl-PL", { weekday: "long", day: "numeric", month: "long" })}</span>
              <span>{new Date().toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit" })}</span>
            </div>
          </div>
          {weather && (
            <div className="glass-card-light p-4 min-w-[220px]">
              <div className="flex gap-3 items-center mb-2">
                <span className="text-2xl">{weather.icon}</span>
                <div>
                  <div className="font-semibold text-white">{weather.city}</div>
                  <div className="text-sm text-slate-400">{weather.description}</div>
                </div>
              </div>
              <div className="text-3xl font-bold text-white mb-2">{weather.temperature}°C</div>
              <div className="grid grid-cols-2 gap-2 text-xs text-slate-400">
                <div>Wilgotność: {weather.humidity}%</div>
                <div>Wiatr: {weather.windSpeed} km/h</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* CURRENT SHIFT */}
      <div className="glass-card p-6">
        <h2 className="text-xl font-bold text-white mb-4">{getCurrentShiftName()}</h2>
        {loading ? (
          <div className="text-slate-400">Ładowanie danych zmiany...</div>
        ) : (
          <>
            {currentShiftTechnicians.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {currentShiftTechnicians.map((tech, i) => (
                  <div
                    key={i}
                    className="glass-card-light p-3 rounded flex items-center gap-3 hover:bg-slate-700/30 transition"
                  >
                    <div className="w-8 h-8 gradient-accent rounded-full flex items-center justify-center text-white font-bold">
                      {tech.split(" ").map(s => s[0]).join("")}
                    </div>
                    <div className="text-white">{tech}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-slate-400">Brak techników na tej zmianie.</div>
            )}
          </>
        )}
      </div>

      {/* STATISTICS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="metric-card">
          <h3>Aktywni technicy</h3>
          <p className="value">{dashboardStats.activeTechnicians}</p>
        </div>
        <div className="metric-card">
          <h3>Zadania w toku</h3>
          <p className="value">{dashboardStats.currentTasks}</p>
        </div>
        <div className="metric-card">
          <h3>Pula zadań</h3>
          <p className="value">{dashboardStats.poolTasks}</p>
        </div>
        <div className="metric-card">
          <h3>Wykonane dzisiaj</h3>
          <p className="value">{dashboardStats.completedToday}</p>
        </div>
      </div>
    </div>
  );
}
