import { useEffect, useState } from "react";
import { useTasks } from "../hooks/useTasks";
import { useTechnicians } from "../hooks/useTechnicians";
import { sheetsService } from "../services/sheetsService";
import WeatherWidget from "../components/WeatherWidget";

export default function Dashboard() {
  const { tasks } = useTasks();
  const { technicians } = useTechnicians();
  const [todayShift, setTodayShift] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dashboardStats, setDashboardStats] = useState({
    activeTechnicians: 0,
    currentTasks: 0,
    completedToday: 0,
    poolTasks: 0
  });

  useEffect(() => {
    fetchTodayShift();
    calculateStats();
    
    const interval = setInterval(fetchTodayShift, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, [tasks, technicians]);

  const fetchTodayShift = async () => {
    try {
      setLoading(true);
      const data = await sheetsService.getCurrentMonthData();
      
      const today = new Date();
      const shift = data.shifts.find(shift => {
        const shiftDate = new Date(shift.date);
        return shiftDate.toDateString() === today.toDateString();
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

  // Get tasks for current shift
  const getCurrentShiftTasks = () => {
    const currentShift = isDay ? "Dzienna" : "Nocna";
    return tasks.filter(task => 
      task.shift === currentShift && 
      ['assigned', 'in_progress'].includes(task.status)
    );
  };

  const currentShiftTasks = getCurrentShiftTasks();

  return (
    <div className="space-y-8">
      {/* Header with Weather */}
      <div className="bg-gradient-to-br from-orange-500 via-red-500 to-pink-600 rounded-3xl shadow-2xl p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-6">
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-2">Dashboard TMO</h1>
              <p className="text-orange-100 text-lg">
                System zarządzania Miasteczka Orange
              </p>
              <div className="flex items-center gap-4 mt-3 text-orange-100">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  <span className="text-sm">System aktywny</span>
                </div>
                <div className="text-sm">
                  {new Date().toLocaleDateString('pl-PL', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </div>
                <div className="text-lg font-bold">
                  {new Date().toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
            
            {/* Weather Widget */}
            <div className="w-80">
              <WeatherWidget />
            </div>
          </div>
        </div>
      </div>

      {/* Current Shift - Enhanced */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Current Shift */}
        <div className="lg:col-span-2 bg-white/90 backdrop-blur-xl border border-white/30 rounded-3xl shadow-2xl overflow-hidden">
          <div className={`bg-gradient-to-r ${isDay ? 'from-yellow-400 to-orange-500' : 'from-blue-500 to-indigo-600'} px-8 py-6`}>
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-3xl">
                  {isDay ? '☀️' : '🌙'}
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{getCurrentShiftName()}</h2>
                  <p className="text-white/80 text-lg">{getCurrentShiftTime()}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold">
                  {loading ? '...' : currentShiftTechnicians.length}
                </div>
                <div className="text-white/80">Na zmianie</div>
              </div>
            </div>
          </div>

          <div className="p-8">
            {loading ? (
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-slate-200 rounded w-1/4"></div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-20 bg-slate-200 rounded"></div>
                  <div className="h-20 bg-slate-200 rounded"></div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Current Shift Technicians */}
                <div>
                  <h3 className="text-lg font-bold text-slate-800 mb-4">Technicy na aktualnej zmianie</h3>
                  {currentShiftTechnicians.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {currentShiftTechnicians.map((techName, index) => (
                        <div key={index} className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-all duration-200">
                          <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-white font-bold">
                            {techName.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-800">{techName}</div>
                            <div className="text-sm text-emerald-600 flex items-center gap-1">
                              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                              Aktywny
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-slate-500">
                      <span className="text-4xl mb-4 block">👷</span>
                      Brak techników na aktualnej zmianie
                    </div>
                  )}
                </div>

                {/* Current Shift Tasks */}
                <div>
                  <h3 className="text-lg font-bold text-slate-800 mb-4">Zadania na aktualnej zmianie</h3>
                  {currentShiftTasks.length > 0 ? (
                    <div className="space-y-3">
                      {currentShiftTasks.slice(0, 3).map((task) => (
                        <div key={task._id} className="flex items-center gap-3 p-4 bg-blue-50 rounded-2xl border border-blue-200">
                          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                            📋
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold text-slate-800">{task.title}</div>
                            <div className="text-sm text-slate-600">{task.location} • {task.category}</div>
                          </div>
                          <div className={`px-3 py-1 rounded-xl text-sm font-semibold ${
                            task.status === 'in_progress' 
                              ? 'bg-amber-100 text-amber-800' 
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {task.status === 'in_progress' ? 'W trakcie' : 'Przypisane'}
                          </div>
                        </div>
                      ))}
                      {currentShiftTasks.length > 3 && (
                        <div className="text-center text-sm text-slate-500">
                          ... i {currentShiftTasks.length - 3} więcej zadań
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-slate-500">
                      <span className="text-3xl mb-2 block">📋</span>
                      Brak zadań na aktualnej zmianie
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Next Shift Preview */}
        <div className="bg-white/90 backdrop-blur-xl border border-white/30 rounded-3xl shadow-2xl overflow-hidden">
          <div className={`bg-gradient-to-r ${!isDay ? 'from-yellow-400 to-orange-500' : 'from-blue-500 to-indigo-600'} px-6 py-4`}>
            <div className="text-white text-center">
              <div className="text-2xl mb-2">{!isDay ? '☀️' : '🌙'}</div>
              <h3 className="text-lg font-bold">{getNextShiftName()}</h3>
              <p className="text-white/80">{getNextShiftTime()}</p>
            </div>
          </div>

          <div className="p-6">
            <h4 className="font-bold text-slate-800 mb-4">Następna zmiana</h4>
            {nextShiftTechnicians.length > 0 ? (
              <div className="space-y-3">
                {nextShiftTechnicians.map((techName, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                    <div className="w-8 h-8 bg-gradient-to-br from-slate-400 to-slate-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {techName.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="font-medium text-slate-800 text-sm">{techName}</div>
                      <div className="text-xs text-slate-500">Oczekuje</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-slate-500">
                <span className="text-2xl mb-2 block">⏰</span>
                <div className="text-sm">Brak techników na następnej zmianie</div>
              </div>
            )}

            {/* Shift transition info */}
            <div className="mt-6 pt-4 border-t border-slate-200">
              <div className="text-sm text-slate-600 text-center">
                <div className="font-semibold">Zmiana za:</div>
                <div className="text-lg font-bold text-orange-600">
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

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl shadow-xl p-8 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-white text-2xl">👷</span>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600">{dashboardStats.activeTechnicians}</div>
              <div className="text-slate-600 font-medium">Technicy aktywni</div>
            </div>
          </div>
          <div className="text-sm text-slate-500">Na dzisiejszej zmianie</div>
        </div>

        <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl shadow-xl p-8 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-white text-2xl">📋</span>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600">{dashboardStats.currentTasks}</div>
              <div className="text-slate-600 font-medium">Zadania w toku</div>
            </div>
          </div>
          <div className="text-sm text-slate-500">Przypisane i w realizacji</div>
        </div>

        <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl shadow-xl p-8 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-white text-2xl">🔄</span>
            </div>
            <div>
              <div className="text-3xl font-bold text-amber-600">{dashboardStats.poolTasks}</div>
              <div className="text-slate-600 font-medium">Pula zadań</div>
            </div>
          </div>
          <div className="text-sm text-slate-500">Oczekujące na przypisanie</div>
        </div>

        <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl shadow-xl p-8 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-white text-2xl">✅</span>
            </div>
            <div>
              <div className="text-3xl font-bold text-emerald-600">{dashboardStats.completedToday}</div>
              <div className="text-slate-600 font-medium">Wykonane dziś</div>
            </div>
          </div>
          <div className="text-sm text-slate-500">Zakończone zadania</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl shadow-xl p-8">
        <h3 className="text-xl font-bold text-slate-800 mb-6">Szybkie akcje</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 rounded-2xl border border-blue-200 transition-all duration-200 text-left group">
            <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-200">📋</div>
            <div className="font-semibold text-blue-800">Nowe zadanie</div>
            <div className="text-sm text-blue-600">Utwórz zadanie dla technika</div>
          </button>
          
          <button className="p-6 bg-gradient-to-br from-emerald-50 to-teal-50 hover:from-emerald-100 hover:to-teal-100 rounded-2xl border border-emerald-200 transition-all duration-200 text-left group">
            <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-200">👷</div>
            <div className="font-semibold text-emerald-800">Zespół</div>
            <div className="text-sm text-emerald-600">Zarządzaj technikami</div>
          </button>
          
          <button className="p-6 bg-gradient-to-br from-purple-50 to-violet-50 hover:from-purple-100 hover:to-violet-100 rounded-2xl border border-purple-200 transition-all duration-200 text-left group">
            <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-200">📊</div>
            <div className="font-semibold text-purple-800">Raporty</div>
            <div className="text-sm text-purple-600">Analiza wydajności</div>
          </button>
          
          <button className="p-6 bg-gradient-to-br from-orange-50 to-red-50 hover:from-orange-100 hover:to-red-100 rounded-2xl border border-orange-200 transition-all duration-200 text-left group">
            <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-200">📦</div>
            <div className="font-semibold text-orange-800">Magazyn</div>
            <div className="text-sm text-orange-600">Stan magazynowy</div>
          </button>
        </div>
      </div>
    </div>
  );
}