export default function ShiftSchedule() {
  const currentDate = new Date();
  const currentHour = currentDate.getHours();
  const isDay = currentHour >= 7 && currentHour < 19;

  const shifts = [
    {
      type: "Dzienna",
      time: "07:00 - 19:00",
      icon: "☀️",
      color: "from-yellow-400 to-orange-500",
      active: isDay,
      technicians: [
        { name: "Jan Kowalski", specialization: "Elektryka", tasks: 3 },
        { name: "Anna Nowak", specialization: "HVAC", tasks: 2 },
        { name: "Piotr Wiśniewski", specialization: "Mechanika", tasks: 1 }
      ]
    },
    {
      type: "Nocna", 
      time: "19:00 - 07:00",
      icon: "🌙",
      color: "from-blue-500 to-indigo-600",
      active: !isDay,
      technicians: [
        { name: "Marek Zieliński", specialization: "Elektronika", tasks: 2 },
        { name: "Katarzyna Lewandowska", specialization: "HVAC", tasks: 1 },
        { name: "Tomasz Dąbrowski", specialization: "Elektryka", tasks: 0 }
      ]
    }
  ];

  const weekDays = ['Pon', 'Wt', 'Śr', 'Czw', 'Pt', 'Sob', 'Nie'];
  const today = currentDate.getDay() === 0 ? 6 : currentDate.getDay() - 1; // Konwersja na indeks 0-6 gdzie 0=Pon

  return (
    <div className="space-y-8">
      {/* Current Shifts Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {shifts.map((shift) => (
          <div key={shift.type} className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl shadow-xl p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${shift.color} rounded-2xl flex items-center justify-center shadow-lg`}>
                  <span className="text-white text-xl">{shift.icon}</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800">Zmiana {shift.type}</h3>
                  <p className="text-slate-600">{shift.time}</p>
                </div>
              </div>
              
              <div className={`px-4 py-2 rounded-xl font-semibold ${
                shift.active 
                  ? 'bg-emerald-100 text-emerald-800' 
                  : 'bg-slate-100 text-slate-600'
              }`}>
                {shift.active ? 'Aktywna' : 'Nieaktywna'}
              </div>
            </div>

            <div className="space-y-3">
              {shift.technicians.map((tech, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {tech.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-800">{tech.name}</div>
                      <div className="text-sm text-slate-600">{tech.specialization}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-slate-800">{tech.tasks}</div>
                    <div className="text-sm text-slate-600">zadań</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Weekly Schedule */}
      <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl shadow-xl p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-white text-xl">📅</span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-800">Harmonogram tygodniowy</h3>
            <p className="text-slate-600">Plan zmian na bieżący tydzień</p>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-4">
          {weekDays.map((day, index) => (
            <div key={day} className={`p-4 rounded-2xl border-2 transition-all duration-200 ${
              index === today 
                ? 'bg-orange-50 border-orange-200' 
                : 'bg-slate-50 border-slate-200'
            }`}>
              <div className={`text-center font-bold mb-3 ${
                index === today ? 'text-orange-800' : 'text-slate-800'
              }`}>
                {day}
              </div>
              
              <div className="space-y-2">
                <div className="text-xs bg-yellow-100 text-yellow-800 p-2 rounded-lg text-center">
                  <div className="font-semibold">Dzienna</div>
                  <div>3 techników</div>
                </div>
                <div className="text-xs bg-blue-100 text-blue-800 p-2 rounded-lg text-center">
                  <div className="font-semibold">Nocna</div>
                  <div>3 techników</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Shift Statistics */}
      <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl shadow-xl p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-white text-xl">📊</span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-800">Statystyki zmian</h3>
            <p className="text-slate-600">Wydajność i efektywność pracy</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-slate-50 rounded-2xl">
            <div className="text-3xl font-bold text-orange-600 mb-2">87%</div>
            <div className="text-slate-600 font-medium">Średnia efektywność</div>
          </div>
          <div className="text-center p-6 bg-slate-50 rounded-2xl">
            <div className="text-3xl font-bold text-emerald-600 mb-2">24</div>
            <div className="text-slate-600 font-medium">Zadania wykonane dziś</div>
          </div>
          <div className="text-center p-6 bg-slate-50 rounded-2xl">
            <div className="text-3xl font-bold text-blue-600 mb-2">2.5h</div>
            <div className="text-slate-600 font-medium">Średni czas zadania</div>
          </div>
        </div>
      </div>
    </div>
  );
}