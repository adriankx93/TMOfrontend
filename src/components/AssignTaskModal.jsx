import { useState } from "react";
import { useTasks } from "../hooks/useTasks";
import { useTechnicians } from "../hooks/useTechnicians";
import { Calendar } from "lucide-react";

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

  // Filter technicians by shift and availability
  const availableTechnicians = technicians.filter(tech => 
    tech.shift === task.shift && tech.status !== 'inactive'
  );

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
      
      // Show success message for 1.5 seconds before closing
      setTimeout(() => {
        onAssigned();
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Błąd podczas przypisywania zadania");
    } finally {
      setLoading(false);
    }
  };

  const handleShowCalendar = (tech) => {
    setCalendarTechnician(tech);
    setShowCalendar(true);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full">
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white text-xl">👤</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-800">Przypisz zadanie</h2>
                <p className="text-slate-600">Wybierz technika dla zadania</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-xl transition-all duration-200"
              disabled={loading}
            >
              <span className="text-2xl text-slate-400">×</span>
            </button>
          </div>

          {/* Task Info */}
          <div className="mb-6 p-4 bg-slate-50 rounded-2xl">
            <h3 className="font-semibold text-slate-800 mb-2">{task.title}</h3>
            <div className="text-sm text-slate-600 space-y-1">
              <div>📍 {task.location}</div>
              <div>🕐 Zmiana {task.shift}</div>
              <div>🏷️ {task.category}</div>
              <div>⏱️ {task.estimatedDuration} minut</div>
            </div>
          </div>

          {/* Success Message */}
          {assignmentSuccess && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-2xl">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-green-800 font-medium">Zadanie przypisane!</div>
                  <div className="text-green-600 text-sm">
                    Przypisano do: <strong>{assignedTechnicianName}</strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl">
              <div className="text-red-800 font-medium">{error}</div>
            </div>
          )}

          <form onSubmit={handleAssign} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3">
                Dostępni technicy na zmianę {task.shift}
              </label>
              
              {availableTechnicians.length === 0 ? (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-amber-800">
                  Brak dostępnych techników na zmianę {task.shift}
                </div>
              ) : (
                <div className="space-y-3">
                  {availableTechnicians.map((tech) => (
                    <label 
                      key={tech._id} 
                      className={`flex items-center p-4 border-2 rounded-2xl cursor-pointer transition-all duration-200 ${
                        selectedTechnician === tech._id 
                          ? 'border-green-500 bg-green-50' 
                          : 'border-slate-200 hover:border-slate-300'
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
                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-white font-bold">
                          {tech.firstName[0]}{tech.lastName[0]}
                          {tech.shift === 'Nocna' && <span className="absolute -top-1 -right-1 text-xs">🌙</span>}
                          {tech.shift === 'Dzienna' && <span className="absolute -top-1 -right-1 text-xs">☀️</span>}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-800">
                            {tech.firstName} {tech.lastName}
                          </div>
                          <div className="text-sm text-slate-600 flex flex-col">
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
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-all duration-200"
                          title="Zobacz kalendarz zmian"
                        >
                          <Calendar className="w-5 h-5" />
                        </button>
                        
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        selectedTechnician === tech._id 
                          ? 'border-green-500 bg-green-500' 
                          : 'border-slate-300'
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
                disabled={loading || !selectedTechnician || availableTechnicians.length === 0}
                className="flex-1 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
                disabled={loading}
                className="px-8 py-4 bg-slate-100 text-slate-700 rounded-2xl font-semibold hover:bg-slate-200 transition-all duration-200 disabled:opacity-50"
              >
                Anuluj
              </button>
            </div>
          </form>
        </div>
      </div>
      
      {/* Calendar Modal */}
      {showCalendar && calendarTechnician && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-800">Kalendarz zmian</h2>
                    <p className="text-slate-600">{calendarTechnician.firstName} {calendarTechnician.lastName}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowCalendar(false)}
                  className="p-2 hover:bg-slate-100 rounded-xl transition-all duration-200"
                >
                  <span className="text-2xl text-slate-400">×</span>
                </button>
              </div>
              
              <div className="bg-slate-50 rounded-2xl p-6 mb-6">
                <div className="grid grid-cols-7 gap-2 text-center">
                  {['Pon', 'Wt', 'Śr', 'Czw', 'Pt', 'Sob', 'Nd'].map(day => (
                    <div key={day} className="font-bold text-slate-700">{day}</div>
                  ))}
                  {Array.from({ length: 31 }, (_, i) => i + 1).map(day => {
                    // Symulacja danych z sheetsService - w rzeczywistości pobieralibyśmy dane z API
                    const isDay = Math.random() > 0.5;
                    const isNight = Math.random() > 0.7;
                    const isVacation = !isDay && !isNight && Math.random() > 0.8;
                    const isSickLeave = !isDay && !isNight && !isVacation && Math.random() > 0.9;
                    
                    let bgColor = 'bg-slate-100';
                    if (isDay) bgColor = 'bg-yellow-100';
                    if (isNight) bgColor = 'bg-blue-100';
                    if (isVacation) bgColor = 'bg-green-100';
                    if (isSickLeave) bgColor = 'bg-red-100';
                    
                    return (
                      <div key={day} className={`p-3 rounded-lg ${bgColor} text-center`}>
                        <div className="font-bold text-slate-800">{day}</div>
                        <div className="text-xs">
                          {isDay && <span className="text-yellow-800">☀️</span>}
                          {isNight && <span className="text-blue-800">🌙</span>}
                          {isVacation && <span className="text-green-800">🏖️</span>}
                          {isSickLeave && <span className="text-red-800">🏥</span>}
                          {!isDay && !isNight && !isVacation && !isSickLeave && <span className="text-slate-400">-</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <div className="flex gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-yellow-100 rounded"></div>
                  <span>Dzienna</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-100 rounded"></div>
                  <span>Nocna</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-100 rounded"></div>
                  <span>Urlop</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-100 rounded"></div>
                  <span>L4</span>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-slate-200">
                <button
                  onClick={() => setShowCalendar(false)}
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