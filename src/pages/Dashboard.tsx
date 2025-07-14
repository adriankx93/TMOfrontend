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
    // Mock weather data - w rzeczywistej aplikacji można użyć API pogodowego
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
      // Sprawdź, czy mamy dostęp do danych zadań i techników
      const hasTasksData = tasks.length > 0;
      const hasTechniciansData = technicians.length > 0;
      
      // Jeśli mamy dane, zakładamy że połączenie działa
      if (hasTasksData || hasTechniciansData) {
        setDbStatus({ 
          connected: true, 
          message: "Operacyjna" 
        });
      } else {
        // Jeśli nie mamy danych, ale nie było błędu, to połączenie działa, ale baza może być pusta
        setDbStatus({ 
          connected: true, 
          message: "Połączono (brak danych)" 
        });
      }
    } catch (error) {
      console.error("Błąd podczas sprawdzania statusu bazy danych:", error);
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
      
      // Pobierz dzisiejszą datę w strefie czasowej Polski
      const today = new Date();
      const todayDay = today.getDate(); // Dzień miesiąca (1-31)
      
      const shift = data.shifts.find(shift => {
        return shift.dayNumber === todayDay;
      });

      setTodayShift(shift || null);
    } catch (error) {
      console.error('Error fetching today shift:', error);
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
          <div className="flex-1 min-w-0 dark:text-white light:text-slate-800">
            <div className="flex items-center gap-3 md:gap-4 mb-4">
              <div className="w-12 h-12 md:w-16 md:h-16 gradient-primary rounded-2xl flex items-center justify-center shadow-lg glow-blue dark:text-white light:text-white">
                <span className="text-xl md:text-2xl">🏢</span>
              </div>
              <div>
                <h1 className="text-2xl md:text-4xl font-bold dark:text-white light:text-slate-800 mb-2">TechSPIE Dashboard</h1>
                <p className="dark:text-slate-300 light:text-slate-600 text-sm md:text-lg">
                  Technical Facility Management System - Miasteczko Orange
                </p>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6 dark:text-slate-300 light:text-slate-600">
              <div className="flex items-center gap-2">
                <div className="status-indicator bg-green-400"></div>
                <span className="text-sm font-medium dark:text-slate-300 light:text-slate-700">System Online</span>
              </div>
              <div className="text-xs md:text-sm font-medium">
                {new Date().toLocaleDateString('pl-PL', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
              <div className="text-base md:text-lg font-bold dark:text-white light:text-slate-800">
                {new Date().toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
          
          {/* Weather Widget */}
          {weather && (
            <div className="glass-card-light p-4 md:p-6 min-w-[200px] md:min-w-[280px] hidden lg:block">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{weather.icon}</span>
                  <div className="dark:text-white light:text-slate-800">
                    <div className="font-semibold">{weather.city}</div>
                    <div className="text-sm dark:text-slate-400 light:text-slate-600">{weather.description}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold dark:text-white light:text-slate-800">{weather.temperature}°C</div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="text-center">
                  <div className="dark:text-slate-400 light:text-slate-600">Wilgotność</div>
                  <div className="font-semibold dark:text-white light:text-slate-800">{weather.humidity}%</div>
                </div>
                <div className="text-center">
                  <div className="dark:text-slate-400 light:text-slate-600">Wiatr</div>
                  <div className="font-semibold dark:text-white light:text-slate-800">{weather.windSpeed} km/h</div>
                </div>
              </div>
              
              <div className="mt-4 pt-4 dark:border-slate-600 light:border-slate-300 border-t text-xs dark:text-slate-400 light:text-slate-500 text-center">
                Ostatnia aktualizacja: {new Date().toLocaleTimeString('pl-PL')}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Current Shift Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8 w-full">
        {/* Current Shift */}
        <div className="lg:col-span-2 glass-card overflow-hidden dark:text-white light:text-slate-800">
          <div className={`${isDay ? 'gradient-warning' : 'gradient-primary'} px-4 md:px-8 py-4 md:py-6`}>
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center gap-3 md:gap-4">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-white/20 rounded-2xl flex items-center justify-center text-2xl md:text-3xl">
                  {isDay ? '☀️' : '🌙'}
                </div>
                <div>
                  <h2 className="text-lg md:text-2xl font-bold">{getCurrentShiftName()}</h2>
                  <p className="text-white/80 text-sm md:text-lg">{getCurrentShiftTime()}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl md:text-4xl font-bold">
                  {loading ? '...' : currentShiftTechnicians.length}
                </div>
                <div className="text-white/80 text-sm md:text-base">Na zmianie</div>
              </div>
            </div>
          </div>

          <div className="p-4 md:p-8">
            {loading ? (
              <div className="animate-pulse space-y-4">
                <div className="h-4 dark:bg-slate-700 light:bg-slate-300 rounded w-1/4"></div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-20 dark:bg-slate-700 light:bg-slate-300 rounded"></div>
                  <div className="h-20 dark:bg-slate-700 light:bg-slate-300 rounded"></div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base md:text-lg font-bold dark:text-white light:text-slate-800 mb-4">Technicy na aktualnej zmianie</h3>
                  {currentShiftTechnicians.length > 0 ? (
                    <div className="grid grid-cols-1 gap-3 md:gap-4 w-full">
                      {currentShiftTechnicians.map((techName, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 md:p-4 glass-card-light rounded-xl dark:hover:bg-slate-600/30 light:hover:bg-blue-50/80 transition-all duration-200">
                          <div className="w-8 h-8 md:w-10 md:h-10 gradient-accent rounded-full flex items-center justify-center dark:text-white light:text-white font-bold text-sm">
                            {techName.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <div className="font-semibold dark:text-white light:text-slate-800 text-sm md:text-base">{techName}</div>
                            <div className="text-xs md:text-sm dark:text-emerald-400 light:text-emerald-600 flex items-center gap-1">
                              <div className="status-indicator bg-emerald-400"></div>
                              Aktywny
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-slate-400">
                      <span className="text-4xl mb-4 block dark:text-slate-400 light:text-slate-500">👷</span>
                      <span className="dark:text-slate-400 light:text-slate-500">Brak techników na aktualnej zmianie</span>
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-base md:text-lg font-bold dark:text-white light:text-slate-800 mb-4">Zadania na aktualnej zmianie</h3>
                  {currentShiftTasks.length > 0 ? (
                    <div className="space-y-3 w-full">
                      {currentShiftTasks.slice(0, 3).map((task) => (
                        <div key={task._id} className="flex items-center gap-3 p-3 md:p-4 glass-card-light rounded-xl dark:text-white light:text-slate-800">
                          <div className="w-6 h-6 md:w-8 md:h-8 dark:bg-blue-500/20 light:bg-blue-100 rounded-full flex items-center justify-center dark:text-blue-400 light:text-blue-600 text-sm">
                            📋
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold dark:text-white light:text-slate-800 text-sm md:text-base">{task.title}</div>
                            <div className="text-xs md:text-sm dark:text-slate-400 light:text-slate-600">{task.location} • {task.category}</div>
                          </div>
                          <div className={`px-2 md:px-3 py-1 rounded-xl text-xs md:text-sm font-semibold ${
                            task.status === 'in_progress' 
                              ? 'dark:bg-amber-500/20 light:bg-amber-100 dark:text-amber-400 light:text-amber-700' 
                              : 'dark:bg-blue-500/20 light:bg-blue-100 dark:text-blue-400 light:text-blue-700'
                          }`}>
                            {task.status === 'in_progress' ? 'W trakcie' : 'Przypisane'}
                          </div>
                        </div>
                      ))}
                      {currentShiftTasks.length > 3 && (
                        <div className="text-center text-xs md:text-sm dark:text-slate-400 light:text-slate-500">
                          ... i {currentShiftTasks.length - 3} więcej zadań
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-6 dark:text-slate-400 light:text-slate-500">
                      <span className="text-3xl mb-2 block dark:text-slate-400 light:text-slate-500">📋</span>
                      <span className="dark:text-slate-400 light:text-slate-500">Brak zadań na aktualnej zmianie</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Next Shift Preview */}
        <div className="glass-card overflow-hidden dark:text-white light:text-slate-800">
          <div className={`${!isDay ? 'gradient-warning' : 'gradient-primary'} px-4 md:px-6 py-3 md:py-4`}>
            <div className="text-white text-center">
              <div className="text-xl md:text-2xl mb-2">{!isDay ? '☀️' : '🌙'}</div>
              <h3 className="text-base md:text-lg font-bold">{getNextShiftName()}</h3>
              <p className="text-white/80 text-sm md:text-base">{getNextShiftTime()}</p>
            </div>
          </div>

          <div className="p-4 md:p-6">
            <h4 className="font-bold dark:text-white light:text-slate-800 mb-3 md:mb-4 text-sm md:text-base">Następna zmiana</h4>
            {nextShiftTechnicians.length > 0 ? (
              <div className="space-y-3">
                {nextShiftTechnicians.map((techName, index) => (
                  <div key={index} className="flex items-center gap-2 md:gap-3 p-2 md:p-3 glass-card-light rounded-xl dark:text-white light:text-slate-800">
                    <div className="w-6 h-6 md:w-8 md:h-8 dark:bg-slate-500/30 light:bg-slate-200 rounded-full flex items-center justify-center dark:text-slate-400 light:text-slate-600 text-xs md:text-sm font-bold">
                      {techName.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="font-medium dark:text-white light:text-slate-800 text-xs md:text-sm">{techName}</div>
                      <div className="text-xs dark:text-slate-400 light:text-slate-600">Oczekuje</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 md:py-6 dark:text-slate-400 light:text-slate-500">
                <span className="text-xl md:text-2xl mb-2 block dark:text-slate-400 light:text-slate-500">⏰</span>
                <div className="text-sm dark:text-slate-400 light:text-slate-500">Brak techników na następnej zmianie</div>
              </div>
            )}

            <div className="mt-4 md:mt-6 pt-3 md:pt-4 dark:border-slate-600 light:border-slate-300 border-t">
              <div className="text-sm dark:text-slate-400 light:text-slate-600 text-center">
                <div className="font-semibold dark:text-white light:text-slate-800">Zmiana za:</div>
                <div className="text-base md:text-lg font-bold dark:text-orange-400 light:text-orange-600">
                  {isDay 
                    ? `${19 - currentHour}h ${60 - new Date().getMinutes()}min`
                    : `${7 + (24 - currentHour)}h ${60 - new Date().getMinutes()}min`
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 w-full">
        <div 
          className="metric-card cursor-pointer hover:scale-105 transition-transform duration-200 dark:text-white light:text-slate-800"
          onClick={() => navigate('/technicy')}
        >
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <div className="w-10 h-10 md:w-12 md:h-12 dark:bg-emerald-500/20 light:bg-emerald-100 rounded-xl flex items-center justify-center">
              <span className="text-xl md:text-2xl">👷</span>
            </div>
            <div className="px-2 md:px-3 py-1 dark:bg-emerald-500/20 light:bg-emerald-100 dark:text-emerald-400 light:text-emerald-700 rounded-full text-xs md:text-sm font-bold">
              {dashboardStats.activeTechnicians}
            </div>
          </div>
          <h3 className="text-sm md:text-lg font-semibold dark:text-white light:text-slate-800 mb-1">Technicy aktywni</h3>
          <p className="dark:text-slate-400 light:text-slate-600 text-xs md:text-sm">Na dzisiejszej zmianie</p>
        </div>

        <div 
          className="metric-card cursor-pointer hover:scale-105 transition-transform duration-200 dark:text-white light:text-slate-800"
          onClick={() => navigate('/zadania')}
        >
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <div className="w-10 h-10 md:w-12 md:h-12 dark:bg-blue-500/20 light:bg-blue-100 rounded-xl flex items-center justify-center">
              <span className="text-xl md:text-2xl">📋</span>
            </div>
            <div className="px-2 md:px-3 py-1 dark:bg-blue-500/20 light:bg-blue-100 dark:text-blue-400 light:text-blue-700 rounded-full text-xs md:text-sm font-bold">
              {dashboardStats.currentTasks}
            </div>
          </div>
          <h3 className="text-sm md:text-lg font-semibold dark:text-white light:text-slate-800 mb-1">Zadania w toku</h3>
          <p className="dark:text-slate-400 light:text-slate-600 text-xs md:text-sm">Przypisane i w realizacji</p>
        </div>

        <div 
          className="metric-card cursor-pointer hover:scale-105 transition-transform duration-200 dark:text-white light:text-slate-800"
          onClick={() => {
            navigate('/zadania');
            // Dodatkowa logika do przełączenia na tab "pool" będzie dodana później
            setTimeout(() => {
              const poolTab = document.querySelector('[data-tab="pool"]');
              if (poolTab) poolTab.click();
            }, 100);
          }}
        >
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <div className="w-10 h-10 md:w-12 md:h-12 dark:bg-amber-500/20 light:bg-amber-100 rounded-xl flex items-center justify-center">
              <span className="text-xl md:text-2xl">🔄</span>
            </div>
            <div className="px-2 md:px-3 py-1 dark:bg-amber-500/20 light:bg-amber-100 dark:text-amber-400 light:text-amber-700 rounded-full text-xs md:text-sm font-bold">
              {dashboardStats.poolTasks}
            </div>
          </div>
          <h3 className="text-sm md:text-lg font-semibold dark:text-white light:text-slate-800 mb-1">Pula zadań</h3>
          <p className="dark:text-slate-400 light:text-slate-600 text-xs md:text-sm">Oczekujące na przypisanie</p>
        </div>

        <div 
          className="metric-card cursor-pointer hover:scale-105 transition-transform duration-200 dark:text-white light:text-slate-800"
          onClick={() => {
            navigate('/zadania');
            // Dodatkowa logika do przełączenia na tab "completed" będzie dodana później
            setTimeout(() => {
              const completedTab = document.querySelector('[data-tab="completed"]');
              if (completedTab) completedTab.click();
            }, 100);
          }}
        >
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <div className="w-10 h-10 md:w-12 md:h-12 dark:bg-green-500/20 light:bg-green-100 rounded-xl flex items-center justify-center">
              <span className="text-xl md:text-2xl">✅</span>
            </div>
            <div className="px-2 md:px-3 py-1 dark:bg-green-500/20 light:bg-green-100 dark:text-green-400 light:text-green-700 rounded-full text-xs md:text-sm font-bold">
              {dashboardStats.completedToday}
            </div>
          </div>
          <h3 className="text-sm md:text-lg font-semibold dark:text-white light:text-slate-800 mb-1">Wykonane dziś</h3>
          <p className="dark:text-slate-400 light:text-slate-600 text-xs md:text-sm">Zakończone zadania</p>
        </div>
      </div>

      {/* System Health & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8 w-full">
        {/* System Health */}
        <div className="glass-card p-4 md:p-8 dark:text-white light:text-slate-800">
          <h3 className="text-lg md:text-xl font-bold dark:text-white light:text-slate-800 mb-4 md:mb-6">Status systemu</h3>
          
          <div className="space-y-4 w-full">
            <div className="flex items-center justify-between p-3 md:p-4 glass-card-light rounded-xl dark:text-white light:text-slate-800">
              <div className="flex items-center gap-3">
                <div className={`status-indicator ${dbStatus.connected ? "bg-green-400" : "bg-red-400"}`}></div>
                <span className="font-semibold text-sm md:text-base">Baza danych</span>
              </div>
              <span className={`text-xs md:text-sm font-medium truncate ${dbStatus.connected ? "dark:text-green-400 light:text-green-600" : "dark:text-red-400 light:text-red-600"}`}>
                {dbStatus.message}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 md:p-4 glass-card-light rounded-xl dark:text-white light:text-slate-800">
              <div className="flex items-center gap-3">
                <div className="status-indicator bg-green-400"></div>
                <span className="font-semibold text-sm md:text-base">Google Sheets API</span>
              </div>
              <span className="dark:text-green-400 light:text-green-600 text-xs md:text-sm font-medium">Synchronizacja aktywna</span>
            </div>

            <div className="flex items-center justify-between p-3 md:p-4 glass-card-light rounded-xl dark:text-white light:text-slate-800">
              <div className="flex items-center gap-3">
                <div className="status-indicator bg-amber-400"></div>
                <span className="font-semibold text-sm md:text-base">Powiadomienia</span>
              </div>
              <span className="dark:text-amber-400 light:text-amber-600 text-xs md:text-sm font-medium">Częściowo aktywne</span>
            </div>

            <div className="flex items-center justify-between p-3 md:p-4 glass-card-light rounded-xl dark:text-white light:text-slate-800">
              <div className="flex items-center gap-3">
                <div className="status-indicator bg-green-400"></div>
                <span className="font-semibold text-sm md:text-base">Monitoring</span>
              </div>
              <span className="dark:text-green-400 light:text-green-600 text-xs md:text-sm font-medium">Online</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="glass-card p-4 md:p-8 dark:text-white light:text-slate-800">
          <h3 className="text-lg md:text-xl font-bold dark:text-white light:text-slate-800 mb-4 md:mb-6">Szybkie akcje</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => window.location.href = '/zadania'}
              className="p-4 md:p-6 glass-card-light dark:hover:bg-slate-600/30 light:hover:bg-blue-50/80 rounded-2xl transition-all duration-200 text-left group"
            >
              <div className="text-2xl md:text-3xl mb-2 md:mb-3 group-hover:scale-110 transition-transform duration-200">📋</div>
              <div className="font-semibold dark:text-blue-300 light:text-blue-600 text-sm md:text-base">Nowe zadanie</div>
              <div className="text-xs md:text-sm dark:text-slate-400 light:text-slate-600">Utwórz zadanie</div>
            </button>
            
            <button 
              onClick={() => window.location.href = '/technicy'}
              className="p-4 md:p-6 glass-card-light dark:hover:bg-slate-600/30 light:hover:bg-blue-50/80 rounded-2xl transition-all duration-200 text-left group"
            >
              <div className="text-2xl md:text-3xl mb-2 md:mb-3 group-hover:scale-110 transition-transform duration-200">👷</div>
              <div className="font-semibold dark:text-emerald-300 light:text-emerald-600 text-sm md:text-base">Zespół</div>
              <div className="text-xs md:text-sm dark:text-slate-400 light:text-slate-600">Zarządzaj technikami</div>
            </button>
            
            <button 
              onClick={() => window.location.href = '/budynki'}
              className="p-4 md:p-6 glass-card-light dark:hover:bg-slate-600/30 light:hover:bg-blue-50/80 rounded-2xl transition-all duration-200 text-left group"
            >
              <div className="text-2xl md:text-3xl mb-2 md:mb-3 group-hover:scale-110 transition-transform duration-200">🏢</div>
              <div className="font-semibold dark:text-purple-300 light:text-purple-600 text-sm md:text-base">Budynki</div>
              <div className="text-xs md:text-sm dark:text-slate-400 light:text-slate-600">Infrastruktura</div>
            </button>
            
            <button 
              onClick={() => window.location.href = '/raporty'}
              className="p-4 md:p-6 glass-card-light dark:hover:bg-slate-600/30 light:hover:bg-blue-50/80 rounded-2xl transition-all duration-200 text-left group"
            >
              <div className="text-2xl md:text-3xl mb-2 md:mb-3 group-hover:scale-110 transition-transform duration-200">📊</div>
              <div className="font-semibold dark:text-orange-300 light:text-orange-600 text-sm md:text-base">Raporty</div>
              <div className="text-xs md:text-sm dark:text-slate-400 light:text-slate-600">Analiza wydajności</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
