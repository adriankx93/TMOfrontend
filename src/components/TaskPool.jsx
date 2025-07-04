export default function TaskPool() {
  const poolTasks = [
    {
      id: 5,
      title: "Kalibracja czujników temperatury",
      originalAssignee: "Jan Kowalski",
      priority: "Wysoki",
      originalDueTime: "10:00",
      location: "Magazyn C",
      shift: "Dzienna",
      reason: "Nie wykonane w terminie",
      addedToPool: "2025-01-15 10:30"
    },
    {
      id: 6,
      title: "Sprawdzenie systemu przeciwpożarowego",
      originalAssignee: "Anna Nowak",
      priority: "Średni",
      originalDueTime: "15:00",
      location: "Cały obiekt",
      shift: "Dzienna", 
      reason: "Technik niedostępny",
      addedToPool: "2025-01-15 15:15"
    },
    {
      id: 7,
      title: "Wymiana żarówek w korytarzach",
      originalAssignee: "Piotr Wiśniewski",
      priority: "Niski",
      originalDueTime: "13:00",
      location: "Korytarze A-C",
      shift: "Dzienna",
      reason: "Brak materiałów",
      addedToPool: "2025-01-15 13:30"
    }
  ];

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
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-white text-xl">🔄</span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-800">Pula zadań do wykonania</h3>
            <p className="text-slate-600">Zadania oczekujące na przypisanie do technika</p>
          </div>
        </div>
        
        <div className="text-sm text-slate-600 bg-slate-100 px-4 py-2 rounded-xl">
          {poolTasks.length} zadań w puli
        </div>
      </div>

      <div className="space-y-4">
        {poolTasks.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold text-slate-600 mb-2">Pula jest pusta</h3>
            <p className="text-slate-500">Wszystkie zadania są przypisane do techników.</p>
          </div>
        ) : (
          poolTasks.map((task) => (
            <div key={task.id} className="p-6 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200 hover:shadow-lg transition-all duration-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-semibold text-slate-800">{task.title}</h4>
                    <span className={`px-3 py-1 rounded-xl text-sm font-semibold border ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm text-slate-600 mb-3">
                    <div className="flex items-center gap-2">
                      <span>📍</span>
                      <span>{task.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>🕐</span>
                      <span>Pierwotnie: {task.originalDueTime} ({task.shift})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>👤</span>
                      <span>Pierwotnie: {task.originalAssignee}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>📅</span>
                      <span>W puli od: {new Date(task.addedToPool).toLocaleString('pl-PL')}</span>
                    </div>
                  </div>

                  <div className="p-3 bg-amber-100 rounded-xl border border-amber-200">
                    <div className="text-sm font-medium text-amber-800 mb-1">Powód przeniesienia do puli:</div>
                    <div className="text-sm text-amber-700">{task.reason}</div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t border-amber-200">
                <button className="px-4 py-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-all duration-200 font-medium">
                  Przypisz technika
                </button>
                <button className="px-4 py-2 bg-blue-100 text-blue-800 rounded-xl hover:bg-blue-200 transition-all duration-200 font-medium">
                  Zmień priorytet
                </button>
                <button className="px-4 py-2 bg-slate-100 text-slate-800 rounded-xl hover:bg-slate-200 transition-all duration-200 font-medium">
                  Szczegóły
                </button>
                <button className="px-4 py-2 bg-red-100 text-red-800 rounded-xl hover:bg-red-200 transition-all duration-200 font-medium">
                  Usuń
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {poolTasks.length > 0 && (
        <div className="mt-6 p-4 bg-blue-50 rounded-2xl border border-blue-200">
          <div className="flex items-center gap-3">
            <span className="text-blue-600 text-xl">💡</span>
            <div className="text-sm text-blue-800">
              <div className="font-semibold mb-1">Wskazówka:</div>
              <div>Zadania w puli można automatycznie przypisać do dostępnych techników lub przenieść na następną zmianę.</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}