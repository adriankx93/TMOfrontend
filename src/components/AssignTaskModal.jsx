import { useState, useEffect } from "react";
import { useTasks } from "../hooks/useTasks";
import { useTechnicians } from "../hooks/useTechnicians";
import { sheetsService } from "../services/sheetsService";
import { Calendar, CheckCircle, Loader2, User, X } from "lucide-react";

// Komponent wyświetlający prawdziwy grafik technika
function TechnicianCalendar({ calendar, month, year }) {
  if (!calendar || !calendar.length) {
    return <div className="text-slate-500">Brak grafiku.</div>;
  }
  const monthNames = [
    'styczeń', 'luty', 'marzec', 'kwiecień', 'maj', 'czerwiec',
    'lipiec', 'sierpień', 'wrzesień', 'październik', 'listopad', 'grudzień'
  ];
  return (
    <div>
      <div className="font-bold mb-2">
        Grafik na {monthNames[month] || ""} {year}
      </div>
      <div className="grid grid-cols-7 gap-2 text-center">
        {['Pn','Wt','Śr','Czw','Pt','Sb','Nd'].map(d => (
          <div key={d} className="text-xs font-bold text-slate-400">{d}</div>
        ))}
        {calendar.map((entry, i) => (
          <div key={entry.date} className={`p-1 rounded-md text-xs
            ${entry.isVacation ? 'bg-green-100 text-green-700' : ''}
            ${entry.isL4 ? 'bg-red-100 text-red-700' : ''}
            ${entry.isDay ? 'bg-yellow-100 text-yellow-800' : ''}
            ${entry.isNight ? 'bg-blue-100 text-blue-800' : ''}
            ${!entry.isDay && !entry.isNight && !entry.isVacation && !entry.isL4 ? 'bg-slate-100 text-slate-500' : ''}
          `}>
            {i+1}
            <div>
              {entry.isDay && '☀️'}
              {entry.isNight && '🌙'}
              {entry.isFirst && '1'}
              {entry.isVacation && '🏖️'}
              {entry.isL4 && '🏥'}
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-3 mt-4 text-xs justify-center">
        <span><span className="inline-block w-3 h-3 rounded bg-yellow-100 align-middle mr-1" /> Dzienna</span>
        <span><span className="inline-block w-3 h-3 rounded bg-blue-100 align-middle mr-1" /> Nocna</span>
        <span><span className="inline-block w-3 h-3 rounded bg-green-100 align-middle mr-1" /> Urlop</span>
        <span><span className="inline-block w-3 h-3 rounded bg-red-100 align-middle mr-1" /> L4</span>
      </div>
    </div>
  );
}

export default function AssignTaskModal({ task, onClose, onAssigned }) {
  const { assignFromPool } = useTasks();
  const { technicians } = useTechnicians();
  const [selectedTechnician, setSelectedTechnician] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarTechnician, setCalendarTechnician] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [assignmentSuccess, setAssignmentSuccess] = useState(false);
  const [assignedTechnicianName, setAssignedTechnicianName] = useState("");

  // Dane o miesiącu i zmianach z Google Sheets
  const [monthData, setMonthData] = useState(null);
  const [shifts, setShifts] = useState([]);

  // Pobierz grafik tylko raz na otwarcie modala (najlepiej zrób cache globalny!)
  useEffect(() => {
    sheetsService.getCurrentMonthData().then(data => {
      setMonthData(data);
      setShifts(data.shifts);
    }).catch(() => {
      setMonthData(null);
      setShifts([]);
    });
  }, []);

  // Technicy dostępni na daną zmianę
  const availableTechnicians = technicians.filter(tech =>
    (!task.shift || tech.shift === task.shift) && tech.status !== 'inactive'
  );

  useEffect(() => {
    if (assignmentSuccess) {
      const timeout = setTimeout(() => {
        onAssigned();
      }, 1200);
      return () => clearTimeout(timeout);
    }
  }, [assignmentSuccess, onAssigned]);

  const handleAssign = async (e) => {
    e.preventDefault();
    if (!selectedTechnician) {
      setError("Wybierz technika");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const technicianToAssign = technicians.find(tech => tech._id === selectedTechnician);
      if (technicianToAssign) {
        setAssignedTechnicianName(`${technicianToAssign.firstName} ${technicianToAssign.lastName}`);
      }
      await assignFromPool(task._id, selectedTechnician);
      setAssignmentSuccess(true);
    } catch (err) {
      setError(err?.response?.data?.message || "Błąd podczas przypisywania zadania");
    } finally {
      setLoading(false);
    }
  };

  // Pokaż kalendarz pracy danego technika (pełny miesiąc, z Google Sheets!)
  const handleShowCalendar = (tech) => {
    setCalendarTechnician(tech);
    setShowCalendar(true);
  };

  // Funkcja: wyciąga cały grafik wybranego technika na miesiąc
  function getTechnicianCalendar(fullName) {
    if (!shifts || !fullName) return [];
    return shifts.map(shift => ({
      date: shift.date,
      isDay: shift.dayTechnicians.includes(fullName),
      isNight: shift.nightTechnicians.includes(fullName),
      isFirst: shift.firstShiftTechnicians.includes(fullName),
      isVacation: shift.vacationTechnicians.includes(fullName),
      isL4: shift.l4Technicians.includes(fullName),
    }));
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="rounded-3xl shadow-2xl max-w-lg w-full relative dark:bg-slate-800 light:bg-white">
        {/* Loading overlay */}
        {loading && (
          <div className="absolute inset-0 z-20 flex items-center justify-center rounded-3xl dark:bg-slate-800/70 light:bg-white/70">
            <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
          </div>
        )}

        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg dark:text-white light:text-white">
                <User className="w-7 h-7 text-white dark:text-white light:text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold dark:text-white light:text-slate-800">Przypisz zadanie</h2>
                <p className="dark:text-slate-400 light:text-slate-600">Wybierz technika dla zadania</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 dark:hover:bg-slate-700 light:hover:bg-slate-100 rounded-xl transition-all duration-200"
              disabled={loading}
            >
              <X className="w-6 h-6 dark:text-slate-400 light:text-slate-500" />
            </button>
          </div>

          {/* Task Info */}
          <div className="mb-6 p-4 rounded-2xl dark:bg-slate-700 light:bg-slate-50">
            <h3 className="font-semibold dark:text-white light:text-slate-800 mb-2">{task.title}</h3>
            <div className="text-sm dark:text-slate-300 light:text-slate-600 space-y-1">
              <div>📍 {task.location}</div>
              <div>🕐 Zmiana {task.shift}</div>
              <div>🏷️ {task.category}</div>
              {task.estimatedDuration && (
                <div>⏱️ {task.estimatedDuration} minut</div>
              )}
            </div>
          </div>

          {/* Success Message */}
          {assignmentSuccess && (
            <div className="mb-6 p-4 rounded-2xl dark:bg-green-900/30 dark:border-green-700 dark:text-green-300 light:bg-green-50 light:border-green-200 light:text-green-800 border">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center dark:bg-green-800 dark:text-green-300 light:bg-green-100 light:text-green-600">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-medium dark:text-green-300 light:text-green-800">Zadanie przypisane!</div>
                  <div className="text-sm dark:text-green-400 light:text-green-600">
                    Przypisano do: <strong>{assignedTechnicianName}</strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 dark:bg-red-900/30 light:bg-red-50 dark:border-red-700 light:border-red-200 rounded-2xl border">
              <div className="dark:text-red-300 light:text-red-800 font-medium">{error}</div>
            </div>
          )}

          <form onSubmit={handleAssign} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold dark:text-slate-300 light:text-slate-700 mb-3">
                Dostępni technicy na zmianę {task.shift}
              </label>
              
              {availableTechnicians.length === 0 ? (
                <div className="p-4 dark:bg-amber-900/30 light:bg-amber-50 dark:border-amber-700 light:border-amber-200 rounded-2xl dark:text-amber-300 light:text-amber-800 border">
                  Brak dostępnych techników na zmianę {task.shift}
                </div>
              ) : (
                <div className="space-y-3">
                  {availableTechnicians.map((tech) => (
                    <label 
                      key={tech._id} 
                      className={`flex items-center p-4 border-2 rounded-2xl cursor-pointer transition-all duration-200 relative ${
                        selectedTechnician === tech._id 
                          ? 'dark:border-green-500 light:border-green-500 dark:bg-green-900/30 light:bg-green-50 dark:ring-green-700 light:ring-green-200 ring-2'
                          : 'dark:border-slate-600 light:border-slate-200 dark:hover:border-slate-500 light:hover:border-slate-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="technician"
                        value={tech._id}
                        checked={selectedTechnician === tech._id}
                        onChange={(e) => setSelectedTechnician(e.target.value)}
                        className="sr-only"
                        disabled={loading}
                      />
                      
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-white font-bold relative">
                          <span>
                            {tech.firstName?.[0]}{tech.lastName?.[0]}
                          </span>
                          <span className="absolute -top-1 -right-2 text-xs">
                            {tech.shift === 'Nocna' ? '🌙' : tech.shift === 'Dzienna' ? '☀️' : ''}
                          </span>
                        </div>
                        <div>
                          <div className="font-semibold dark:text-white light:text-slate-800">
                            {tech.firstName} {tech.lastName}
                          </div>
                          <div className="text-sm dark:text-slate-400 light:text-slate-600 flex flex-col">
                            <span>{tech.specialization} • {tech.shift}</span>
                            <span className="text-xs text-blue-600">{tech.currentTasks || 0} zadań</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button 
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            handleShowCalendar(tech);
                          }}
                          className="p-2 text-blue-600 dark:hover:bg-blue-900/30 light:hover:bg-blue-50 rounded-full transition-all duration-200"
                          title="Zobacz kalendarz zmian"
                        >
                          <Calendar className="w-5 h-5" />
                        </button>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          selectedTechnician === tech._id 
                            ? 'border-green-500 bg-green-500 dark:border-green-400 dark:bg-green-400' 
                            : 'dark:border-slate-500 light:border-slate-300'
                        }`}>
                          {selectedTechnician === tech._id && (
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          )}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-4 pt-6 border-t border-slate-200">
              <button
                type="submit"
                disabled={loading || !selectedTechnician || availableTechnicians.length === 0 || assignmentSuccess}
                className="flex-1 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 dark:text-white light:text-white"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Przypisywanie...</span>
                  </>
                ) : assignmentSuccess ? (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    <span>Przypisano!</span>
                  </>
                ) : (
                  <>
                    <User className="w-5 h-5" />
                    <span>Przypisz zadanie</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={onClose}
                disabled={loading || assignmentSuccess}
                className="px-8 py-4 dark:bg-slate-700 light:bg-slate-100 dark:text-slate-300 light:text-slate-700 rounded-2xl font-semibold dark:hover:bg-slate-600 light:hover:bg-slate-200 transition-all duration-200 disabled:opacity-50"
              >
                Anuluj
              </button>
            </div>
          </form>
        </div>
      </div>
      
      {/* Calendar Modal */}
      {showCalendar && calendarTechnician && monthData && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 dark:bg-black/50 light:bg-black/30">
          <div className="dark:bg-slate-800 light:bg-white rounded-3xl shadow-2xl max-w-2xl w-full">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <Calendar className="w-6 h-6 text-white dark:text-white light:text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold dark:text-white light:text-slate-800">Kalendarz zmian</h2>
                    <p className="dark:text-slate-400 light:text-slate-600">{calendarTechnician.firstName} {calendarTechnician.lastName}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowCalendar(false)}
                  className="p-2 dark:hover:bg-slate-700 light:hover:bg-slate-100 rounded-xl transition-all duration-200"
                >
                  <X className="w-6 h-6 dark:text-slate-400 light:text-slate-500" />
                </button>
              </div>
              <TechnicianCalendar
                calendar={getTechnicianCalendar(calendarTechnician.fullName)}
                month={monthData.month}
                year={monthData.year}
              />
              <div className="mt-6 pt-6 border-t dark:border-slate-700 light:border-slate-200">
                <button
                  onClick={() => setShowCalendar(false)}
                  className="w-full py-3 dark:bg-slate-700 light:bg-slate-100 dark:text-slate-300 light:text-slate-700 rounded-2xl font-semibold dark:hover:bg-slate-600 light:hover:bg-slate-200 transition-all duration-200"
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
