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
    if (target <= now) {
      target.setDate(target.getDate() + 1);
    }
    const diffMs = target.getTime() - now.getTime();
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}min`;
  };

  useEffect(() => {
    fetchTodayShift();
    fetchWeatherData();
    checkDatabaseStatus();
    calculateStats();

    const interval = setInterval(() => {
      fetchTodayShift();
      fetchWeatherData();
      checkDatabaseStatus();
      calculateStats();
    }, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, [tasks, technicians, todayShift]);

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
      const hasData = tasks.length > 0 || technicians.length > 0;
      setDbStatus({ connected: true, message: hasData ? "Operacyjna" : "Połączono (brak danych)" });
    } catch (error) {
      console.error(error);
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
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = () => {
    const activeTechnicians = todayShift ? todayShift.totalWorking : 0;
    const currentTasks = tasks.filter(t => ['assigned', 'in_progress'].includes(t.status)).length;
    const poolTasks = tasks.filter(t => t.status === 'pool').length;
    const todayString = new Date().toDateString();
    const completedToday = tasks.filter(t =>
      t.status === 'completed' &&
      t.completedAt &&
      new Date(t.completedAt).toDateString() === todayString
    ).length;
    setDashboardStats({ activeTechnicians, currentTasks, completedToday, poolTasks });
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

  const currentShiftTechnicians = getCurrentShiftTechnicians();
  const nextShiftTechnicians = getNextShiftTechnicians();

  const getCurrentShiftName = () => (isDay ? "Zmiana dzienna" : "Zmiana nocna");
  const getNextShiftName = () => (isDay ? "Zmiana nocna" : "Zmiana dzienna");
  const getCurrentShiftTime = () => (isDay ? "07:00 - 19:00" : "19:00 - 07:00");
  const getNextShiftTime = () => (isDay ? "19:00 - 07:00" : "07:00 - 19:00");

  const currentShiftTasks = tasks.filter(task =>
    task.shift === (isDay ? "Dzienna" : "Nocna") && ['assigned', 'in_progress'].includes(task.status)
  );

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header with System Status */}
      <div className="glass-card p-4 md:p-8">
        ... // pozostała część niezmieniona
      </div>

      {/* Current Shift Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8 w-full">
        {/* Current Shift */}
        <div className="lg:col-span-2 glass-card overflow-hidden">
          ... // reszta Current Shift
        </div>

        {/* Next Shift Preview */}
        <div className="glass-card overflow-hidden">
          <div className={`${!isDay ? 'gradient-warning' : 'gradient-primary'} px-4 md:px-6 py-3 md:py-4`}> ... </div>
          <div className="p-4 md:p-6">
            <h4 className="font-bold text-white mb-3 md:mb-4 text-sm md:text-base">Następna zmiana</h4>
            ... // lista techników
            <div className="mt-4 md:mt-6 pt-3 md:pt-4 border-t border-slate-600">
              <div className="text-sm text-slate-400 text-center">
                <div className="font-semibold text-white">Zmiana za:</div>
                <div className="text-base md:text-lg font-bold text-orange-400">
                  {getTimeUntil(isDay ? 19 : 7)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

     
    </div>
  );
}
