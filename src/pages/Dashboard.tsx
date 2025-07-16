import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTasks } from "../hooks/useTasks";
import { useTechnicians } from "../hooks/useTechnicians";
import { sheetsService } from "../services/sheetsService";

export default function Dashboard() {
  const navigate = useNavigate();
  const { tasks } = useTasks();
  const { technicians } = useTechnicians();
  const [todayShift, setTodayShift] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [weather, setWeather] = useState<any>(null);
  const [dbStatus, setDbStatus] = useState({ connected: false, message: "Sprawdzanie..." });
  const [dashboardStats, setDashboardStats] = useState({
    activeTechnicians: 0,
    currentTasks: 0,
    completedToday: 0,
    poolTasks: 0
  });

  // Helper: oblicza czas do kolejnej godziny zmiany
  const getTimeUntil = (targetHour: number) => {
    const now = new Date();
    const target = new Date(now);
    target.setHours(targetHour, 0, 0, 0);
    if (target <= now) target.setDate(target.getDate() + 1);
    const diff = target.getTime() - now.getTime();
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    return `${hours}h ${minutes}min`;
  };

  useEffect(() => {
    const updateAll = async () => {
      await fetchTodayShift();
      fetchWeatherData();
      checkDatabaseStatus();
      calculateStats();
    };
    updateAll();
    const interval = setInterval(updateAll, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, [tasks, technicians, todayShift]);

  const fetchWeatherData = async () => {
    const mock = {
      temperature: Math.round(15 + Math.random() * 10),
      humidity: Math.round(45 + Math.random() * 30),
      pressure: Math.round(1010 + Math.random() * 20),
      windSpeed: Math.round(5 + Math.random() * 10),
      description: "Częściowo pochmurno",
      icon: "⛅",
      city: "Warszawa"
    };
    setWeather(mock);
  };

  const checkDatabaseStatus = async () => {
    try {
      const hasData = tasks.length > 0 || technicians.length > 0;
      setDbStatus({ connected: true, message: hasData ? "Operacyjna" : "Połączono (brak danych)" });
    } catch {
      setDbStatus({ connected: false, message: "Problem z połączeniem" });
    }
  };

  const fetchTodayShift = async () => {
    setLoading(true);
    try {
      const data = await sheetsService.getCurrentMonthData();
      const day = new Date().getDate();
      const shift = data.shifts.find((s: any) => s.dayNumber === day);
      setTodayShift(shift || null);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = () => {
    const active = todayShift?.totalWorking || 0;
    const current = tasks.filter(t => ['assigned', 'in_progress'].includes(t.status)).length;
    const pool = tasks.filter(t => t.status === 'pool').length;
    const todayString = new Date().toDateString();
    const completed = tasks.filter(t => t.status === 'completed' && t.completedAt && new Date(t.completedAt).toDateString() === todayString).length;
    setDashboardStats({ activeTechnicians: active, currentTasks: current, completedToday: completed, poolTasks: pool });
  };

  const hour = new Date().getHours();
  const isDay = hour >= 7 && hour < 19;

  const currentTechnicians = todayShift ? (isDay ? todayShift.dayTechnicians : todayShift.nightTechnicians) : [];
  const nextTechnicians = todayShift ? (!isDay ? todayShift.dayTechnicians : todayShift.nightTechnicians) : [];

  const currentShift = isDay ? "Zmiana dzienna" : "Zmiana nocna";
  const nextShift = isDay ? "Zmiana nocna" : "Zmiana dzienna";

  const currentTasksList = tasks.filter(t => t.shift === (isDay ? "Dzienna" : "Nocna") && ['assigned', 'in_progress'].includes(t.status));

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="glass-card p-4 md:p-8">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl md:text-4xl font-bold text-white">TechSPIE Dashboard</h1>
            <p className="text-slate-300">Technical Facility Management System</p>
            <div className="flex items-center gap-4 mt-2 text-slate-300">
              <span>{new Date().toLocaleDateString('pl-PL', { weekday:'long', day:'numeric', month:'long' })}</span>
              <span>{new Date().toLocaleTimeString('pl-PL',{hour:'2-digit',minute:'2-digit'})}</span>
            </div>
          </div>
          {weather && (
            <div className="glass-card-light p-4 hidden lg:block">
              <div className="flex items-center justify-between">
                <div><span className="text-3xl">{weather.icon}</span><span className="ml-2 text-white">{weather.city}</span></div>
                <div className="text-3xl text-white">{weather.temperature}°C</div>
              </div>
              <div className="mt-2 text-sm text-slate-400">{weather.description}</div>
            </div>
          )}
        </div>
      </div>

      {/* Current & Next Shift */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Current Shift */}
        <div className="lg:col-span-2 glass-card">
          <div className={`${isDay ? 'gradient-warning' : 'gradient-primary'} p-4`}> 
            <h2 className="text-white text-xl font-bold">{currentShift}</h2>
            <p className="text-white/80">{isDay ? '07:00 - 19:00' : '19:00 - 07:00'}</p>
            <p className="text-white text-3xl mt-2">{currentTechnicians.length}</p>
          </div>
          <div className="p-4">
            <h3 className="text-white font-semibold mb-2">Technicy:</h3>
            {currentTechnicians.map((n:string,i:number)=>(<div key={i} className="text-slate-300">{n}</div>))}
            <h3 className="text-white font-semibold mt-4 mb-2">Zadania:</h3>
            {currentTasksList.slice(0,3).map(t=>(<div key={t._id} className="text-slate-300">{t.title}</div>))}
          </div>
        </div>
        {/* Next Shift */}
        <div className="glass-card">
          <div className={`${!isDay ? 'gradient-warning' : 'gradient-primary'} p-4`}> 
            <h2 className="text-white text-xl font-bold">{nextShift}</h2>
            <p className="text-white/80">{!isDay ? '07:00 - 19:00' : '19:00 - 07:00'}</p>
          </div>
          <div className="p-4">
            <h3 className="text-white font-semibold mb-2">Technicy:</h3>
            {nextTechnicians.map((n:string,i:number)=>(<div key={i} className="text-slate-300">{n}</div>))}
            <div className="mt-4 text-center text-orange-400 font-bold">
              Zmiana za: {getTimeUntil(isDay ? 19 : 7)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
