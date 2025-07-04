export default function TechniciansStatus() {
  const technicians = [
    { 
      id: 1, 
      name: "Jan Kowalski", 
      shift: "Dzienna", 
      status: "active", 
      location: "Hala A", 
      currentTask: "Naprawa oświetlenia",
      tasksCompleted: 3,
      tasksTotal: 5
    },
    { 
      id: 2, 
      name: "Anna Nowak", 
      shift: "Dzienna", 
      status: "break", 
      location: "Biuro", 
      currentTask: "Przerwa",
      tasksCompleted: 2,
      tasksTotal: 3
    },
    { 
      id: 3, 
      name: "Piotr Wiśniewski", 
      shift: "Dzienna", 
      status: "active", 
      location: "Parking", 
      currentTask: "Kontrola bram",
      tasksCompleted: 1,
      tasksTotal: 4
    },
    { 
      id: 4, 
      name: "Marek Zieliński", 
      shift: "Nocna", 
      status: "inactive", 
      location: "-", 
      currentTask: "Oczekuje na zmianę",
      tasksCompleted: 0,
      tasksTotal: 2
    }
  ];

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

  return (
    <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl shadow-xl p-8">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
          <span className="text-white text-xl">👷</span>
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-800">Status techników</h3>
          <p className="text-slate-600">Aktualny status wszystkich techników</p>
        </div>
      </div>

      <div className="space-y-4">
        {technicians.map((tech) => (
          <div key={tech.id} className="p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-all duration-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-white font-bold">
                  {tech.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div className="font-semibold text-slate-800">{tech.name}</div>
                  <div className="text-sm text-slate-600">Zmiana {tech.shift}</div>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-xl text-sm font-semibold border ${getStatusColor(tech.status)}`}>
                {getStatusLabel(tech.status)}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-slate-500">Lokalizacja:</div>
                <div className="font-medium text-slate-800">{tech.location}</div>
              </div>
              <div>
                <div className="text-slate-500">Bieżące zadanie:</div>
                <div className="font-medium text-slate-800">{tech.currentTask}</div>
              </div>
            </div>

            <div className="mt-3">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-600">Postęp zadań</span>
                <span className="font-semibold text-slate-800">{tech.tasksCompleted}/{tech.tasksTotal}</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-emerald-500 to-teal-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(tech.tasksCompleted / tech.tasksTotal) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}