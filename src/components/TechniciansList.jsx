export default function TechniciansList() {
  const technicians = [
    {
      id: 1,
      name: "Jan Kowalski",
      email: "jan.kowalski@orange.pl",
      phone: "+48 123 456 789",
      shift: "Dzienna",
      status: "active",
      specialization: "Elektryka",
      currentTasks: 3,
      completedToday: 2,
      location: "Hala A",
      lastActivity: "5 min temu"
    },
    {
      id: 2,
      name: "Anna Nowak",
      email: "anna.nowak@orange.pl", 
      phone: "+48 234 567 890",
      shift: "Dzienna",
      status: "break",
      specialization: "HVAC",
      currentTasks: 2,
      completedToday: 1,
      location: "Biuro",
      lastActivity: "15 min temu"
    },
    {
      id: 3,
      name: "Piotr Wiśniewski",
      email: "piotr.wisniewski@orange.pl",
      phone: "+48 345 678 901",
      shift: "Dzienna", 
      status: "active",
      specialization: "Mechanika",
      currentTasks: 1,
      completedToday: 3,
      location: "Parking",
      lastActivity: "2 min temu"
    },
    {
      id: 4,
      name: "Marek Zieliński",
      email: "marek.zielinski@orange.pl",
      phone: "+48 456 789 012",
      shift: "Nocna",
      status: "inactive",
      specialization: "Elektronika",
      currentTasks: 0,
      completedToday: 0,
      location: "-",
      lastActivity: "2 godz. temu"
    },
    {
      id: 5,
      name: "Katarzyna Lewandowska",
      email: "katarzyna.lewandowska@orange.pl",
      phone: "+48 567 890 123",
      shift: "Nocna",
      status: "inactive",
      specialization: "HVAC",
      currentTasks: 0,
      completedToday: 0,
      location: "-",
      lastActivity: "3 godz. temu"
    },
    {
      id: 6,
      name: "Tomasz Dąbrowski",
      email: "tomasz.dabrowski@orange.pl",
      phone: "+48 678 901 234",
      shift: "Nocna",
      status: "inactive",
      specialization: "Elektryka",
      currentTasks: 0,
      completedToday: 0,
      location: "-",
      lastActivity: "4 godz. temu"
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

  const getSpecializationIcon = (specialization) => {
    switch(specialization) {
      case 'Elektryka': return '⚡';
      case 'HVAC': return '🌡️';
      case 'Mechanika': return '🔧';
      case 'Elektronika': return '💻';
      default: return '🛠️';
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl shadow-xl overflow-hidden">
      <div className="bg-gradient-to-r from-slate-50 to-orange-50 px-8 py-6 border-b border-slate-200/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-white text-xl">👷</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                Lista techników
              </h2>
              <p className="text-slate-500 font-medium">
                Zarządzaj zespołem techników Miasteczka Orange
              </p>
            </div>
          </div>
          
          <button className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200">
            + Dodaj technika
          </button>
        </div>
      </div>

      <div className="p-8">
        <div className="grid gap-6">
          {technicians.map((tech) => (
            <div key={tech.id} className="p-6 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-all duration-200 border border-slate-200/50">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    {tech.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-800">{tech.name}</h3>
                    <div className="flex items-center gap-4 text-sm text-slate-600 mt-1">
                      <div className="flex items-center gap-2">
                        <span>{getSpecializationIcon(tech.specialization)}</span>
                        <span>{tech.specialization}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>🕐</span>
                        <span>Zmiana {tech.shift}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>📧</span>
                        <span>{tech.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>📞</span>
                        <span>{tech.phone}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <span className={`px-4 py-2 rounded-xl text-sm font-semibold border ${getStatusColor(tech.status)}`}>
                  {getStatusLabel(tech.status)}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-4">
                <div className="text-center p-4 bg-white rounded-xl border border-slate-200">
                  <div className="text-2xl font-bold text-orange-600">{tech.currentTasks}</div>
                  <div className="text-sm text-slate-600">Bieżące zadania</div>
                </div>
                <div className="text-center p-4 bg-white rounded-xl border border-slate-200">
                  <div className="text-2xl font-bold text-emerald-600">{tech.completedToday}</div>
                  <div className="text-sm text-slate-600">Wykonane dziś</div>
                </div>
                <div className="text-center p-4 bg-white rounded-xl border border-slate-200">
                  <div className="text-lg font-bold text-blue-600">{tech.location}</div>
                  <div className="text-sm text-slate-600">Lokalizacja</div>
                </div>
                <div className="text-center p-4 bg-white rounded-xl border border-slate-200">
                  <div className="text-sm font-bold text-slate-600">{tech.lastActivity}</div>
                  <div className="text-sm text-slate-600">Ostatnia aktywność</div>
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t border-slate-200">
                <button className="px-4 py-2 bg-orange-100 text-orange-800 rounded-xl hover:bg-orange-200 transition-all duration-200 font-medium">
                  Przypisz zadanie
                </button>
                <button className="px-4 py-2 bg-blue-100 text-blue-800 rounded-xl hover:bg-blue-200 transition-all duration-200 font-medium">
                  Zobacz zadania
                </button>
                <button className="px-4 py-2 bg-slate-100 text-slate-800 rounded-xl hover:bg-slate-200 transition-all duration-200 font-medium">
                  Edytuj profil
                </button>
                <button className="px-4 py-2 bg-emerald-100 text-emerald-800 rounded-xl hover:bg-emerald-200 transition-all duration-200 font-medium">
                  Kontakt
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}