import { useState } from "react";
import { useTasks } from "../hooks/useTasks";
import { useTechnicians } from "../hooks/useTechnicians";
import TaskDetailsModal from "./TaskDetailsModal";
import AssignTaskModal from "./AssignTaskModal";

export default function TaskList({ type }) {
  const { tasks, updateTask, deleteTask, moveToPool, completeTask } = useTasks();
  const { technicians } = useTechnicians();
  const [selectedTask, setSelectedTask] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // Filter tasks based on type
  const filteredTasks = tasks.filter(task => {
    switch(type) {
      case 'current':
        return ['assigned', 'in_progress'].includes(task.status);
      case 'completed':
        return task.status === 'completed';
      case 'overdue':
        return task.status === 'overdue' || (task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'completed');
      case 'pool':
        return task.status === 'pool';
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
      case 'Wysoki': return 'bg-red-100 text-red-800 border-red-200';
      case 'Średni': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Niski': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    setLoading(true);
    try {
      await updateTask(taskId, { status: newStatus });
    } catch (error) {
      console.error('Error updating task status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMoveToPool = async (taskId) => {
    const reason = prompt("Podaj powód przeniesienia do puli:");
    if (reason) {
      setLoading(true);
      try {
        await moveToPool(taskId, reason);
      } catch (error) {
        console.error('Error moving task to pool:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCompleteTask = async (taskId) => {
    const notes = prompt("Dodaj notatki o wykonaniu zadania (opcjonalne):");
    setLoading(true);
    try {
      await completeTask(taskId, {
        completedAt: new Date().toISOString(),
        notes: notes || ""
      });
    } catch (error) {
      console.error('Error completing task:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm("Czy na pewno chcesz usunąć to zadanie?")) {
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

  const getTechnicianName = (technicianId) => {
    const technician = technicians.find(t => t._id === technicianId);
    return technician ? `${technician.firstName} ${technician.lastName}` : 'Nieprzypisane';
  };

  const openDetailsModal = (task) => {
    setSelectedTask(task);
    setShowDetailsModal(true);
  };

  const openAssignModal = (task) => {
    setSelectedTask(task);
    setShowAssignModal(true);
  };

  return (
    <>
      <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl shadow-xl p-8">
        <div className="space-y-4">
          {filteredTasks.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📋</div>
              <h3 className="text-xl font-semibold text-slate-600 mb-2">Brak zadań</h3>
              <p className="text-slate-500">W tej kategorii nie ma jeszcze żadnych zadań.</p>
            </div>
          ) : (
            filteredTasks.map((task) => (
              <div key={task._id} className="p-6 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-all duration-200 border border-slate-200/50">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-800 mb-2">{task.title}</h4>
                    <div className="flex items-center gap-4 text-sm text-slate-600 mb-3">
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
                            ? new Date(task.dueDate).toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })
                            : 'Bez terminu'
                          } ({task.shift})
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>🏷️</span>
                        <span>{task.category}</span>
                      </div>
                    </div>
                    
                    {task.description && (
                      <p className="text-sm text-slate-600 mb-3">{task.description}</p>
                    )}

                    {task.progress !== undefined && (
                      <div className="mb-3">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-slate-600">Postęp</span>
                          <span className="font-semibold text-slate-800">{task.progress || 0}%</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-orange-500 to-red-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${task.progress || 0}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col gap-2 ml-4">
                    <span className={`px-3 py-1 rounded-xl text-sm font-semibold border ${getStatusColor(task.status)}`}>
                      {getStatusLabel(task.status)}
                    </span>
                    <span className={`px-3 py-1 rounded-xl text-sm font-semibold border ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 pt-4 border-t border-slate-200">
                  <button 
                    onClick={() => openDetailsModal(task)}
                    className="px-4 py-2 bg-blue-100 text-blue-800 rounded-xl hover:bg-blue-200 transition-all duration-200 font-medium"
                  >
                    Szczegóły
                  </button>
                  
                  {task.status === 'pool' && (
                    <button 
                      onClick={() => openAssignModal(task)}
                      className="px-4 py-2 bg-green-100 text-green-800 rounded-xl hover:bg-green-200 transition-all duration-200 font-medium"
                      disabled={loading}
                    >
                      Przypisz
                    </button>
                  )}
                  
                  {['assigned', 'in_progress'].includes(task.status) && (
                    <>
                      <button 
                        onClick={() => handleStatusChange(task._id, task.status === 'assigned' ? 'in_progress' : 'assigned')}
                        className="px-4 py-2 bg-amber-100 text-amber-800 rounded-xl hover:bg-amber-200 transition-all duration-200 font-medium"
                        disabled={loading}
                      >
                        {task.status === 'assigned' ? 'Rozpocznij' : 'Wstrzymaj'}
                      </button>
                      
                      <button 
                        onClick={() => handleCompleteTask(task._id)}
                        className="px-4 py-2 bg-emerald-100 text-emerald-800 rounded-xl hover:bg-emerald-200 transition-all duration-200 font-medium"
                        disabled={loading}
                      >
                        Zakończ
                      </button>
                      
                      <button 
                        onClick={() => handleMoveToPool(task._id)}
                        className="px-4 py-2 bg-purple-100 text-purple-800 rounded-xl hover:bg-purple-200 transition-all duration-200 font-medium"
                        disabled={loading}
                      >
                        Do puli
                      </button>
                    </>
                  )}
                  
                  {task.status === 'overdue' && (
                    <button 
                      onClick={() => handleMoveToPool(task._id)}
                      className="px-4 py-2 bg-blue-100 text-blue-800 rounded-xl hover:bg-blue-200 transition-all duration-200 font-medium"
                      disabled={loading}
                    >
                      Przenieś do puli
                    </button>
                  )}
                  
                  <button 
                    onClick={() => handleDeleteTask(task._id)}
                    className="px-4 py-2 bg-red-100 text-red-800 rounded-xl hover:bg-red-200 transition-all duration-200 font-medium"
                    disabled={loading}
                  >
                    Usuń
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {showDetailsModal && selectedTask && (
        <TaskDetailsModal 
          task={selectedTask} 
          onClose={() => setShowDetailsModal(false)} 
        />
      )}

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
    </>
  );
}