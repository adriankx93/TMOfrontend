import { useState, useEffect } from "react";
import { useTasks } from "../hooks/useTasks";
import { sheetsService } from "../services/sheetsService";
import TaskDetailsModal from "./TaskDetailsModal";
import TaskEditModal from "./TaskEditModal";

export default function TaskList({ type }) {
  const { tasks, updateTask, deleteTask, moveToPool, completeTask } = useTasks();
  const [technicians, setTechnicians] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTechnicians();
  }, []);

  const fetchTechnicians = async () => {
    try {
      const data = await sheetsService.getCurrentMonthData();
      setTechnicians(data.technicians);
    } catch (error) {
      console.error('Error fetching technicians:', error);
      setTechnicians([]);
    }
  };

  // Filter tasks based on type
  const filteredTasks = tasks.filter(task => {
    switch(type) {
      case 'current':
        return ['assigned', 'in_progress'].includes(task.status);
      case 'completed':
        return task.status === 'completed';
      case 'overdue':
        return task.status === 'overdue' || (task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'completed');
      default:
        return true;
    }
  });

  const getStatusColor = (status) => {
    switch(status) {
      case 'assigned': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'in_progress': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'completed': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'overdue': return 'bg-red-100 text-red-800 border-red-200';
      case 'pool': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getStatusLabel = (status) => {
    switch(status) {
      case 'assigned': return 'Przypisane';
      case 'in_progress': return 'W trakcie';
      case 'completed': return 'Zakończone';
      case 'overdue': return 'Przeterminowane';
      case 'pool': return 'W puli';
      default: return 'Nieznany';
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'Krytyczny': return 'bg-red-100 text-red-800 border-red-200';
      case 'Wysoki': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Średni': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Niski': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const handleStatusChange = async (taskId, newStatus, additionalData = {}) => {
    setLoading(true);
    try {
      const updateData = {
        status: newStatus,
        ...additionalData,
        history: [
          ...(tasks.find(t => t._id === taskId)?.history || []),
          {
            action: `status_changed_to_${newStatus}`,
            user: "Administrator Systemu",
            timestamp: new Date().toISOString(),
            details: `Status zmieniony na: ${getStatusLabel(newStatus)}`
          }
        ]
      };

      await updateTask(taskId, updateData);
    } catch (error) {
      console.error('Error updating task status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteTask = async (taskId) => {
    const notes = prompt("Dodaj notatki o wykonaniu zadania (opcjonalne):");
    await handleStatusChange(taskId, 'completed', {
      completedAt: new Date().toISOString(),
      notes: notes || "",
      completedBy: "Administrator Systemu"
    });
  };

  const handleMoveToPool = async (taskId) => {
    const reason = prompt("Podaj powód przeniesienia do puli:");
    if (reason) {
      await handleStatusChange(taskId, 'pool', {
        poolReason: reason,
        movedToPoolAt: new Date().toISOString(),
        movedToPoolBy: "Administrator Systemu",
        assignedTo: null
      });
    }
  };

  const handleMissingMaterials = async (taskId) => {
    const materials = prompt("Jakich materiałów brakuje?");
    if (materials) {
      await handleStatusChange(taskId, 'pool', {
        poolReason: `Brak materiałów: ${materials}`,
        missingMaterials: materials,
        movedToPoolAt: new Date().toISOString(),
        movedToPoolBy: "Administrator Systemu",
        assignedTo: null,
        needsMaterials: true
      });
    }
  };

  const getTechnicianName = (technicianId) => {
    const technician = technicians.find(t => t.id === technicianId);
    return technician ? technician.fullName : 'Nieprzypisane';
  };

  const openDetailsModal = (task) => {
    setSelectedTask(task);
    setShowDetailsModal(true);
  };

  const openEditModal = (task) => {
    setSelectedTask(task);
    setShowEditModal(true);
  };

  return (
    <>
      <div className="glass-card p-8">
        <div className="space-y-4">
          {filteredTasks.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <div className="text-6xl mb-4">📋</div>
              <h3 className="text-xl font-semibold text-slate-300 mb-2">Brak zadań</h3>
              <p className="text-slate-400">W tej kategorii nie ma jeszcze żadnych zadań.</p>
            </div>
          ) : (
            filteredTasks.map((task) => (
              <div key={task._id} className="p-6 glass-card-light rounded-2xl hover:bg-slate-600/30 transition-all duration-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold text-white">{task.title}</h4>
                      <span className={`px-3 py-1 rounded-xl text-sm font-semibold border ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-slate-300 mb-3">
                      <div className="flex items-center gap-2">
                        <span>👤</span>
                        <span>{getTechnicianName(task.assignedTo)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>📍</span>
                        <span>{task.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>🕐</span>
                        <span>
                          {task.dueDate 
                            ? new Date(task.dueDate).toLocaleDateString('pl-PL')
                            : 'Bez terminu'
                          } ({task.shift || task.assignedShift || 'Brak zmiany'})
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>🏷️</span>
                        <span>{task.category}</span>
                      </div>
                    </div>
                    
                    {task.description && (
                      <p className="text-sm text-slate-400 mb-3">{task.description}</p>
                    )}

                    {task.progress !== undefined && (
                      <div className="mb-3">
                        <div className="flex justify-between text-sm text-slate-300 mb-1">
                          <span>Postęp</span>
                          <span className="font-semibold text-white">{task.progress || 0}%</span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-2">
                          <div 
                            className="gradient-primary h-2 rounded-full transition-all duration-300"
                            style={{ width: `${task.progress || 0}%` }}
                          ></div>
                        </div>
                      </div>
                    )}

                    {task.createdBy && (
                      <div className="text-xs text-slate-500">
                        Utworzone przez: {task.createdBy} • {new Date(task.createdAt).toLocaleString('pl-PL')}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col gap-2 ml-4">
                    <span className={`px-3 py-1 rounded-xl text-sm font-semibold border ${getStatusColor(task.status)}`}>
                      {getStatusLabel(task.status)}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 pt-4 border-t border-slate-600 flex-wrap">
                  <button 
                    onClick={() => openDetailsModal(task)}
                    className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-xl hover:bg-blue-500/30 transition-all duration-200 font-medium"
                  >
                    📋 Szczegóły
                  </button>
                  
                  <button 
                    onClick={() => openEditModal(task)}
                    className="px-4 py-2 bg-purple-500/20 text-purple-400 rounded-xl hover:bg-purple-500/30 transition-all duration-200 font-medium"
                  >
                    ✏️ Edytuj
                  </button>
                  
                  {['assigned', 'in_progress'].includes(task.status) && (
                    <>
                      <button 
                        onClick={() => handleStatusChange(task._id, task.status === 'assigned' ? 'in_progress' : 'assigned')}
                        className="px-4 py-2 bg-amber-500/20 text-amber-400 rounded-xl hover:bg-amber-500/30 transition-all duration-200 font-medium"
                        disabled={loading}
                      >
                        {task.status === 'assigned' ? '▶️ Rozpocznij' : '⏸️ Wstrzymaj'}
                      </button>
                      
                      <button 
                        onClick={() => handleCompleteTask(task._id)}
                        className="px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-xl hover:bg-emerald-500/30 transition-all duration-200 font-medium"
                        disabled={loading}
                      >
                        ✅ Zakończ
                      </button>
                      
                      <button 
                        onClick={() => handleMissingMaterials(task._id)}
                        className="px-4 py-2 bg-orange-500/20 text-orange-400 rounded-xl hover:bg-orange-500/30 transition-all duration-200 font-medium"
                        disabled={loading}
                      >
                        📦 Brak materiałów
                      </button>
                      
                      <button 
                        onClick={() => handleMoveToPool(task._id)}
                        className="px-4 py-2 bg-purple-500/20 text-purple-400 rounded-xl hover:bg-purple-500/30 transition-all duration-200 font-medium"
                        disabled={loading}
                      >
                        🔄 Do puli
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {showDetailsModal && selectedTask && (
        <TaskDetailsModal 
          task={selectedTask} 
          technicians={technicians}
          onClose={() => setShowDetailsModal(false)} 
        />
      )}

      {showEditModal && selectedTask && (
        <TaskEditModal 
          task={selectedTask} 
          technicians={technicians}
          onClose={() => setShowEditModal(false)}
          onTaskUpdated={() => {
            setShowEditModal(false);
            setSelectedTask(null);
          }}
        />
      )}
    </>
  );
}