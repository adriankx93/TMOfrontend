
import { useState, useEffect } from 'react';
import { useSheetsData } from '../hooks/useSheetsData';

export default function ShiftChart() {
  const { data, loading, error, refetch } = useSheetsData();
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const months = [
    'Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec',
    'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'
  ];

  const getMonthShifts = () => {
    return data.shifts.filter(shift => {
      const shiftDate = new Date(shift.date);
      return shiftDate.getMonth() === selectedMonth && shiftDate.getFullYear() === selectedYear;
    });
  };

  const getShiftStats = () => {
    const monthShifts = getMonthShifts();
    const totalDays = monthShifts.length;
    const totalDayTasks = monthShifts.reduce((sum, shift) => sum + shift.dayTasks, 0);
    const totalNightTasks = monthShifts.reduce((sum, shift) => sum + shift.nightTasks, 0);
    
    const dayTechnicians = new Set();
    const nightTechnicians = new Set();
    
    monthShifts.forEach(shift => {
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
      avgNightTasks: totalDays > 0 ? (totalNightTasks / totalDays).toFixed(1) : 0
    };
  };

  const getTechnicianWorkDays = () => {
    const monthShifts = getMonthShifts();
    const technicianStats = {};

    monthShifts.forEach(shift => {
      [...shift.dayTechnicians, ...shift.nightTechnicians].forEach(tech => {
        if (!technicianStats[tech]) {
          technicianStats[tech] = { dayShifts: 0, nightShifts: 0 };
        }
        
        if (shift.dayTechnicians.includes(tech)) {
          technicianStats[tech].dayShifts++;
        }
        if (shift.nightTechnicians.includes(tech)) {
          technicianStats[tech].nightShifts++;
        }
      });
    });

    return Object.entries(technicianStats)
      .map(([name, stats]) => ({
        name,
        totalShifts: stats.dayShifts + stats.nightShifts,
        dayShifts: stats.dayShifts,
        nightShifts: stats.nightShifts
      }))
      .sort((a, b) => b.totalShifts - a.totalShifts);
  };

  const getSpecializationFromTechnicians = (techName) => {
    const tech = data.technicians.find(t => 
      `${t.firstName} ${t.lastName}` === techName ||
      t.firstName === techName ||
      t.lastName === techName
    );
    return tech ? tech.specialization : 'Nieznana';
  };

  const getSpecializationIcon = (specialization) => {
    switch(specialization) {
      case 'Elektryka': return '⚡';
      case 'HVAC': return '🌡️';
      case 'Mechanika': return '🔧';
      case 'Elektronika': return '💻';
      case 'Sprzątanie': return '🧹';
      case 'Bezpieczeństwo': return '🛡️';
      default: return '🛠️';
    }
  };

  const stats = getShiftStats();
  const technicianWorkDays = getTechnicianWorkDays();

  if (loading) {
    return (
      <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl shadow-xl p-8">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl shadow-xl p-8">
        <div className="text-center py-12">
          <div className="text-red-500 text-lg font-semibold mb-4">
            Błąd wczytywania danych z arkusza
          </div>
          <p className="text-slate-600 mb-4">{error}</p>
          <button 
            onClick={refetch}
            className="px-4 py-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors"
          >
            Spróbuj ponownie
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header with month selector */}
      <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl shadow-xl p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-white text-xl">📊</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                Grafik zmian z arkusza
              </h2>
              <p className="text-slate-500 font-medium">
                Dane pobrane z Google Sheets
              </p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              className="px-4 py-2 border border-slate-300 rounded-xl bg-white"
            >
              {months.map((month, index) => (
                <option key={index} value={index}>{month}</option>
              ))}
            </select>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="px-4 py-2 border border-slate-300 rounded-xl bg-white"
            >
              <option value={2024}>2024</option>
              <option value={2025}>2025</option>
            </select>
            <button 
              onClick={refetch}
              className="px-4 py-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors"
            >
              Odśwież dane
            </button>
          </div>
        </div>

        {/* Monthly Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200">
            <div className="text-3xl font-bold text-blue-600">{stats.totalDays}</div>
            <div className="text-sm text-blue-600 font-medium">Dni w miesiącu</div>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl border border-yellow-200">
            <div className="text-3xl font-bold text-orange-600">{stats.totalDayTasks}</div>
            <div className="text-sm text-orange-600 font-medium">Zadania dzienne</div>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border border-indigo-200">
            <div className="text-3xl font-bold text-indigo-600">{stats.totalNightTasks}</div>
            <div className="text-sm text-indigo-600 font-medium">Zadania nocne</div>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200">
            <div className="text-3xl font-bold text-emerald-600">{stats.uniqueDayTechnicians + stats.uniqueNightTechnicians}</div>
            <div className="text-sm text-emerald-600 font-medium">Aktywni technicy</div>
          </div>
        </div>
      </div>

      {/* Technicians workload chart */}
      <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl shadow-xl p-8">
        <h3 className="text-xl font-bold text-slate-800 mb-6">Obciążenie techników w miesiącu</h3>
        
        {technicianWorkDays.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            Brak danych dla wybranego miesiąca
          </div>
        ) : (
          <div className="space-y-4">
            {technicianWorkDays.map((tech, index) => {
              const specialization = getSpecializationFromTechnicians(tech.name);
              const maxShifts = Math.max(...technicianWorkDays.map(t => t.totalShifts));
              const percentage = (tech.totalShifts / maxShifts) * 100;
              
              return (
                <div key={index} className="p-4 bg-slate-50 rounded-2xl">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-white font-bold">
                        {tech.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-800">{tech.name}</div>
                        <div className="text-sm text-slate-600 flex items-center gap-1">
                          <span>{getSpecializationIcon(specialization)}</span>
                          <span>{specialization}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-slate-800">{tech.totalShifts}</div>
                      <div className="text-sm text-slate-600">zmian</div>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <div className="flex justify-between text-sm text-slate-600 mb-1">
                      <span>Dzienne: {tech.dayShifts}</span>
                      <span>Nocne: {tech.nightShifts}</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-emerald-500 to-teal-500 h-3 rounded-full transition-all duration-300"
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

      {/* Daily breakdown */}
      <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl shadow-xl p-8">
        <h3 className="text-xl font-bold text-slate-800 mb-6">Szczegółowy rozkład zmian</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 font-semibold text-slate-700">Data</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-700">Zmiana dzienna</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-700">Zmiana nocna</th>
                <th className="text-center py-3 px-4 font-semibold text-slate-700">Zadania dzień</th>
                <th className="text-center py-3 px-4 font-semibold text-slate-700">Zadania noc</th>
              </tr>
            </thead>
            <tbody>
              {getMonthShifts().map((shift, index) => (
                <tr key={index} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-3 px-4 font-medium text-slate-800">
                    {new Date(shift.date).toLocaleDateString('pl-PL')}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex flex-wrap gap-1">
                      {shift.dayTechnicians.map((tech, idx) => (
                        <span key={idx} className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-lg text-sm">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex flex-wrap gap-1">
                      {shift.nightTechnicians.map((tech, idx) => (
                        <span key={idx} className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded-lg text-sm">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full font-semibold">
                      {shift.dayTasks}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full font-semibold">
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
