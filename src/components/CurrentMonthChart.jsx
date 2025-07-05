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
    
    // Automatyczne odświeżanie co 5 minut
    const interval = setInterval(fetchCurrentMonthData, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchCurrentMonthData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Rozpoczynam pobieranie danych aktualnego miesiąca...');
      
      const monthData = await sheetsService.getCurrentMonthShifts();
      
      console.log('Otrzymane dane miesiąca:', monthData);
      
      setData(monthData);
    } catch (err) {
      console.error('Błąd podczas pobierania danych:', err);
      setError(err.message || 'Błąd podczas pobierania danych z arkusza');
    } finally {
      setLoading(false);
    }
  };

  const getMonthStats = () => {
    if (!data.shifts || data.shifts.length === 0) {
      return {
        totalDays: 0,
        totalDayTasks: 0,
        totalNightTasks: 0,
        totalWorkingDays: 0,
        avgWorkersPerDay: 0,
        allTechnicians: new Set()
      };
    }

    const totalDays = data.shifts.length;
    const totalDayTasks = data.shifts.reduce((sum, shift) => sum + (shift.dayTasks || 0), 0);
    const totalNightTasks = data.shifts.reduce((sum, shift) => sum + (shift.nightTasks || 0), 0);
    const totalWorkingDays = data.shifts.filter(shift => shift.totalWorking > 0).length;
    
    const allTechnicians = new Set();
    let totalWorkers = 0;
    
    data.shifts.forEach(shift => {
      if (shift.dayTechnicians && Array.isArray(shift.dayTechnicians)) {
        shift.dayTechnicians.forEach(tech => allTechnicians.add(tech));
        totalWorkers += shift.dayTechnicians.length;
      }
      if (shift.nightTechnicians && Array.isArray(shift.nightTechnicians)) {
        shift.nightTechnicians.forEach(tech => allTechnicians.add(tech));
        totalWorkers += shift.nightTechnicians.length;
      }
    });

    return {
      totalDays,
      totalDayTasks,
      totalNightTasks,
      totalWorkingDays,
      avgWorkersPerDay: totalDays > 0 ? (totalWorkers / totalDays).toFixed(1) : 0,
      allTechnicians
    };
  };

  const getTechnicianWorkload = () => {
    if (!data.shifts || data.shifts.length === 0) {
      return [];
    }

    const technicianStats = {};

    data.shifts.forEach(shift => {
      // Zlicz zmiany dzienne (włączając pierwszą zmianę)
      if (shift.dayTechnicians && Array.isArray(shift.dayTechnicians)) {
        shift.dayTechnicians.forEach(tech => {
          if (!technicianStats[tech]) {
            technicianStats[tech] = { 
              dayShifts: 0, 
              nightShifts: 0, 
              firstShifts: 0,
              vacationDays: 0,
              l4Days: 0,
              totalTasks: 0 
            };
          }
          technicianStats[tech].dayShifts++;
          technicianStats[tech].totalTasks += shift.dayTasks || 0;
        });
      }
      
      // Zlicz zmiany nocne
      if (shift.nightTechnicians && Array.isArray(shift.nightTechnicians)) {
        shift.nightTechnicians.forEach(tech => {
          if (!technicianStats[tech]) {
            technicianStats[tech] = { 
              dayShifts: 0, 
              nightShifts: 0, 
              firstShifts: 0,
              vacationDays: 0,
              l4Days: 0,
              totalTasks: 0 
            };
          }
          technicianStats[tech].nightShifts++;
          technicianStats[tech].totalTasks += shift.nightTasks || 0;
        });
      }

      // Zlicz pierwszą zmianę osobno
      if (shift.firstShiftTechnicians && Array.isArray(shift.firstShiftTechnicians)) {
        shift.firstShiftTechnicians.forEach(tech => {
          if (technicianStats[tech]) {
            technicianStats[tech].firstShifts++;
          }
        });
      }

      // Zlicz urlopy
      if (shift.vacationTechnicians && Array.isArray(shift.vacationTechnicians)) {
        shift.vacationTechnicians.forEach(tech => {
          if (!technicianStats[tech]) {
            technicianStats[tech] = { 
              dayShifts: 0, 
              nightShifts: 0, 
              firstShifts: 0,
              vacationDays: 0,
              l4Days: 0,
              totalTasks: 0 
            };
          }
          technicianStats[tech].vacationDays++;
        });
      }

      // Zlicz L4
      if (shift.l4Technicians && Array.isArray(shift.l4Technicians)) {
        shift.l4Technicians.forEach(tech => {
          if (!technicianStats[tech]) {
            technicianStats[tech] = { 
              dayShifts: 0, 
              nightShifts: 0, 
              firstShifts: 0,
              vacationDays: 0,
              l4Days: 0,
              totalTasks: 0 
            };
          }
          technicianStats[tech].l4Days++;
        });
      }
    });

    return Object.entries(technicianStats)
      .map(([name, stats]) => ({
        name,
        totalShifts: stats.dayShifts + stats.nightShifts,
        dayShifts: stats.dayShifts,
        nightShifts: stats.nightShifts,
        firstShifts: stats.firstShifts,
        vacationDays: stats.vacationDays,
        l4Days: stats.l4Days,
        totalTasks: stats.totalTasks,
        workingDays: stats.dayShifts + stats.nightShifts,
        totalDays: stats.dayShifts + stats.nightShifts + stats.vacationDays + stats.l4Days
      }))
      .sort((a, b) => b.totalShifts - a.totalShifts);
  };

  const getSpecializationFromName = (techName) => {
    if (!data.technicians || !Array.isArray(data.technicians)) {
      return 'Techniczny';
    }
    
    const tech = data.technicians.find(t => 
      t.fullName === techName ||
      `${t.firstName} ${t.lastName}` === techName ||
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

  const getShiftTypeLabel = (shift) => {
    const types = [];
    if (shift.firstShiftTechnicians && shift.firstShiftTechnicians.length > 0) {
      types.push(`Pierwsza (${shift.firstShiftTechnicians.length})`);
    }
    if (shift.dayTechnicians && shift.dayTechnicians.length > 0) {
      types.push(`Dzienna (${shift.dayTechnicians.length})`);
    }
    if (shift.nightTechnicians && shift.nightTechnicians.length > 0) {
      types.push(`Nocna (${shift.nightTechnicians.length})`);
    }
    return types.join(', ') || 'Brak zmian';
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
          <div className="text-sm text-slate-500 mb-4">
            Sprawdź czy:
            <ul className="list-disc list-inside mt-2">
              <li>Arkusz Google Sheets jest publiczny</li>
              <li>Klucz API jest prawidłowy</li>
              <li>Istnieje arkusz o nazwie aktualnego miesiąca (np. "Styczeń")</li>
              <li>Dane techników są w zakresie C7:E23</li>
              <li>Dni miesiąca są w wierszu J4:AN4</li>
            </ul>
          </div>
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
                Dane z arkusza "{months[data.month + 1]}" • Ostatnia aktualizacja: {new Date().toLocaleTimeString('pl-PL')}
              </p>
            </div>
          </div>
          <button 
            onClick={fetchCurrentMonthData}
            className="px-6 py-3 bg-white/20 backdrop-blur-xl text-white rounded-xl hover:bg-white/30 transition-colors border border-white/20"
            disabled={loading}
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
          <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <span className="text-2xl">👥</span>
          </div>
          <div className="text-3xl font-bold text-emerald-600 mb-1">{stats.allTechnicians.size}</div>
          <div className="text-slate-600 font-medium">Aktywni technicy</div>
        </div>

        <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-2xl p-6 text-center">
          <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <span className="text-2xl">💼</span>
          </div>
          <div className="text-3xl font-bold text-orange-600 mb-1">{stats.totalWorkingDays}</div>
          <div className="text-slate-600 font-medium">Dni robocze</div>
        </div>

        <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-2xl p-6 text-center">
          <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <span className="text-2xl">📊</span>
          </div>
          <div className="text-3xl font-bold text-purple-600 mb-1">{stats.avgWorkersPerDay}</div>
          <div className="text-slate-600 font-medium">Śr. pracowników/dzień</div>
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
            <div className="text-sm mt-2">Sprawdź czy arkusz "{months[data.month + 1]}" zawiera dane techników</div>
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
                      <div className="text-slate-600 font-medium">zmian roboczych</div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                      <div className="text-center p-2 bg-yellow-50 rounded-lg">
                        <div className="font-bold text-yellow-700">☀️ {tech.dayShifts}</div>
                        <div className="text-yellow-600">Dzienne</div>
                      </div>
                      <div className="text-center p-2 bg-indigo-50 rounded-lg">
                        <div className="font-bold text-indigo-700">🌙 {tech.nightShifts}</div>
                        <div className="text-indigo-600">Nocne</div>
                      </div>
                      <div className="text-center p-2 bg-green-50 rounded-lg">
                        <div className="font-bold text-green-700">🏖️ {tech.vacationDays}</div>
                        <div className="text-green-600">Urlopy</div>
                      </div>
                      <div className="text-center p-2 bg-red-50 rounded-lg">
                        <div className="font-bold text-red-700">🏥 {tech.l4Days}</div>
                        <div className="text-red-600">L4</div>
                      </div>
                      <div className="text-center p-2 bg-emerald-50 rounded-lg">
                        <div className="font-bold text-emerald-700">📋 {tech.totalTasks}</div>
                        <div className="text-emerald-600">Zadania</div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-600 font-medium">
                        Efektywność: {tech.totalDays > 0 ? Math.round((tech.workingDays / tech.totalDays) * 100) : 0}%
                      </span>
                      <span className="text-slate-600 font-medium">{percentage.toFixed(0)}% obciążenia</span>
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
            <p className="text-slate-600">Dzienny rozkład zmian i obsady</p>
          </div>
        </div>
        
        {data.shifts.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <span className="text-4xl mb-4 block">📅</span>
            <div className="text-lg">Brak danych zmian dla aktualnego miesiąca</div>
            <div className="text-sm mt-2">Sprawdź czy arkusz "{months[data.month + 1]}" zawiera dane w zakresie J4:AN23</div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-slate-200">
                  <th className="text-left py-4 px-4 font-bold text-slate-700">Data</th>
                  <th className="text-left py-4 px-4 font-bold text-slate-700">Zmiana dzienna</th>
                  <th className="text-left py-4 px-4 font-bold text-slate-700">Zmiana nocna</th>
                  <th className="text-center py-4 px-4 font-bold text-slate-700">Urlopy</th>
                  <th className="text-center py-4 px-4 font-bold text-slate-700">L4</th>
                  <th className="text-center py-4 px-4 font-bold text-slate-700">Łącznie</th>
                </tr>
              </thead>
              <tbody>
                {data.shifts.map((shift, index) => (
                  <tr key={index} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-4 font-semibold text-slate-800">
                      <div>
                        {new Date(shift.date).toLocaleDateString('pl-PL', {
                          weekday: 'short',
                          day: '2-digit',
                          month: '2-digit'
                        })}
                      </div>
                      <div className="text-xs text-slate-500">Dzień {shift.dayNumber}</div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex flex-wrap gap-1">
                        {(shift.dayTechnicians || []).map((tech, idx) => (
                          <span key={idx} className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium border border-yellow-200">
                            {tech}
                          </span>
                        ))}
                        {(!shift.dayTechnicians || shift.dayTechnicians.length === 0) && (
                          <span className="text-slate-400 text-sm">Brak przypisań</span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex flex-wrap gap-1">
                        {(shift.nightTechnicians || []).map((tech, idx) => (
                          <span key={idx} className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium border border-indigo-200">
                            {tech}
                          </span>
                        ))}
                        {(!shift.nightTechnicians || shift.nightTechnicians.length === 0) && (
                          <span className="text-slate-400 text-sm">Brak przypisań</span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="flex flex-wrap gap-1 justify-center">
                        {(shift.vacationTechnicians || []).map((tech, idx) => (
                          <span key={idx} className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                            {tech}
                          </span>
                        ))}
                        {(!shift.vacationTechnicians || shift.vacationTechnicians.length === 0) && (
                          <span className="text-slate-400 text-xs">-</span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="flex flex-wrap gap-1 justify-center">
                        {(shift.l4Technicians || []).map((tech, idx) => (
                          <span key={idx} className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                            {tech}
                          </span>
                        ))}
                        {(!shift.l4Technicians || shift.l4Technicians.length === 0) && (
                          <span className="text-slate-400 text-xs">-</span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full font-bold text-lg border border-blue-200">
                        {shift.totalWorking || 0}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}