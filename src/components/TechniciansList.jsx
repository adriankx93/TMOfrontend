import { useState } from "react";
import { useTechnicians } from "../hooks/useTechnicians";
import { useTasks } from "../hooks/useTasks";
import CreateTechnicianModal from "./CreateTechnicianModal";
import TechnicianDetailsModal from "./TechnicianDetailsModal";

export default function TechniciansList() {
  const { technicians, updateStatus, deleteTechnician } = useTechnicians();
  const { tasks } = useTasks();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTechnician, setSelectedTechnician] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'break': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'inactive': return 'bg-slate-100 text-slate-800 border-slate-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getStatusLabel = (status) => {
    switch(status) {
      case 'active': return 'Aktywny';
      case 'break': return 'Przerwa';
      case 'inactive': return 'Nieaktywny';
      default: return 'Nieznany';
    }
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

  const getTechnicianTasks = (technicianId) => {
    return tasks.filter(task => 
      task.assignedTo === technicianId && 
      ['assigned', 'in_progress'].includes(task.status)
    );
  };

  const getTechnicianCompletedToday = (technicianId) => {
    const today = new Date().toDateString();
    return tasks.filter(task => 
      task.assignedTo === technicianId && 
      task.status === 'completed' &&
      task.completedAt &&
      new Date(task.completedAt).toDateString() === today
    ).length;
  };

  const handleStatusChange = async (technicianId, newStatus) => {
    setLoading(true);
    try {
      await updateStatus(technicianId, newStatus);
    } catch (error) {
      console.error('Error updating technician status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTechnician = async (technicianId) => {
    if (window.confirm("Czy na pewno chcesz usunąć tego technika? Ta operacja jest nieodwracalna.")) {
      setLoading(true);
      try {
        await deleteTechnician(technicianId);
      } catch (error) {
        console.error('Error deleting technician:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const openDetailsModal = (technician) => {
    setSelectedTechnician(technician);
    setShowDetailsModal(true);
  };

  return (
    <>
      <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-slate-50 to-orange-50 px-8 py-6 border-b border-slate-200/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white text-xl">👷</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  Lista techników
                </h2>
                <p className="text-slate-500 font-medium">
                  Zarządzaj zespołem techników Miasteczka Orange
                </p>
              </div>
            </div>
            
            <button 
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
            >
              + Dodaj technika
            </button>
          </div>
        </div>

        <div className="p-8">
          {technicians.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">👷</div>
              <h3 className="text-xl font-semibold text-slate-600 mb-2">Brak techników</h3>
              <p className="text-slate-500">Dodaj pierwszego technika do systemu.</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {technicians.map((tech) => {
                const currentTasks = getTechnicianTasks(tech._id);
                const completedToday = getTechnicianCompletedToday(tech._id);
                
                return (
                  <div key={tech._id} className="p-6 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-all duration-200 border border-slate-200/50">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                          {tech.firstName[0]}{tech.lastName[0]}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-slate-800">{tech.firstName} {tech.lastName}</h3>
                          <div className="flex items-center gap-4 text-sm text-slate-600 mt-1">
                            <div className="flex items-center gap-2">
                              <span>{getSpecializationIcon(tech.specialization)}</span>
                              <span>{tech.specialization}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span>🕐</span>
                              <span>Zmiana {tech.shift}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span>📧</span>
                              <span>{tech.email}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span>📞</span>
                              <span>{tech.phone}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <select
                          value={tech.status}
                          onChange={(e) => handleStatusChange(tech._id, e.target.value)}
                          className={`px-4 py-2 rounded-xl text-sm font-semibold border ${getStatusColor(tech.status)} bg-transparent`}
                          disabled={loading}
                        >
                          <option value="active">Aktywny</option>
                          <option value="break">Przerwa</option>
                          <option value="inactive">Nieaktywny</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-4">
                      <div className="text-center p-4 bg-white rounded-xl border border-slate-200">
                        <div className="text-2xl font-bold text-orange-600">{currentTasks.length}</div>
                        <div className="text-sm text-slate-600">Bieżące zadania</div>
                      </div>
                      <div className="text-center p-4 bg-white rounded-xl border border-slate-200">
                        <div className="text-2xl font-bold text-emerald-600">{completedToday}</div>
                        <div className="text-sm text-slate-600">Wykonane dziś</div>
                      </div>
                      <div className="text-center p-4 bg-white rounded-xl border border-slate-200">
                        <div className="text-lg font-bold text-blue-600">{tech.currentLocation || 'Nieznana'}</div>
                        <div className="text-sm text-slate-600">Lokalizacja</div>
                      </div>
                      <div className="text-center p-4 bg-white rounded-xl border border-slate-200">
                        <div className="text-sm font-bold text-slate-600">
                          {tech.lastActivity 
                            ? new Date(tech.lastActivity).toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })
                            : 'Brak danych'
                          }
                        </div>
                        <div className="text-sm text-slate-600">Ostatnia aktywność</div>
                      </div>
                    </div>

                    {/* Current Tasks Preview */}
                    {currentTasks.length > 0 && (
                      <div className="mb-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
                        <div className="text-sm font-semibold text-blue-800 mb-2">Bieżące zadania:</div>
                        <div className="space-y-1">
                          {currentTasks.slice(0, 2).map(task => (
                            <div key={task._id} className="text-sm text-blue-700">
                              • {task.title} ({task.location})
                            </div>
                          ))}
                          {currentTasks.length > 2 && (
                            <div className="text-sm text-blue-600">
                              ... i {currentTasks.length - 2} więcej
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2 pt-4 border-t border-slate-200">
                      <button 
                        onClick={() => openDetailsModal(tech)}
                        className="px-4 py-2 bg-blue-100 text-blue-800 rounded-xl hover:bg-blue-200 transition-all duration-200 font-medium"
                      >
                        Zobacz szczegóły
                      </button>
                      
                      <button className="px-4 py-2 bg-orange-100 text-orange-800 rounded-xl hover:bg-orange-200 transition-all duration-200 font-medium">
                        Przypisz zadanie
                      </button>
                      
                      <button className="px-4 py-2 bg-slate-100 text-slate-800 rounded-xl hover:bg-slate-200 transition-all duration-200 font-medium">
                        Edytuj profil
                      </button>
                      
                      <button className="px-4 py-2 bg-emerald-100 text-emerald-800 rounded-xl hover:bg-emerald-200 transition-all duration-200 font-medium">
                        Kontakt
                      </button>
                      
                      <button 
                        onClick={() => handleDeleteTechnician(tech._id)}
                        className="px-4 py-2 bg-red-100 text-red-800 rounded-xl hover:bg-red-200 transition-all duration-200 font-medium"
                        disabled={loading}
                      >
                        Usuń
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {showCreateModal && (
        <CreateTechnicianModal 
          onClose={() => setShowCreateModal(false)}
          onTechnicianCreated={() => setShowCreateModal(false)}
        />
      )}

      {showDetailsModal && selectedTechnician && (
        <TechnicianDetailsModal 
          technician={selectedTechnician}
          onClose={() => setShowDetailsModal(false)}
        />
      )}
    </>
  );
}