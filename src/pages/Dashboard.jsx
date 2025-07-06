import { useEffect, useState } from "react";
import { useTasks } from "../hooks/useTasks";
import { useTechnicians } from "../hooks/useTechnicians";
import { sheetsService } from "../services/sheetsService";

interface WeatherData {
  time: string;
  temperature: number;
  humidity: number;
  precipitation: number;
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
    poolTasks: 0,
  });

  // Weather fetch
  const fetchWeather = async () => {
    try {
      const url =
        "https://api.open-meteo.com/v1/forecast?latitude=52.2298&longitude=21.0118&hourly=temperature_2m,relative_humidity_2m,precipitation&forecast_days=1";
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      const now = {
        time: data.hourly.time[0],
        temperature: data.hourly.temperature_2m[0],
        humidity: data.hourly.relative_humidity_2m[0],
        precipitation: data.hourly.precipitation[0],
      };
      setWeather(now);
    } catch (err) {
      console.error("Błąd pogody:", err);
    }
  };

  // Shift fetch
  const fetchTodayShift = async () => {
    try {
      setLoading(true);
      const data = await sheetsService.getCurrentMonthData();
      const today = new Date().getDate();
      const shift = data.shifts.find((s) => s.dayNumber === today);
      setTodayShift(shift || null);
    } catch (err) {
      console.error("Błąd shiftów:", err);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = () => {
    const activeTechnicians = todayShift ? todayShift.totalWorking : 0;
    const currentTasks = tasks.filter((t) =>
      ["assigned", "in_progress"].includes(t.status)
    ).length;
    const poolTasks = tasks.filter((t) => t.status === "pool").length;
    const today = new Date().toDateString();
    const completedToday = tasks.filter(
      (t) =>
        t.status === "completed" &&
        t.completedAt &&
        new Date(t.completedAt).toDateString() === today
    ).length;

    setDashboardStats({
      activeTechnicians,
      currentTasks,
      completedToday,
      poolTasks,
    });
  };

  useEffect(() => {
    fetchTodayShift();
    fetchWeather();
    calculateStats();

    const interval = setInterval(() => {
      fetchWeather();
      fetchTodayShift();
    }, 10 * 60 * 1000);

    return () => clearInterval(interval);
  }, [tasks, technicians]);

  const hour = new Date().getHours();
  const isDay = hour >= 7 && hour < 19;

  const currentShiftTechnicians = isDay
    ? todayShift?.dayTechnicians ?? []
    : todayShift?.nightTechnicians ?? [];

  const nextShiftTechnicians = isDay
    ? todayShift?.nightTechnicians ?? []
    : todayShift?.dayTechnicians ?? [];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="glass-card p-8">
        <div className="flex justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">TechSPIE Dashboard</h1>
            <p className="text-slate-400 mb-4">
              Technical Facility Management System - Miasteczko Orange
            </p>
            <div className="flex gap-4 text-slate-400 text-sm">
              <div className="flex items-center gap-2">
                <div className="status-indicator bg-green-400"></div>
                <span>System Online</span>
              </div>
              <span>
                {new Date().toLocaleDateString("pl-PL", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>
          {weather ? (
            <div className="glass-card-light p-4 min-w-[200px]">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white font-semibold">Warszawa</div>
                  <div className="text-slate-400 text-sm">Pogoda</div>
                </div>
                <div className="text-3xl">{weather.temperature}°C</div>
              </div>
              <div className="grid grid-cols-3 mt-4 gap-2 text-xs text-slate-300">
                <div>
                  <div>Wilg.</div>
                  <div className="font-semibold text-white">{weather.humidity}%</div>
                </div>
                <div>
                  <div>Opady</div>
                  <div className="font-semibold text-white">{weather.precipitation} mm</div>
                </div>
                <div>
                  <div>Godz.</div>
                  <div className="font-semibold text-white">
                    {new Date(weather.time).getHours()}:00
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="glass-card-light p-4 text-slate-400">Ładowanie pogody...</div>
          )}
        </div>
      </div>

      {/* Active Technicians */}
      <div className="glass-card p-6">
        <h2 className="text-xl font-semibold text-white mb-4">
          Technicy na {isDay ? "dziennej" : "nocnej"} zmianie
        </h2>
        {currentShiftTechnicians.length > 0 ? (
          <ul className="grid grid-cols-2 gap-4">
            {currentShiftTechnicians.map((tech, i) => (
              <li
                key={i}
                className="glass-card-light p-3 rounded flex items-center gap-3"
              >
                <div className="w-8 h-8 bg-emerald-500/30 rounded-full flex items-center justify-center font-bold text-white">
                  {tech
                    .split(" ")
                    .map((p) => p[0])
                    .join("")}
                </div>
                <div>
                  <div className="text-white">{tech}</div>
                  <div className="text-xs text-slate-400">Aktywny</div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-slate-400">Brak techników na zmianie</p>
        )}
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="metric-card">
          <div className="flex justify-between mb-2">
            <div className="text-xl">👷</div>
            <div className="font-bold">{dashboardStats.activeTechnicians}</div>
          </div>
          <div className="text-slate-400 text-sm">Aktywni technicy</div>
        </div>
        <div className="metric-card">
          <div className="flex justify-between mb-2">
            <div className="text-xl">📋</div>
            <div className="font-bold">{dashboardStats.currentTasks}</div>
          </div>
          <div className="text-slate-400 text-sm">Zadania w toku</div>
        </div>
        <div className="metric-card">
          <div className="flex justify-between mb-2">
            <div className="text-xl">✅</div>
            <div className="font-bold">{dashboardStats.completedToday}</div>
          </div>
          <div className="text-slate-400 text-sm">Wykonane dzisiaj</div>
        </div>
        <div className="metric-card">
          <div className="flex justify-between mb-2">
            <div className="text-xl">🔄</div>
            <div className="font-bold">{dashboardStats.poolTasks}</div>
          </div>
          <div className="text-slate-400 text-sm">Pula zadań</div>
        </div>
      </div>
    </div>
  );
}
