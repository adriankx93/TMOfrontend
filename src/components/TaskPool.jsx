import { useTasks } from "../hooks/useTasks";
import { useTechnicians } from "../hooks/useTechnicians";
import { useState } from "react";
import AssignTaskModal from "./AssignTaskModal";
import TaskDetailsModal from "./TaskDetailsModal";

export default function TaskPool() {
  const { tasks, deleteTask, updateTask } = useTasks();
  const { technicians } = useTechnicians();
  const [selectedTask, setSelectedTask] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // Filter tasks in pool
  const poolTasks = tasks.filter(task => task.status === 'pool');

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'Wysoki': return 'bg-red-100 text-red-800 border-red-200';
      case 'Średni': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Niski': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const handleChangePriority = async (taskId, newPriority) => {
    setLoading(true);
    try {
      await updateTask(taskId, { priority: newPriority });
    } catch (error) {
      console.error('Error updating task priority:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm("Czy na pewno chcesz usunąć to zadanie z puli?")) {
      setLoading(true);
      try {
        await deleteTask(taskId);
      } catch (error) {
        console.error('Error deleting task:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const openAssignModal = (task) => {
    setSelectedTask(task);
    setShowAssignModal(true);
  };

  const openDetailsModal = (task) => {
    setSelectedTask(task);
    setShowDetailsModal(true);
  };

  const getTechnicianName = (technicianId) => {
    const technician = technicians.find(t => t._id === technicianId);
    return technician ? `${technician.firstName} ${technician.lastName}` : 'Nieznany';
  };

  return (
    <>
      <div className="glass-card p-2 md:p-8">
        <div className="flex items-center justify-between mb-2 md:mb-6">
          <div className="flex items-center gap-1 md:gap-4">
            <div className="w-6 h-6 md:w-12 md:h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-md md:rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-white text-xs md:text-xl">🔄</span>
            </div>
            <div>
              <h3 className="text-sm md:text-xl font-bold text-white">Pula zadań</h3>
              <p className="text-slate-400 text-xs md:text-base hidden xs:block">Zadania oczekujące na przypisanie</p>
            </div>
          </div>
          
          <div className="text-xs md:text-sm text-slate-300 bg-slate-700/50 px-2 py-1 md:px-4 md:py-2 rounded-md md:rounded-xl">
            {poolTasks.length} zadań w puli
          </div>
        </div>

        <div className="space-y-2 md:space-y-4">
          {poolTasks.length === 0 ? (
            <div className="text-center py-6 md:py-12 text-slate-400">
              <div className="text-3xl md:text-6xl mb-2 md:mb-4">🎯</div>
              <h3 className="text-sm md:text-xl font-semibold text-slate-300 mb-1 md:mb-2">Pula jest pusta</h3>
              <p className="text-xs md:text-base text-slate-400">Wszystkie zadania są przypisane do techników.</p>
            </div>
          ) : (
            poolTasks.map((task) => (
              <div key={task._id} className="p-6 glass-card-light rounded-2xl hover:bg-slate-600/30 transition-all duration-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold text-white">{task.title}</h4>
                      <span className={`px-3 py-1 rounded-xl text-sm font-semibold border ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm text-slate-300 mb-3">
                      <div className="flex items-center gap-2">
                        <span>📍</span>
                        <span>{task.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>🕐</span>
                        <span>
                          {task.dueDate 
                            ? `Termin: ${new Date(task.dueDate).toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })}`
                            : 'Bez terminu'
                          } ({task.shift})
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>🏷️</span>
                        <span>{task.category}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>⏱️</span>
                        <span>{task.estimatedDuration} minut</span>
                      </div>
                      {task.originalAssignee && (
                        <div className="flex items-center gap-2">
                          <span>👤</span>
                          <span>Pierwotnie: {getTechnicianName(task.originalAssignee)}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <span>📅</span>
                        <span>W puli od: {new Date(task.movedToPoolAt || task.createdAt).toLocaleString('pl-PL')}</span>
                      </div>
                    </div>

                    {task.description && (
                      <p className="text-sm text-slate-400 mb-3 bg-slate-700/30 p-3 rounded-xl">{task.description}</p>
                    )}

                    {task.poolReason && (
                      <div className="p-3 bg-amber-500/20 rounded-xl border border-amber-500/30">
                        <div className="text-sm font-medium text-amber-400 mb-1">Powód przeniesienia do puli:</div>
                        <div className="text-sm text-amber-300">{task.poolReason}</div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 pt-4 border-t border-slate-600">
                  <button 
                    onClick={() => openAssignModal(task)}
                    className="btn-primary"
                    disabled={loading}
                  >
                    Przypisz technika
                  </button>
                  
                  <select
                    value={task.priority}
                    onChange={(e) => handleChangePriority(task._id, e.target.value)}
                    className="input-field"
                    disabled={loading}
                  >
                    <option value="Niski">Priorytet: Niski</option>
                    <option value="Średni">Priorytet: Średni</option>
                    <option value="Wysoki">Priorytet: Wysoki</option>
                  </select>
                  
              <div key={task._id} className="p-1.5 md:p-6 glass-card-light rounded-md md:rounded-2xl hover:bg-slate-600/30 transition-all duration-200">
                <div className="flex items-start justify-between mb-1 md:mb-4">
                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-center gap-0.5 md:gap-3 mb-1 md:mb-3">
                      <h4 className="font-semibold text-white text-xs md:text-base line-clamp-1 md:line-clamp-2">{task.title}</h4>
                      <span className={`px-1 py-0.5 md:px-3 md:py-1 rounded-sm md:rounded-xl mobile-micro-text md:text-sm font-semibold border ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-2 lg:flex lg:items-center gap-0.5 md:gap-4 mobile-micro-text md:text-sm text-slate-300 mb-1 md:mb-3">
                      <div className="flex items-center gap-0.5 md:gap-2">
                        <span>📍</span>
                        <span className="truncate">{task.location}</span>
                      </div>
                      <div className="flex items-center gap-0.5 md:gap-2">
                        <span>🕐</span>
                        <span className="mobile-micro-text md:text-sm">
                          {task.shift || task.assignedShift || 'Brak zmiany'}
                        </span>
                      </div>
                    </div>
                    
                    {task.poolReason && (
                      <div className="p-1 md:p-3 bg-amber-500/20 rounded-md md:rounded-xl border border-amber-500/30 mb-1 md:mb-3">
                        <div className="mobile-micro-text md:text-sm font-medium text-amber-400 mb-0.5 md:mb-1">Powód:</div>
                        <div className="mobile-micro-text md:text-sm text-amber-300">{task.poolReason}</div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mobile-grid-2 md:flex gap-0.5 md:gap-2 pt-1 md:pt-4 border-t border-slate-600">
                  <button 
                    onClick={() => openAssignModal(task)}
                    className="mobile-mini-button md:px-4 md:py-2 bg-blue-500/20 text-blue-400 rounded-sm md:rounded-xl hover:bg-blue-500/30 transition-all duration-200 font-medium"
                  >
                    <span className="md:hidden mobile-micro-text">👤</span>
                    <span className="hidden md:inline text-sm">👤 Przypisz</span>
                  </button>
                  
                  <select
                    value={task.priority}
                    onChange={(e) => handleChangePriority(task._id, e.target.value)}
                    className="mobile-mini-button md:px-4 md:py-2 bg-slate-700/50 text-slate-300 rounded-sm md:rounded-xl transition-all duration-200 font-medium text-xs md:text-sm"
                    disabled={loading}
                  >
                    <option value="Niski">Niski</option>
                    <option value="Średni">Średni</option>
                    <option value="Wysoki">Wysoki</option>
                  </select>
                  
                  <button 
                    onClick={() => openDetailsModal(task)}
                    className="mobile-mini-button md:px-4 md:py-2 bg-purple-500/20 text-purple-400 rounded-sm md:rounded-xl hover:bg-purple-500/30 transition-all duration-200 font-medium"
                  >
                    <span className="md:hidden mobile-micro-text">📋</span>
                    <span className="hidden md:inline text-sm">📋 Szczegóły</span>
                  </button>
                  
                  <button 
                    onClick={() => handleDeleteTask(task._id)}
                    className="mobile-mini-button md:px-4 md:py-2 bg-red-500/20 text-red-400 rounded-sm md:rounded-xl hover:bg-red-500/30 transition-all duration-200 font-medium"
                    disabled={loading}
                  >
                    <span className="md:hidden mobile-micro-text">🗑️</span>
                    <span className="hidden md:inline text-sm">🗑️ Usuń</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {poolTasks.length > 0 && (
          <div className="mt-6 p-4 bg-blue-500/20 rounded-2xl border border-blue-500/30">
            <div className="flex items-center gap-3">
              <span className="text-blue-400 text-xl">💡</span>
              <div className="text-sm text-blue-300">
                <div className="font-semibold mb-1">Wskazówka:</div>
                <div>Zadania w puli można przypisać do dostępnych techników lub zmienić ich priorytet. Zadania o wyższym priorytecie powinny być wykonane w pierwszej kolejności.</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {showAssignModal && selectedTask && (
        <AssignTaskModal 
          task={selectedTask} 
          onClose={() => setShowAssignModal(false)}
          onAssigned={() => {
            setShowAssignModal(false);
            setSelectedTask(null);
          }}
        />
      )}

      {showDetailsModal && selectedTask && (
        <TaskDetailsModal 
          task={selectedTask} 
          onClose={() => setShowDetailsModal(false)} 
        />
      )}
    </>
  );
}