import { useState, useEffect } from "react";
import { useTasks } from "../hooks/useTasks";
import { sheetsService } from "../services/sheetsService";
import TaskDetailsModal from "./TaskDetailsModal";
import TaskEditModal from "./TaskEditModal";
import MoveToPoolModal from "./MoveToPoolModal";
import MissingMaterialsModal from "./MissingMaterialsModal";

export default function TaskList({ type }) {
  const { tasks, updateTask, deleteTask, moveToPool, completeTask } = useTasks();
  const [technicians, setTechnicians] = useState([]);
  const [localProgress, setLocalProgress] = useState({});
  const [selectedTask, setSelectedTask] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showMoveToPoolModal, setShowMoveToPoolModal] = useState(false);
  const [showMissingMaterialsModal, setShowMissingMaterialsModal] = useState(false);
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
      completedBy: "Administrator Systemu",
      progress: 100
    });
  };

  const handleProgressChange = async (taskId, newProgress) => {
    // Update local state immediately for smooth UI
    setLocalProgress(prev => ({
      ...prev,
      [taskId]: newProgress
    }));
    
    // Debounce the API call
    clearTimeout(window[`progressTimeout_${taskId}`]);
    
    window[`progressTimeout_${taskId}`] = setTimeout(async () => {
      setLoading(true);
      try {
        const updateData = {
          progress: newProgress,
          lastModified: new Date().toISOString(),
          lastModifiedBy: "Administrator Systemu",
          history: [
            ...(tasks.find(t => t._id === taskId)?.history || []),
            {
              action: "progress_updated",
              user: "Administrator Systemu",
              timestamp: new Date().toISOString(),
              details: `Postęp zaktualizowany do ${newProgress}%`
            }
          ]
        };

        await updateTask(taskId, updateData);
        
        // Clear local state after successful update
        setLocalProgress(prev => {
          const newState = { ...prev };
          delete newState[taskId];
          return newState;
        });
      } catch (error) {
        console.error('Error updating task progress:', error);
        // Revert local state on error
        setLocalProgress(prev => {
          const newState = { ...prev };
          delete newState[taskId];
          return newState;
        });
      } finally {
        setLoading(false);
      }
    }, 500); // Wait 500ms after user stops dragging
  };

  const handleMoveToPool = async (taskId) => {
    setSelectedTask(tasks.find(t => t._id === taskId));
    setShowMoveToPoolModal(true);
  };

  const handleMissingMaterials = async (taskId) => {
    setSelectedTask(tasks.find(t => t._id === taskId));
    setShowMissingMaterialsModal(true);
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
      <div className="glass-card p-2 md:p-8">
        <div className="space-y-4">
          {filteredTasks.length === 0 ? (
            <div className="text-center py-6 md:py-12 text-slate-400">
              <div className="text-3xl md:text-6xl mb-2 md:mb-4">📋</div>
              <h3 className="text-sm md:text-xl font-semibold text-slate-300 mb-1 md:mb-2">Brak zadań</h3>
              <p className="text-xs md:text-base text-slate-400">W tej kategorii nie ma jeszcze żadnych zadań.</p>
            </div>
          ) : (
            filteredTasks.map((task) => (
              <div key={task._id} className="p-1.5 md:p-6 glass-card-light rounded-md md:rounded-2xl hover:bg-slate-600/30 transition-all duration-200">
                <div className="flex items-start justify-between mb-1 md:mb-4">
                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-center gap-0.5 md:gap-3 mb-1 md:mb-3">
                      <h4 className="font-semibold text-white text-xs md:text-base line-clamp-1 md:line-clamp-2">{task.title}</h4>
                      <span className={`px-1.5 py-0.5 md:px-3 md:py-1 rounded-md md:rounded-xl text-xs md:text-sm font-semibold ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-2 lg:flex lg:items-center gap-0.5 md:gap-4 mobile-micro-text md:text-sm text-slate-300 mb-1 md:mb-3">
                      <div className="truncate">
                        {getTechnicianName(task.assignedTo)}
                      </div>
                      <div className="truncate">
                        {task.location}
                      </div>
                      <div className="text-mobile-xs md:text-sm">
                        {task.dueDate 
                          ? new Date(task.dueDate).toLocaleDateString('pl-PL', { day: '2-digit', month: '2-digit' })
                          : 'Bez terminu'
                        }
                      </div>
                      <div className="hidden md:block">
                        {task.category}
                      </div>
                    </div>
                    
                    {task.description && (
                      <p className="mobile-micro-text md:text-sm text-slate-400 mb-1 md:mb-3 line-clamp-1 md:line-clamp-2">{task.description}</p>
                    )}

                    {/* Progress bar for all tasks */}
                    <div className="mb-1 md:mb-3">
                      <div className="flex justify-between mobile-micro-text md:text-sm text-slate-300 mb-1 md:mb-2">
                        <span>Postęp</span>
                        <span className="font-semibold text-white">{task.progress || 0}%</span>
                      </div>
                      <div className="relative">
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={localProgress[task._id] !== undefined ? localProgress[task._id] : (task.progress || 0)}
                          onChange={(e) => handleProgressChange(task._id, parseInt(e.target.value))}
                          className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer progress-slider"
                          disabled={loading || !['assigned', 'in_progress'].includes(task.status)}
                          style={{
                            background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${localProgress[task._id] !== undefined ? localProgress[task._id] : (task.progress || 0)}%, #475569 ${localProgress[task._id] !== undefined ? localProgress[task._id] : (task.progress || 0)}%, #475569 100%)`
                          }}
                        />
                      </div>
                    </div>

                    {task.createdBy && (
                      <div className="mobile-micro-text md:text-xs text-slate-500 hidden lg:block">
                        Utworzone przez: {task.createdBy} • {new Date(task.createdAt).toLocaleString('pl-PL')}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col gap-0.5 md:gap-2 ml-0.5 md:ml-4">
                    <span className={`px-1.5 py-0.5 md:px-3 md:py-1 rounded-md md:rounded-xl text-xs md:text-sm font-semibold ${getStatusColor(task.status)}`}>
                      {getStatusLabel(task.status)}
                    </span>
                  </div>
                </div>

                <div className="flex flex-nowrap overflow-x-auto w-full gap-0.5 md:gap-2 pt-1 md:pt-4 border-t border-slate-600">
                  <button 
                    onClick={() => openDetailsModal(task)}
                    className="btn-compact md:px-4 md:py-2 bg-blue-500/20 text-blue-400 rounded-md md:rounded-xl hover:bg-blue-500/30 transition-all duration-200 font-medium whitespace-nowrap"
                  >
                    <span className="md:hidden text-xs">S</span>
                    <span className="hidden md:inline text-sm">Szczegóły</span>
                  </button>
                  
                  <button 
                    onClick={() => openEditModal(task)}
                    className="btn-compact md:px-4 md:py-2 bg-purple-500/20 text-purple-400 rounded-md md:rounded-xl hover:bg-purple-500/30 transition-all duration-200 font-medium whitespace-nowrap"
                  >
                    <span className="md:hidden text-xs">E</span>
                    <span className="hidden md:inline text-sm">Edytuj</span>
                  </button>
                  
                  {['assigned', 'in_progress'].includes(task.status) && (
                    <>
                      <button 
                        onClick={() => handleStatusChange(task._id, task.status === 'assigned' ? 'in_progress' : 'assigned')}
                        className="btn-compact md:px-4 md:py-2 bg-amber-500/20 text-amber-400 rounded-md md:rounded-xl hover:bg-amber-500/30 transition-all duration-200 font-medium whitespace-nowrap"
                        disabled={loading}
                      >
                        {task.status === 'assigned' ? (
                          <>
                            <span className="md:hidden text-xs">R</span>
                            <span className="hidden md:inline text-sm">Rozpocznij</span>
                          </>
                        ) : (
                          <>
                            <span className="md:hidden text-xs">W</span>
                            <span className="hidden md:inline text-sm">Wstrzymaj</span>
                          </>
                        )}
                      </button>
                      
                      <button 
                        onClick={() => handleCompleteTask(task._id)}
                        className="btn-compact md:px-4 md:py-2 bg-emerald-500/20 text-emerald-400 rounded-md md:rounded-xl hover:bg-emerald-500/30 transition-all duration-200 font-medium whitespace-nowrap"
                        disabled={loading}
                      >
                        <span className="md:hidden text-xs">Z</span>
                        <span className="hidden md:inline text-sm">Zakończ</span>
                      </button>
                      
                      <button 
                        onClick={() => handleMissingMaterials(task._id)}
                        className="btn-compact md:px-4 md:py-2 bg-orange-500/20 text-orange-400 rounded-md md:rounded-xl hover:bg-orange-500/30 transition-all duration-200 font-medium whitespace-nowrap"
                        disabled={loading}
                      >
                        <span className="md:hidden text-xs">M</span>
                        <span className="hidden md:inline text-sm">Materiały</span>
                      </button>
                      
                      <button 
                        onClick={() => handleMoveToPool(task._id)}
                        className="btn-compact md:px-4 md:py-2 bg-purple-500/20 text-purple-400 rounded-md md:rounded-xl hover:bg-purple-500/30 transition-all duration-200 font-medium whitespace-nowrap"
                        disabled={loading}
                      >
                        <span className="md:hidden text-xs">P</span>
                        <span className="hidden md:inline text-sm">Do puli</span>
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

      {showMoveToPoolModal && selectedTask && (
        <MoveToPoolModal 
          task={selectedTask}
          onClose={() => setShowMoveToPoolModal(false)}
          onMoved={() => {
            setShowMoveToPoolModal(false);
            setSelectedTask(null);
          }}
        />
      )}

      {showMissingMaterialsModal && selectedTask && (
        <MissingMaterialsModal 
          task={selectedTask}
          onClose={() => setShowMissingMaterialsModal(false)}
          onMoved={() => {
            setShowMissingMaterialsModal(false);
            setSelectedTask(null);
          }}
        />
      )}
    </>
  );
}