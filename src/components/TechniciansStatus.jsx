import { useTechnicians } from "../hooks/useTechnicians";
import { useTasks } from "../hooks/useTasks";

export default function TechniciansStatus() {
  const { technicians } = useTechnicians();
  const { tasks } = useTasks();

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

  const getCurrentTask = (technicianId) => {
    const currentTask = tasks.find(task => 
      task.assignedTo === technicianId && 
      task.status === 'in_progress'
    );
    return currentTask ? currentTask.title : 'Brak aktywnego zadania';
  };

  // Show only first 4 technicians for dashboard overview
  const displayTechnicians = technicians.slice(0, 4);

  return (
    <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl shadow-xl p-8">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
          <span className="text-white text-xl">👷</span>
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-800">Status techników</h3>
          <p className="text-slate-600">Aktualny status zespołu</p>
        </div>
      </div>

      <div className="space-y-4">
        {displayTechnicians.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-2">👷</div>
            <div className="text-slate-500">Brak techników w systemie</div>
          </div>
        ) : (
          displayTechnicians.map((tech) => {
            const currentTasks = getTechnicianTasks(tech._id);
            const completedToday = getTechnicianCompletedToday(tech._id);
            const currentTask = getCurrentTask(tech._id);
            
            return (
              <div key={tech._id} className="p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-all duration-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-white font-bold">
                      {tech.firstName[0]}{tech.lastName[0]}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-800">{tech.firstName} {tech.lastName}</div>
                      <div className="text-sm text-slate-600">{tech.specialization} • Zmiana {tech.shift}</div>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-xl text-sm font-semibold border ${getStatusColor(tech.status)}`}>
                    {getStatusLabel(tech.status)}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                  <div>
                    <div className="text-slate-500">Lokalizacja:</div>
                    <div className="font-medium text-slate-800">{tech.currentLocation || 'Nieznana'}</div>
                  </div>
                  <div>
                    <div className="text-slate-500">Bieżące zadanie:</div>
                    <div className="font-medium text-slate-800 truncate">{currentTask}</div>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex gap-4 text-sm">
                    <div>
                      <span className="text-slate-500">Zadania: </span>
                      <span className="font-semibold text-orange-600">{currentTasks.length}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Wykonane dziś: </span>
                      <span className="font-semibold text-emerald-600">{completedToday}</span>
                    </div>
                  </div>
                  
                  {currentTasks.length > 0 && (
                    <div className="text-xs text-slate-500">
                      {tech.lastActivity 
                        ? `Aktywny ${new Date(tech.lastActivity).toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })}`
                        : 'Brak aktywności'
                      }
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {technicians.length > 4 && (
        <div className="mt-4 text-center">
          <div className="text-sm text-slate-500">
            Wyświetlono 4 z {technicians.length} techników
          </div>
        </div>
      )}
    </div>
  );
}