import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTasks } from "../hooks/useTasks";
import { useTechnicians } from "../hooks/useTechnicians";
import { sheetsService } from "../services/sheetsService";
import ShiftCalendar from "../components/ShiftCalendar";

export default function Dashboard() {
  const navigate = useNavigate();
  const { tasks } = useTasks();
  const { technicians } = useTechnicians();
  const [todayShift, setTodayShift] = useState(null);
  const [loading, setLoading] = useState(true);
  const [weather, setWeather] = useState(null);
  const [dashboardStats, setDashboardStats] = useState({
    activeTechnicians: 0,
    currentTasks: 0,
    completedToday: 0,
    poolTasks: 0,
  });
  const [allShifts, setAllShifts] = useState([]);
  const currentHour = new Date().getHours();
  const isDay = currentHour >= 7 && currentHour < 19;

  useEffect(() => {
    fetchTodayShift();
    fetchWeatherData();

    const interval = setInterval(() => {
      fetchTodayShift();
      fetchWeatherData();
    }, 10 * 60 * 1000);

    return () => clearInterval(interval);
  }, [tasks, technicians]);

  useEffect(() => {
    if (todayShift) {
      calculateStats();
    }
  }, [todayShift, tasks]);

  const fetchWeatherData = async () => {
    const mockWeather = {
      temperature: Math.round(15 + Math.random() * 10),
      humidity: Math.round(45 + Math.random() * 30),
      pressure: Math.round(1010 + Math.random() * 20),
      windSpeed: Math.round(5 + Math.random() * 10),
      description: "Częściowo pochmurno",
      icon: "⛅",
      city: "Warszawa",
    };
    setWeather(mockWeather);
  };

  const fetchTodayShift = async () => {
    try {
      setLoading(true);
      const data = await sheetsService.getCurrentMonthData();
      const today = new Date();
      const todayDay = today.getDate();
      const shift = data.shifts.find((shift) => shift.dayNumber === todayDay);
      setTodayShift(shift || null);
      setAllShifts(data.shifts);
    } catch (error) {
      console.error("Error fetching today shift:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = () => {
    const activeTechnicians = todayShift ? todayShift.totalWorking : 0;
    const currentTasks = tasks.filter((t) => ["assigned", "in_progress"].includes(t.status)).length;
    const poolTasks = tasks.filter((t) => t.status === "pool").length;

    const today = new Date().toDateString();
    const completedToday = tasks.filter(
      (t) => t.status === "completed" && t.completedAt && new Date(t.completedAt).toDateString() === today
    ).length;

    setDashboardStats({
      activeTechnicians,
      currentTasks,
      completedToday,
      poolTasks,
    });
  };

  const getCurrentShiftTechnicians = () => {
    if (!todayShift) return [];
    return isDay ? todayShift.dayTechnicians : todayShift.nightTechnicians;
  };

  const getNextShiftTechnicians = () => {
    if (!todayShift) return [];
    return isDay ? todayShift.nightTechnicians : todayShift.dayTechnicians;
  };

  const getCurrentShiftTasks = () => {
    const currentShift = isDay ? "Dzienna" : "Nocna";
    return tasks.filter(
      (task) => task.shift === currentShift && ["assigned", "in_progress"].includes(task.status)
    );
  };

  const noTechniciansToday =
    todayShift && todayShift.dayTechnicians.length === 0 && todayShift.nightTechnicians.length === 0;

  const currentShiftTechnicians = getCurrentShiftTechnicians();
  const nextShiftTechnicians = getNextShiftTechnicians();
  const currentShiftTasks = getCurrentShiftTasks();

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="glass-card p-4 md:p-8">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
          <div className="flex-1">
            <h1 className="text-2xl md:text-4xl font-bold text-white mb-2">TechSPIE Dashboard</h1>
            <p className="text-slate-300 text-sm md:text-lg mb-3">System Techniczny - Miasteczko Orange</p>
            <div className="flex gap-4 text-slate-400 text-sm">
              <span>{new Date().toLocaleDateString('pl-PL', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
              <span>{new Date().toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })}</span>
              <span className="text-green-400 font-semibold">● System online</span>
            </div>
          </div>

          {weather && (
            <div className="block lg:hidden text-right text-slate-300">
              <div className="text-xl">{weather.icon} {weather.temperature}°C</div>
              <div className="text-xs">{weather.description}</div>
            </div>
          )}
        </div>
      </div>

      {noTechniciansToday && (
        <div className="p-4 bg-red-500/20 border border-red-400 text-red-300 rounded-xl">
          ⚠️ Brak przypisanych techników do dzisiejszej zmiany
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-4 md:p-6">
          <h3 className="text-white text-lg font-semibold mb-4">Aktualna zmiana</h3>
          {loading ? (
            <p className="text-slate-400">Ładowanie danych...</p>
          ) : (
            <div>
              <p className="text-slate-300 mb-2">{isDay ? 'Zmiana dzienna (07:00 - 19:00)' : 'Zmiana nocna (19:00 - 07:00)'}</p>
              <ul className="list-disc pl-4 text-white space-y-1">
                {currentShiftTechnicians.map((tech, i) => (
                  <li key={i}>{tech}</li>
                ))}
              </ul>
              {currentShiftTechnicians.length === 0 && <p className="text-slate-400">Brak techników</p>}
            </div>
          )}
        </div>

        <ShiftCalendar shifts={allShifts} />
      </div>
    </div>
  );
}
