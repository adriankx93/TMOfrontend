
import { useState, useEffect } from 'react';
import { sheetsService } from '../services/sheetsService';

export default function CurrentMonthChart() {
  const [data, setData] = useState({
    technicians: [],
    shifts: [],
    month: new Date().getMonth(),
    year: new Date().getFullYear()
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const months = [
    'Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec',
    'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'
  ];

  useEffect(() => {
    fetchCurrentMonthData();
  }, []);

  const fetchCurrentMonthData = async () => {
    try {
      setLoading(true);
      const monthData = await sheetsService.getCurrentMonthShifts();
      setData(monthData);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getMonthStats = () => {
    const totalDays = data.shifts.length;
    const totalDayTasks = data.shifts.reduce((sum, shift) => sum + shift.dayTasks, 0);
    const totalNightTasks = data.shifts.reduce((sum, shift) => sum + shift.nightTasks, 0);
    
    const dayTechnicians = new Set();
    const nightTechnicians = new Set();
    
    data.shifts.forEach(shift => {
      shift.dayTechnicians.forEach(tech => dayTechnicians.add(tech));
      shift.nightTechnicians.forEach(tech => nightTechnicians.add(tech));
    });

    return {
      totalDays,
      totalDayTasks,
      totalNightTasks,
      uniqueDayTechnicians: dayTechnicians.size,
      uniqueNightTechnicians: nightTechnicians.size,
      avgDayTasks: totalDays > 0 ? (totalDayTasks / totalDays).toFixed(1) : 0,
      avgNightTasks: totalDays > 0 ? (totalNightTasks / totalDays).toFixed(1) : 0,
      allTechnicians: new Set([...dayTechnicians, ...nightTechnicians])
    };
  };

  const getTechnicianWorkload = () => {
    const technicianStats = {};

    data.shifts.forEach(shift => {
      [...shift.dayTechnicians, ...shift.nightTechnicians].forEach(tech => {
        if (!technicianStats[tech]) {
          technicianStats[tech] = { dayShifts: 0, nightShifts: 0, totalTasks: 0 };
        }
        
        if (shift.dayTechnicians.includes(tech)) {
          technicianStats[tech].dayShifts++;
          technicianStats[tech].totalTasks += shift.dayTasks;
        }
        if (shift.nightTechnicians.includes(tech)) {
          technicianStats[tech].nightShifts++;
          technicianStats[tech].totalTasks += shift.nightTasks;
        }
      });
    });

    return Object.entries(technicianStats)
      .map(([name, stats]) => ({
        name,
        totalShifts: stats.dayShifts + stats.nightShifts,
        dayShifts: stats.dayShifts,
        nightShifts: stats.nightShifts,
        totalTasks: stats.totalTasks
      }))
      .sort((a, b) => b.totalShifts - a.totalShifts);
  };

  const getSpecializationFromName = (techName) => {
    const tech = data.technicians.find(t => 
      `${t.firstName} ${t.lastName}` === techName ||
      t.firstName === techName ||
      t.lastName === techName ||
      techName.includes(t.firstName) ||
      techName.includes(t.lastName)
    );
    return tech ? tech.specialization : 'Techniczny';
  };

  const getSpecializationIcon = (specialization) => {
    switch(specialization) {
      case 'Elektryka': return '⚡';
      case 'HVAC': return '🌡️';
      case 'Mechanika': return '🔧';
      case 'Elektronika': return '💻';
      case 'Sprzątanie': return '🧹';
      case 'Bezpieczeństwo': return '🛡️';
      case 'Techniczny': return '🛠️';
      default: return '🛠️';
    }
  };

  const stats = getMonthStats();
  const technicianWorkload = getTechnicianWorkload();

  if (loading) {
    return (
      <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl shadow-xl p-8">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <span className="ml-4 text-slate-600">Pobieranie danych z arkusza Google...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl shadow-xl p-8">
        <div className="text-center py-12">
          <div className="text-red-500 text-lg font-semibold mb-4">
            ⚠️ Błąd wczytywania danych
          </div>
          <p className="text-slate-600 mb-4">{error}</p>
          <button 
            onClick={fetchCurrentMonthData}
            className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
          >
            🔄 Spróbuj ponownie
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl shadow-xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-xl">
              <span className="text-3xl">📊</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold">
                Grafik zmian - {months[data.month]} {data.year}
              </h1>
              <p className="text-blue-100 text-lg mt-1">
                Dane pobrane z arkusza Google Sheets
              </p>
            </div>
          </div>
          <button 
            onClick={fetchCurrentMonthData}
            className="px-6 py-3 bg-white/20 backdrop-blur-xl text-white rounded-xl hover:bg-white/30 transition-colors border border-white/20"
          >
            🔄 Odśwież
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-2xl p-6 text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <span className="text-2xl">📅</span>
          </div>
          <div className="text-3xl font-bold text-blue-600 mb-1">{stats.totalDays}</div>
          <div className="text-slate-600 font-medium">Dni w miesiącu</div>
        </div>

        <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-2xl p-6 text-center">
          <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <span className="text-2xl">☀️</span>
          </div>
          <div className="text-3xl font-bold text-orange-600 mb-1">{stats.totalDayTasks}</div>
          <div className="text-slate-600 font-medium">Zadania dzienne</div>
        </div>

        <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-2xl p-6 text-center">
          <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <span className="text-2xl">🌙</span>
          </div>
          <div className="text-3xl font-bold text-indigo-600 mb-1">{stats.totalNightTasks}</div>
          <div className="text-slate-600 font-medium">Zadania nocne</div>
        </div>

        <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-2xl p-6 text-center">
          <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <span className="text-2xl">👥</span>
          </div>
          <div className="text-3xl font-bold text-emerald-600 mb-1">{stats.allTechnicians.size}</div>
          <div className="text-slate-600 font-medium">Aktywni technicy</div>
        </div>
      </div>

      {/* Technicians Workload Chart */}
      <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl shadow-xl p-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center">
            <span className="text-white text-xl">👨‍🔧</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Lista techników i obciążenie</h2>
            <p className="text-slate-600">Szczegółowy podział pracy w miesiącu</p>
          </div>
        </div>
        
        {technicianWorkload.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <span className="text-4xl mb-4 block">📋</span>
            <div className="text-lg">Brak danych dla aktualnego miesiąca</div>
          </div>
        ) : (
          <div className="grid gap-4">
            {technicianWorkload.map((tech, index) => {
              const specialization = getSpecializationFromName(tech.name);
              const maxShifts = Math.max(...technicianWorkload.map(t => t.totalShifts));
              const percentage = maxShifts > 0 ? (tech.totalShifts / maxShifts) * 100 : 0;
              
              return (
                <div key={index} className="p-6 bg-gradient-to-r from-slate-50 to-slate-100 rounded-2xl border border-slate-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                        {tech.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                      </div>
                      <div>
                        <div className="font-bold text-slate-800 text-lg">{tech.name}</div>
                        <div className="text-slate-600 flex items-center gap-2">
                          <span className="text-lg">{getSpecializationIcon(specialization)}</span>
                          <span className="font-medium">{specialization}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-slate-800">{tech.totalShifts}</div>
                      <div className="text-slate-600 font-medium">zmian</div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <div className="flex gap-4">
                        <span className="text-yellow-700 font-medium">
                          ☀️ Dzienne: {tech.dayShifts}
                        </span>
                        <span className="text-indigo-700 font-medium">
                          🌙 Nocne: {tech.nightShifts}
                        </span>
                        <span className="text-emerald-700 font-medium">
                          📋 Zadania: {tech.totalTasks}
                        </span>
                      </div>
                      <span className="text-slate-600 font-medium">{percentage.toFixed(0)}%</span>
                    </div>
                    
                    <div className="w-full bg-slate-200 rounded-full h-4 shadow-inner">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-600 h-4 rounded-full transition-all duration-500 shadow-sm"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Daily Schedule Table */}
      <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl shadow-xl p-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center">
            <span className="text-white text-xl">📋</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Szczegółowy harmonogram</h2>
            <p className="text-slate-600">Dzienny rozkład zmian i zadań</p>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-slate-200">
                <th className="text-left py-4 px-4 font-bold text-slate-700">Data</th>
                <th className="text-left py-4 px-4 font-bold text-slate-700">Zmiana dzienna</th>
                <th className="text-left py-4 px-4 font-bold text-slate-700">Zmiana nocna</th>
                <th className="text-center py-4 px-4 font-bold text-slate-700">Zadania dzień</th>
                <th className="text-center py-4 px-4 font-bold text-slate-700">Zadania noc</th>
              </tr>
            </thead>
            <tbody>
              {data.shifts.map((shift, index) => (
                <tr key={index} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-4 font-semibold text-slate-800">
                    {new Date(shift.date).toLocaleDateString('pl-PL', {
                      weekday: 'short',
                      day: '2-digit',
                      month: '2-digit'
                    })}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex flex-wrap gap-1">
                      {shift.dayTechnicians.map((tech, idx) => (
                        <span key={idx} className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium border border-yellow-200">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex flex-wrap gap-1">
                      {shift.nightTechnicians.map((tech, idx) => (
                        <span key={idx} className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium border border-indigo-200">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className="px-4 py-2 bg-orange-100 text-orange-800 rounded-full font-bold text-lg border border-orange-200">
                      {shift.dayTasks}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full font-bold text-lg border border-blue-200">
                      {shift.nightTasks}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
