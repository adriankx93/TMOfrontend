export default function ShiftOverview() {
  const currentHour = new Date().getHours();
  const isDay = currentHour >= 7 && currentHour < 19;
  
  const dayShift = {
    name: "Zmiana dzienna",
    time: "07:00 - 19:00",
    technicians: [
      { name: "Jan Kowalski", status: "active", tasks: 3 },
      { name: "Anna Nowak", status: "active", tasks: 2 },
      { name: "Piotr Wiśniewski", status: "break", tasks: 1 }
    ]
  };

  const nightShift = {
    name: "Zmiana nocna", 
    time: "19:00 - 07:00",
    technicians: [
      { name: "Marek Zieliński", status: "active", tasks: 2 },
      { name: "Katarzyna Lewandowska", status: "active", tasks: 1 },
      { name: "Tomasz Dąbrowski", status: "inactive", tasks: 0 }
    ]
  };

  const currentShift = isDay ? dayShift : nightShift;
  const nextShift = isDay ? nightShift : dayShift;

  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return 'bg-emerald-100 text-emerald-800';
      case 'break': return 'bg-amber-100 text-amber-800';
      case 'inactive': return 'bg-slate-100 text-slate-800';
      default: return 'bg-slate-100 text-slate-800';
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
        <div className={`w-12 h-12 bg-gradient-to-br ${isDay ? 'from-yellow-400 to-orange-500' : 'from-blue-500 to-indigo-600'} rounded-2xl flex items-center justify-center shadow-lg`}>
          <span className="text-white text-xl">{isDay ? '☀️' : '🌙'}</span>
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-800">Przegląd zmian</h3>
          <p className="text-slate-600">Status bieżącej i następnej zmiany</p>
        </div>
      </div>

      {/* Current Shift */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="font-bold text-lg text-slate-800">{currentShift.name}</h4>
            <p className="text-slate-600">{currentShift.time}</p>
          </div>
          <div className="px-4 py-2 bg-emerald-100 text-emerald-800 rounded-xl font-semibold">
            Aktywna
          </div>
        </div>

        <div className="space-y-3">
          {currentShift.technicians.map((tech, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  {tech.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div className="font-semibold text-slate-800">{tech.name}</div>
                  <div className="text-sm text-slate-600">{tech.tasks} zadań</div>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-xl text-sm font-semibold ${getStatusColor(tech.status)}`}>
                {getStatusLabel(tech.status)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Next Shift Preview */}
      <div className="border-t border-slate-200 pt-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="font-bold text-lg text-slate-800">{nextShift.name}</h4>
            <p className="text-slate-600">{nextShift.time}</p>
          </div>
          <div className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl font-semibold">
            Następna
          </div>
        </div>

        <div className="text-sm text-slate-600">
          Technicy: {nextShift.technicians.map(t => t.name).join(', ')}
        </div>
      </div>
    </div>
  );
}