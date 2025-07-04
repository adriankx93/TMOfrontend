import { useTasks } from "../hooks/useTasks";

export default function TechnicianDetailsModal({ technician, onClose }) {
  const { tasks } = useTasks();

  const technicianTasks = tasks.filter(task => task.assignedTo === technician._id);
  const currentTasks = technicianTasks.filter(task => ['assigned', 'in_progress'].includes(task.status));
  const completedTasks = technicianTasks.filter(task => task.status === 'completed');
  
  const today = new Date().toDateString();
  const completedToday = completedTasks.filter(task => 
    task.completedAt && new Date(task.completedAt).toDateString() === today
  );

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

  const getTaskStatusColor = (status) => {
    switch(status) {
      case 'assigned': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-amber-100 text-amber-800';
      case 'completed': return 'bg-emerald-100 text-emerald-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  const getTaskStatusLabel = (status) => {
    switch(status) {
      case 'assigned': return 'Przypisane';
      case 'in_progress': return 'W trakcie';
      case 'completed': return 'Zakończone';
      default: return 'Nieznany';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                {technician.firstName[0]}{technician.lastName[0]}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-800">
                  {technician.firstName} {technician.lastName}
                </h2>
                <p className="text-slate-600 flex items-center gap-2">
                  <span>{getSpecializationIcon(technician.specialization)}</span>
                  {technician.specialization} • Zmiana {technician.shift}
                </p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-xl transition-all duration-200"
            >
              <span className="text-2xl text-slate-400">×</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Personal Information */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-slate-50 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-slate-800 mb-4">Informacje osobiste</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Status</label>
                    <span className={`inline-block px-3 py-1 rounded-xl text-sm font-semibold border ${getStatusColor(technician.status)}`}>
                      {getStatusLabel(technician.status)}
                    </span>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Email</label>
                    <div className="text-slate-800">{technician.email}</div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Telefon</label>
                    <div className="text-slate-800">{technician.phone}</div>
                  </div>
                  
                  {technician.employeeId && (
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Numer pracownika</label>
                      <div className="text-slate-800">{technician.employeeId}</div>
                    </div>
                  )}
                  
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Data zatrudnienia</label>
                    <div className="text-slate-800">
                      {new Date(technician.createdAt).toLocaleDateString('pl-PL')}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Ostatnia aktywność</label>
                    <div className="text-slate-800">
                      {technician.lastActivity 
                        ? new Date(technician.lastActivity).toLocaleString('pl-PL')
                        : 'Brak danych'
                      }
                    </div>
                  </div>
                </div>

                {technician.notes && (
                  <div className="mt-6 pt-4 border-t border-slate-200">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Notatki</label>
                    <div className="text-sm text-slate-600 bg-white p-3 rounded-xl">
                      {technician.notes}
                    </div>
                  </div>
                )}
              </div>

              {/* Statistics */}
              <div className="bg-slate-50 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-slate-800 mb-4">Statystyki</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-white rounded-xl">
                    <div className="text-2xl font-bold text-orange-600">{currentTasks.length}</div>
                    <div className="text-xs text-slate-600">Bieżące zadania</div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-xl">
                    <div className="text-2xl font-bold text-emerald-600">{completedToday.length}</div>
                    <div className="text-xs text-slate-600">Wykonane dziś</div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-xl">
                    <div className="text-2xl font-bold text-blue-600">{completedTasks.length}</div>
                    <div className="text-xs text-slate-600">Łącznie wykonane</div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-xl">
                    <div className="text-2xl font-bold text-purple-600">
                      {completedTasks.length > 0 
                        ? Math.round(completedTasks.reduce((acc, task) => acc + (task.estimatedDuration || 0), 0) / completedTasks.length)
                        : 0
                      }min
                    </div>
                    <div className="text-xs text-slate-600">Średni czas zadania</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tasks */}
            <div className="lg:col-span-2 space-y-6">
              {/* Current Tasks */}
              <div className="bg-slate-50 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-slate-800 mb-4">
                  Bieżące zadania ({currentTasks.length})
                </h3>
                
                {currentTasks.length === 0 ? (
                  <div className="text-center py-8 text-slate-500">
                    Brak bieżących zadań
                  </div>
                ) : (
                  <div className="space-y-3">
                    {currentTasks.map((task) => (
                      <div key={task._id} className="bg-white p-4 rounded-xl border border-slate-200">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold text-slate-800">{task.title}</h4>
                          <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${getTaskStatusColor(task.status)}`}>
                            {getTaskStatusLabel(task.status)}
                          </span>
                        </div>
                        <div className="text-sm text-slate-600 space-y-1">
                          <div>📍 {task.location}</div>
                          <div>🏷️ {task.category}</div>
                          <div>⏱️ {task.estimatedDuration} minut</div>
                          {task.dueDate && (
                            <div>🕐 Termin: {new Date(task.dueDate).toLocaleString('pl-PL')}</div>
                          )}
                        </div>
                        {task.progress !== undefined && (
                          <div className="mt-3">
                            <div className="flex justify-between text-xs mb-1">
                              <span>Postęp</span>
                              <span>{task.progress}%</span>
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-2">
                              <div 
                                className="bg-gradient-to-r from-orange-500 to-red-600 h-2 rounded-full"
                                style={{ width: `${task.progress}%` }}
                              ></div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Recent Completed Tasks */}
              <div className="bg-slate-50 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-slate-800 mb-4">
                  Ostatnio wykonane zadania
                </h3>
                
                {completedTasks.length === 0 ? (
                  <div className="text-center py-8 text-slate-500">
                    Brak wykonanych zadań
                  </div>
                ) : (
                  <div className="space-y-3">
                    {completedTasks.slice(0, 5).map((task) => (
                      <div key={task._id} className="bg-white p-4 rounded-xl border border-slate-200">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold text-slate-800">{task.title}</h4>
                          <span className="px-2 py-1 rounded-lg text-xs font-semibold bg-emerald-100 text-emerald-800">
                            Zakończone
                          </span>
                        </div>
                        <div className="text-sm text-slate-600 space-y-1">
                          <div>📍 {task.location}</div>
                          <div>🏷️ {task.category}</div>
                          {task.completedAt && (
                            <div>✅ Zakończono: {new Date(task.completedAt).toLocaleString('pl-PL')}</div>
                          )}
                          {task.notes && (
                            <div className="mt-2 p-2 bg-slate-50 rounded text-xs">
                              💬 {task.notes}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    {completedTasks.length > 5 && (
                      <div className="text-center text-sm text-slate-500">
                        ... i {completedTasks.length - 5} więcej wykonanych zadań
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-6 border-t border-slate-200 mt-8">
            <button
              onClick={onClose}
              className="flex-1 py-3 bg-slate-100 text-slate-700 rounded-2xl font-semibold hover:bg-slate-200 transition-all duration-200"
            >
              Zamknij
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}