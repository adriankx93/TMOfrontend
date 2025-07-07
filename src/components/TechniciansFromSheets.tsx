import React, { useState, useEffect } from "react";
import { sheetsService } from "../services/sheetsService";
import { Technician } from "../types/sheets";

interface TechnicianWithStatus extends Technician {
  assignedTasks: number;
  isOnShift: boolean;
}

export default function TechniciansFromSheets() {
  const [technicians, setTechnicians] = useState<TechnicianWithStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTech, setSelectedTech] = useState<TechnicianWithStatus | null>(null);
  const [filterSpecialization, setFilterSpecialization] = useState<string>("all");

  useEffect(() => {
    fetchTechniciansData();
    const interval = setInterval(fetchTechniciansData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchTechniciansData = async () => {
    try {
      setLoading(true);
      const data = await sheetsService.getCurrentMonthData();
      
      const today = new Date();
      const todayShift = data.shifts.find(shift => {
        const shiftDate = new Date(shift.date);
        return shiftDate.toDateString() === today.toDateString();
      });

      const enhancedTechnicians: TechnicianWithStatus[] = data.technicians.map(tech => {
        let isOnShift = false;

        if (todayShift) {
          isOnShift = (todayShift.dayTechnicians || []).includes(tech.fullName) ||
                     (todayShift.nightTechnicians || []).includes(tech.fullName) ||
                     (todayShift.firstShiftTechnicians || []).includes(tech.fullName);
        }

        // Symuluj liczbę przypisanych zadań (2-8 zadań)
        const assignedTasks = Math.floor(Math.random() * 7) + 2;
        
        return {
          ...tech,
          assignedTasks,
          isOnShift
        };
      });

      setTechnicians(enhancedTechnicians);
    } catch (err) {
      console.error('Error fetching technicians data:', err);
      setError(err instanceof Error ? err.message : "Błąd pobierania danych");
    } finally {
      setLoading(false);
    }
  };

  const getSpecializationIcon = (specialization: string) => {
    switch(specialization.toLowerCase()) {
      case 'elektryka': return '⚡';
      case 'hvac': return '🌡️';
      case 'mechanika': return '🔧';
      case 'elektronika': return '💻';
      case 'sprzątanie': return '🧹';
      case 'bezpieczeństwo': return '🛡️';
      default: return '🛠️';
    }
  };

  const getStatusColor = (tech: TechnicianWithStatus) => {
    if (tech.isOnShift) return "bg-emerald-100 text-emerald-800 border-emerald-200";
    return "bg-slate-100 text-slate-800 border-slate-200";
  };

  const specializations = [...new Set(technicians.map(t => t.specialization))];
  const filteredTechnicians = filterSpecialization === "all" 
    ? technicians 
    : technicians.filter(t => t.specialization === filterSpecialization);

  const workingTechnicians = technicians.filter(t => t.isOnShift);

  if (loading) {
    return (
      <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl shadow-xl p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-slate-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 bg-slate-200 rounded-2xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl shadow-xl p-8">
        <div className="text-center text-red-600">
          <div className="text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-bold mb-2">Błąd wczytywania danych</h3>
          <p>{error}</p>
          <button 
            onClick={fetchTechniciansData}
            className="mt-4 px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
          >
            Spróbuj ponownie
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header with stats */}
      <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl shadow-xl p-8 text-white">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Zespół techników</h1>
            <p className="text-emerald-100 text-lg">Dane z arkusza Google Sheets</p>
          </div>
          <button
            onClick={fetchTechniciansData}
            className="px-6 py-3 bg-white/20 backdrop-blur-xl rounded-xl border border-white/20 hover:bg-white/30 transition-all duration-200"
          >
            🔄 Odśwież
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold">{technicians.length}</div>
            <div className="text-emerald-100">Wszyscy technicy</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-300">{workingTechnicians.length}</div>
            <div className="text-emerald-100">Pracuje dziś</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-300">
              {technicians.filter(t => t.currentShift.includes("Urlop")).length}
            </div>
            <div className="text-emerald-100">Na urlopie</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">
              {technicians.reduce((acc, t) => acc + t.assignedTasks, 0)}
            </div>
            <div className="text-emerald-100">Łącznie zadań</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl shadow-xl p-6">
        <div className="flex items-center gap-4">
          <span className="font-semibold text-slate-700">Filtruj po specjalizacji:</span>
          <select
            value={filterSpecialization}
            onChange={(e) => setFilterSpecialization(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-xl bg-white"
          >
            <option value="all">Wszystkie</option>
            {specializations.map(spec => (
              <option key={spec} value={spec}>{spec}</option>
            ))}
          </select>
          <div className="ml-auto text-sm text-slate-600">
            Wyświetlono {filteredTechnicians.length} z {technicians.length} techników
          </div>
        </div>
      </div>

      {/* Technicians Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTechnicians.map((tech) => (
          <div 
            key={tech.id} 
            className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl shadow-xl p-6 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 cursor-pointer"
            onClick={() => setSelectedTech(tech)}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                {tech.firstName[0]}{tech.lastName[0]}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-slate-800">{tech.fullName}</h3>
                <div className="flex items-center gap-2 text-slate-600">
                  <span>{getSpecializationIcon(tech.specialization)}</span>
                  <span>{tech.specialization}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className={`px-3 py-2 rounded-xl text-sm font-semibold border text-center ${getStatusColor(tech)}`}>
                {tech.isOnShift ? 'Na zmianie' : 'Poza zmianą'}
              </div>

              <div className="text-center">
                <div className="text-slate-500 text-sm">Przypisane zadania</div>
                <div className="text-3xl font-bold text-blue-400">{tech.assignedTasks}</div>
              </div>

              <div className="flex justify-center items-center pt-2 border-t border-slate-200">
                {tech.isOnShift && (
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Detailed Modal */}
      {selectedTech && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                    {selectedTech.firstName[0]}{selectedTech.lastName[0]}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-800">{selectedTech.fullName}</h2>
                    <p className="text-slate-600 flex items-center gap-2">
                      <span>{getSpecializationIcon(selectedTech.specialization)}</span>
                      {selectedTech.specialization}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedTech(null)}
                  className="p-2 hover:bg-slate-100 rounded-xl transition-all duration-200"
                >
                  <span className="text-2xl text-slate-400">×</span>
                </button>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div className="bg-slate-50 rounded-2xl p-6 text-center">
                  <h3 className="font-bold text-slate-800 mb-4">Status na zmianie</h3>
                  <div className={`px-4 py-3 rounded-xl text-lg font-semibold border ${getStatusColor(selectedTech)} mb-4`}>
                    {selectedTech.isOnShift ? 'Na zmianie' : 'Poza zmianą'}
                  </div>
                  
                  <div className="mt-6">
                    <h4 className="font-bold text-slate-800 mb-3">Przypisane zadania</h4>
                    <div className="text-4xl font-bold text-blue-600 mb-2">{selectedTech.assignedTasks}</div>
                    <div className="text-sm text-slate-600">Aktualnie przypisanych</div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-200">
                <button
                  onClick={() => setSelectedTech(null)}
                  className="w-full py-3 bg-slate-100 text-slate-700 rounded-2xl font-semibold hover:bg-slate-200 transition-all duration-200"
                >
                  Zamknij
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}