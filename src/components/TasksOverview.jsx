export default function TasksOverview() {
  const tasks = [
    {
      id: 1,
      title: "Naprawa oświetlenia LED w hali głównej",
      assignee: "Jan Kowalski",
      priority: "Wysoki",
      status: "W trakcie",
      dueTime: "14:00",
      location: "Hala A, Sektor 3",
      shift: "Dzienna"
    },
    {
      id: 2,
      title: "Kontrola systemu wentylacji",
      assignee: "Anna Nowak", 
      priority: "Średni",
      status: "Nowe",
      dueTime: "16:00",
      location: "Dach budynku B",
      shift: "Dzienna"
    },
    {
      id: 3,
      title: "Wymiana filtrów w klimatyzacji",
      assignee: "Piotr Wiśniewski",
      priority: "Niski",
      status: "Zakończone",
      dueTime: "12:00",
      location: "Biuro administracyjne",
      shift: "Dzienna"
    },
    {
      id: 4,
      title: "Sprawdzenie systemu alarmowego",
      assignee: "Marek Zieliński",
      priority: "Wysoki",
      status: "Zaplanowane",
      dueTime: "21:00",
      location: "Cały obiekt",
      shift: "Nocna"
    }
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'Nowe': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'W trakcie': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Zakończone': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Zaplanowane': return 'bg-purple-100 text-purple-800 border-purple-200';
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
                Bieżące i zaplanowane zadania dla techników
              </p>
            </div>
          </div>
          
          <button className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200">
            Zobacz wszystkie
          </button>
        </div>
      </div>

      <div className="p-8">
        <div className="grid gap-4">
          {tasks.map((task) => (
            <div key={task.id} className="p-6 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-all duration-200 border border-slate-200/50">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h4 className="font-semibold text-slate-800 mb-2">{task.title}</h4>
                  <div className="flex items-center gap-4 text-sm text-slate-600">
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
                      <span>{task.dueTime} ({task.shift})</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <span className={`px-3 py-1 rounded-xl text-sm font-semibold border ${getStatusColor(task.status)}`}>
                    {task.status}
                  </span>
                  <span className={`px-3 py-1 rounded-xl text-sm font-semibold border ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}