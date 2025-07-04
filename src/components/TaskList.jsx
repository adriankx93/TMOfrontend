export default function TaskList({ type }) {
  const tasks = {
    current: [
      {
        id: 1,
        title: "Naprawa oświetlenia LED w hali głównej",
        assignee: "Jan Kowalski",
        priority: "Wysoki",
        status: "W trakcie",
        dueTime: "14:00",
        location: "Hala A, Sektor 3",
        shift: "Dzienna",
        progress: 60
      },
      {
        id: 2,
        title: "Kontrola systemu wentylacji",
        assignee: "Anna Nowak",
        priority: "Średni", 
        status: "Nowe",
        dueTime: "16:00",
        location: "Dach budynku B",
        shift: "Dzienna",
        progress: 0
      }
    ],
    completed: [
      {
        id: 3,
        title: "Wymiana filtrów w klimatyzacji",
        assignee: "Piotr Wiśniewski",
        priority: "Niski",
        status: "Zakończone",
        completedTime: "12:30",
        location: "Biuro administracyjne",
        shift: "Dzienna",
        progress: 100
      }
    ],
    overdue: [
      {
        id: 4,
        title: "Kalibracja czujników temperatury",
        assignee: "Nieprzypisane",
        priority: "Wysoki",
        status: "Przeterminowane",
        dueTime: "10:00",
        location: "Magazyn C",
        shift: "Dzienna",
        progress: 0
      }
    ]
  };

  const currentTasks = tasks[type] || [];

  const getStatusColor = (status) => {
    switch(status) {
      case 'Nowe': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'W trakcie': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Zakończone': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Przeterminowane': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
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

  return (
    <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl shadow-xl p-8">
      <div className="space-y-4">
        {currentTasks.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-slate-600 mb-2">Brak zadań</h3>
            <p className="text-slate-500">W tej kategorii nie ma jeszcze żadnych zadań.</p>
          </div>
        ) : (
          currentTasks.map((task) => (
            <div key={task.id} className="p-6 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-all duration-200 border border-slate-200/50">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h4 className="font-semibold text-slate-800 mb-2">{task.title}</h4>
                  <div className="flex items-center gap-4 text-sm text-slate-600 mb-3">
                    <div className="flex items-center gap-2">
                      <span>👤</span>
                      <span>{task.assignee}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>📍</span>
                      <span>{task.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>🕐</span>
                      <span>{task.dueTime || task.completedTime} ({task.shift})</span>
                    </div>
                  </div>
                  
                  {task.progress !== undefined && (
                    <div className="mb-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-600">Postęp</span>
                        <span className="font-semibold text-slate-800">{task.progress}%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-orange-500 to-red-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${task.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col gap-2 ml-4">
                  <span className={`px-3 py-1 rounded-xl text-sm font-semibold border ${getStatusColor(task.status)}`}>
                    {task.status}
                  </span>
                  <span className={`px-3 py-1 rounded-xl text-sm font-semibold border ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t border-slate-200">
                <button className="px-4 py-2 bg-orange-100 text-orange-800 rounded-xl hover:bg-orange-200 transition-all duration-200 font-medium">
                  Edytuj
                </button>
                {type === 'overdue' && (
                  <button className="px-4 py-2 bg-blue-100 text-blue-800 rounded-xl hover:bg-blue-200 transition-all duration-200 font-medium">
                    Przenieś do puli
                  </button>
                )}
                <button className="px-4 py-2 bg-slate-100 text-slate-800 rounded-xl hover:bg-slate-200 transition-all duration-200 font-medium">
                  Szczegóły
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}