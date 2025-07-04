import { useTasks } from "../hooks/useTasks";
import { useTechnicians } from "../hooks/useTechnicians";
import { useNavigate } from "react-router-dom";

export default function TasksOverview() {
  const { tasks } = useTasks();
  const { technicians } = useTechnicians();
  const navigate = useNavigate();

  // Get recent tasks (last 4)
  const recentTasks = tasks
    .filter(task => ['assigned', 'in_progress', 'completed'].includes(task.status))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 4);

  const getStatusColor = (status) => {
    switch(status) {
      case 'assigned': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'in_progress': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'completed': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'pool': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getStatusLabel = (status) => {
    switch(status) {
      case 'assigned': return 'Przypisane';
      case 'in_progress': return 'W trakcie';
      case 'completed': return 'Zakończone';
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

  const getTechnicianName = (technicianId) => {
    const technician = technicians.find(t => t._id === technicianId);
    return technician ? `${technician.firstName} ${technician.lastName}` : 'Nieprzypisane';
  };

  return (
    <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl shadow-xl overflow-hidden">
      <div className="bg-gradient-to-r from-slate-50 to-orange-50 px-8 py-6 border-b border-slate-200/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-white text-xl">📋</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                Przegląd zadań
              </h2>
              <p className="text-slate-500 font-medium">
                Ostatnie zadania w systemie
              </p>
            </div>
          </div>
          
          <button 
            onClick={() => navigate('/zadania')}
            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
          >
            Zobacz wszystkie
          </button>
        </div>
      </div>

      <div className="p-8">
        {recentTasks.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-slate-600 mb-2">Brak zadań</h3>
            <p className="text-slate-500">Nie ma jeszcze żadnych zadań w systemie.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {recentTasks.map((task) => (
              <div key={task._id} className="p-6 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-all duration-200 border border-slate-200/50">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-800 mb-2">{task.title}</h4>
                    <div className="flex items-center gap-4 text-sm text-slate-600">
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
                  </div>
                  
                  <div className="flex gap-2">
                    <span className={`px-3 py-1 rounded-xl text-sm font-semibold border ${getStatusColor(task.status)}`}>
                      {getStatusLabel(task.status)}
                    </span>
                    <span className={`px-3 py-1 rounded-xl text-sm font-semibold border ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                  </div>
                </div>
                
                {task.progress !== undefined && task.status !== 'completed' && (
                  <div className="mt-3">
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
}