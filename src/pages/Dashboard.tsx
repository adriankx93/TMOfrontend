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
        setDbStatus({
          connected: true,
          message: "Operacyjna"
        });
      } else {
        setDbStatus({
          connected: true,
          message: "Połączono (brak danych)"
        });
      }
    } catch (error) {
      setDbStatus({
        connected: false,
        message: "Problem z połączeniem"
      });
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
      setTodayShift(null);
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
      {/* ...cały Twój JSX, bez zmian */}
    </div>
  );
}

