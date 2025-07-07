import { useState, useEffect } from "react";
import Topbar from "../components/Topbar";
import { sheetsService } from "../services/sheetsService";

export default function TechniciansPage() {
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState("all");
  const [viewMode, setViewMode] = useState("grid"); // grid, list, cards
  const [sortBy, setSortBy] = useState("name"); // name, specialization, workload
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [selectedTechnician, setSelectedTechnician] = useState(null);

  useEffect(() => {
    fetchTechnicians();
    const interval = setInterval(fetchTechnicians, 30000); // Odświeżaj co 30 sekund
    return () => clearInterval(interval);
  }, []);

  const fetchTechnicians = async () => {
    try {
      setLoading(true);
      const data = await sheetsService.getCurrentMonthData();
      
      // Wzbogać dane techników o dodatkowe informacje
      const enrichedTechnicians = data.technicians.map((tech, index) => ({
        ...tech,
        isOnline: Math.random() > 0.3, // Symulacja statusu online
        currentTask: getRandomTask(),
        efficiency: Math.floor(Math.random() * 30) + 70, // 70-100%
        tasksCompleted: Math.floor(Math.random() * 50) + 10,
        avatar: generateAvatar(tech.fullName),
        lastSeen: new Date(Date.now() - Math.random() * 3600000).toISOString(), // Ostatnie 1h
        location: getRandomLocation(),
        skills: getRandomSkills(tech.specialization),
        experience: Math.floor(Math.random() * 15) + 1, // 1-15 lat
        rating: (Math.random() * 2 + 3).toFixed(1), // 3.0-5.0
        phone: `+48 ${Math.floor(Math.random() * 900000000) + 100000000}`,
        email: `${tech.fullName.toLowerCase().replace(' ', '.')}.@orange.pl`
      }));

      setTechnicians(enrichedTechnicians);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getRandomTask = () => {
    const tasks = [
      "Naprawa klimatyzacji",
      "Kontrola oświetlenia",
      "Wymiana filtrów",
      "Przegląd systemu",
      "Konserwacja wind",
      "Sprawdzenie alarmów",
      "Dostępny",
      "Przerwa"
    ];
    return tasks[Math.floor(Math.random() * tasks.length)];
  };

  const getRandomLocation = () => {
    const locations = [
      "Budynek A - Parter",
      "Budynek B - 2 piętro", 
      "Budynek C - Dach",
      "Garaż -1",
      "Centrum danych",
      "Biuro administracyjne",
      "W terenie"
    ];
    return locations[Math.floor(Math.random() * locations.length)];
  };

  const getRandomSkills = (specialization) => {
    const skillSets = {
      "Elektryka": ["Instalacje elektryczne", "Automatyka", "Pomiary", "BMS"],
      "HVAC": ["Klimatyzacja", "Wentylacja", "Chłodnictwo", "Sterowanie"],
      "Mechanika": ["Naprawy", "Konserwacja", "Spawanie", "Hydraulika"],
      "Elektronika": ["Systemy IT", "Sieci", "Monitoring", "Telekomunikacja"],
      "Sprzątanie": ["Czyszczenie", "Dezynfekcja", "Utrzymanie", "Ekologia"],
      "Bezpieczeństwo": ["Monitoring", "Kontrola dostępu", "Alarmy", "Procedury"]
    };
    const skills = skillSets[specialization] || ["Ogólne", "Podstawowe"];
    return skills.slice(0, Math.floor(Math.random() * 3) + 2);
  };

  const generateAvatar = (name) => {
    const colors = [
      "from-blue-400 to-blue-600",
      "from-green-400 to-green-600", 
      "from-purple-400 to-purple-600",
      "from-orange-400 to-orange-600",
      "from-pink-400 to-pink-600",
      "from-indigo-400 to-indigo-600"
    ];
    return colors[name.length % colors.length];
  };

  const getSpecializations = () => {
    return [...new Set(technicians.map(t => t.specialization))];
  };

  const filteredTechnicians = technicians
    .filter(tech => {
      const matchesSearch = tech.fullName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSpecialization = selectedSpecialization === "all" || tech.specialization === selectedSpecialization;
      const matchesOnline = !showOnlineOnly || tech.isOnline;
      return matchesSearch && matchesSpecialization && matchesOnline;
    })
    .sort((a, b) => {
      switch(sortBy) {
        case "name":
          return a.fullName.localeCompare(b.fullName);
        case "specialization":
          return a.specialization.localeCompare(b.specialization);
        case "workload":
          return b.tasksCompleted - a.tasksCompleted;
        case "efficiency":
          return b.efficiency - a.efficiency;
        default:
          return 0;
      }
    });

  const getSpecializationIcon = (specialization) => {
    const icons = {
      "Elektryka": "⚡",
      "HVAC": "🌡️", 
      "Mechanika": "🔧",
      "Elektronika": "💻",
      "Sprzątanie": "🧹",
      "Bezpieczeństwo": "🛡️"
    };
    return icons[specialization] || "🛠️";
  };

  const onlineCount = technicians.filter(t => t.isOnline).length;
  const avgEfficiency = technicians.length > 0 
    ? Math.round(technicians.reduce((sum, t) => sum + t.efficiency, 0) / technicians.length)
    : 0;

  if (loading) {
    return (
      <div className="space-y-8 animate-fade-in">
        <Topbar title="Zespół techniczny" subtitle="Ładowanie danych..." />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-slate-300">Pobieranie danych z arkusza...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8 animate-fade-in">
        <Topbar title="Zespół techniczny" subtitle="Błąd wczytywania" />
        <div className="glass-card p-12 text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-semibold text-red-400 mb-2">Błąd wczytywania danych</h3>
          <p className="text-slate-400 mb-6">{error}</p>
          <button onClick={fetchTechnicians} className="btn-primary">
            Spróbuj ponownie
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <Topbar 
        title="Zespół techniczny" 
        subtitle={`${technicians.length} techników • ${onlineCount} online • Średnia wydajność: ${avgEfficiency}%`}
        action={
          <button 
            onClick={fetchTechnicians}
            className="btn-primary flex items-center gap-2"
          >
            <span>🔄</span>
            <span>Odśwież dane</span>
          </button>
        }
      />

      {/* Live Stats Dashboard */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="glass-card p-6 text-center">
          <div className="text-3xl font-bold text-emerald-400 mb-2">{technicians.length}</div>
          <div className="text-slate-300 font-medium">Łącznie techników</div>
          <div className="text-xs text-slate-500 mt-1">Z arkusza Google</div>
        </div>
        
        <div className="glass-card p-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <div className="text-3xl font-bold text-green-400">{onlineCount}</div>
          </div>
          <div className="text-slate-300 font-medium">Online teraz</div>
          <div className="text-xs text-slate-500 mt-1">Aktywni w systemie</div>
        </div>
        
        <div className="glass-card p-6 text-center">
          <div className="text-3xl font-bold text-blue-400 mb-2">{avgEfficiency}%</div>
          <div className="text-slate-300 font-medium">Średnia wydajność</div>
          <div className="text-xs text-slate-500 mt-1">Zespołu technicznego</div>
        </div>
        
        <div className="glass-card p-6 text-center">
          <div className="text-3xl font-bold text-purple-400 mb-2">{getSpecializations().length}</div>
          <div className="text-slate-300 font-medium">Specjalizacji</div>
          <div className="text-xs text-slate-500 mt-1">Różnych dziedzin</div>
        </div>
      </div>

      {/* Advanced Filters & Controls */}
      <div className="glass-card p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Szukaj technika..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10 w-full"
            />
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">🔍</span>
          </div>

          {/* Specialization Filter */}
          <select
            value={selectedSpecialization}
            onChange={(e) => setSelectedSpecialization(e.target.value)}
            className="input-field"
          >
            <option value="all">Wszystkie specjalizacje</option>
            {getSpecializations().map(spec => (
              <option key={spec} value={spec}>
                {getSpecializationIcon(spec)} {spec}
              </option>
            ))}
          </select>

          {/* Sort Options */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="input-field"
          >
            <option value="name">Sortuj: Imię</option>
            <option value="specialization">Sortuj: Specjalizacja</option>
            <option value="workload">Sortuj: Zadania</option>
            <option value="efficiency">Sortuj: Wydajność</option>
          </select>

          {/* View Mode & Filters */}
          <div className="flex gap-2">
            <button
              onClick={() => setShowOnlineOnly(!showOnlineOnly)}
              className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                showOnlineOnly 
                  ? 'bg-green-500/20 text-green-400' 
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              {showOnlineOnly ? '🟢' : '⚪'} Online
            </button>
            
            <div className="flex rounded-xl bg-slate-700 p-1">
              {['grid', 'list'].map(mode => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 ${
                    viewMode === mode 
                      ? 'bg-orange-500 text-white' 
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {mode === 'grid' ? '⊞' : '☰'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Technicians Display */}
      {filteredTechnicians.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <div className="text-6xl mb-4">👥</div>
          <h3 className="text-xl font-semibold text-slate-300 mb-2">Brak wyników</h3>
          <p className="text-slate-500">Spróbuj zmienić filtry wyszukiwania</p>
        </div>
      ) : (
        <div className={`${
          viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
            : 'space-y-4'
        }`}>
          {filteredTechnicians.map((tech) => (
            <div 
              key={tech.id}
              className={`glass-card p-6 hover:bg-slate-700/50 transition-all duration-300 cursor-pointer group ${
                viewMode === 'list' ? 'flex items-center gap-6' : ''
              }`}
              onClick={() => setSelectedTechnician(tech)}
            >
              {/* Avatar & Status */}
              <div className="relative">
                <div className={`w-16 h-16 bg-gradient-to-br ${tech.avatar} rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  {tech.fullName.split(' ').map(n => n[0]).join('')}
                </div>
                <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-slate-800 ${
                  tech.isOnline ? 'bg-green-400' : 'bg-gray-400'
                }`}></div>
              </div>

              {/* Info */}
              <div className={`${viewMode === 'list' ? 'flex-1' : 'mt-4'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-bold text-white group-hover:text-orange-400 transition-colors duration-200">
                    {tech.fullName}
                  </h3>
                  <span className="text-lg">{getSpecializationIcon(tech.specialization)}</span>
                </div>
                
                <div className="text-sm text-slate-400 mb-3">
                  {tech.specialization} • {tech.experience} lat doświadczenia
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Status:</span>
                    <span className={`font-medium ${tech.isOnline ? 'text-green-400' : 'text-gray-400'}`}>
                      {tech.currentTask}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Lokalizacja:</span>
                    <span className="text-slate-300">{tech.location}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Wydajność:</span>
                    <span className="text-orange-400 font-bold">{tech.efficiency}%</span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Ocena:</span>
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-400">⭐</span>
                      <span className="text-slate-300">{tech.rating}</span>
                    </div>
                  </div>
                </div>

                {/* Skills Tags */}
                <div className="flex flex-wrap gap-1 mt-3">
                  {tech.skills.slice(0, 3).map((skill, idx) => (
                    <span key={idx} className="px-2 py-1 bg-slate-700/50 text-slate-300 rounded-lg text-xs">
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Quick Actions */}
                <div className="flex gap-2 mt-4">
                  <button className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-lg text-xs hover:bg-blue-500/30 transition-colors">
                    📞 Kontakt
                  </button>
                  <button className="px-3 py-1 bg-green-500/20 text-green-400 rounded-lg text-xs hover:bg-green-500/30 transition-colors">
                    📋 Zadania
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detailed Modal */}
      {selectedTechnician && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass-card max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className={`w-20 h-20 bg-gradient-to-br ${selectedTechnician.avatar} rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg`}>
                    {selectedTechnician.fullName.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">{selectedTechnician.fullName}</h2>
                    <p className="text-slate-400 flex items-center gap-2">
                      <span>{getSpecializationIcon(selectedTechnician.specialization)}</span>
                      {selectedTechnician.specialization}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedTechnician(null)}
                  className="p-2 hover:bg-slate-700/50 rounded-xl transition-all duration-200"
                >
                  <span className="text-2xl text-slate-400 hover:text-white">×</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="glass-card-light p-4">
                    <h4 className="font-semibold text-white mb-3">Informacje kontaktowe</h4>
                    <div className="space-y-2 text-sm">
                      <div>📧 {selectedTechnician.email}</div>
                      <div>📞 {selectedTechnician.phone}</div>
                      <div>📍 {selectedTechnician.location}</div>
                    </div>
                  </div>

                  <div className="glass-card-light p-4">
                    <h4 className="font-semibold text-white mb-3">Umiejętności</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedTechnician.skills.map((skill, idx) => (
                        <span key={idx} className="px-3 py-1 bg-orange-500/20 text-orange-400 rounded-xl text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="glass-card-light p-4">
                    <h4 className="font-semibold text-white mb-3">Statystyki</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Doświadczenie:</span>
                        <span className="text-white">{selectedTechnician.experience} lat</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Zadania wykonane:</span>
                        <span className="text-white">{selectedTechnician.tasksCompleted}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Wydajność:</span>
                        <span className="text-orange-400 font-bold">{selectedTechnician.efficiency}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Ocena:</span>
                        <span className="text-yellow-400">⭐ {selectedTechnician.rating}</span>
                      </div>
                    </div>
                  </div>

                  <div className="glass-card-light p-4">
                    <h4 className="font-semibold text-white mb-3">Status aktualny</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${selectedTechnician.isOnline ? 'bg-green-400' : 'bg-gray-400'}`}></div>
                        <span className="text-white">{selectedTechnician.isOnline ? 'Online' : 'Offline'}</span>
                      </div>
                      <div className="text-sm text-slate-400">
                        Aktualnie: {selectedTechnician.currentTask}
                      </div>
                      <div className="text-sm text-slate-400">
                        Ostatnio widziany: {new Date(selectedTechnician.lastSeen).toLocaleString('pl-PL')}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-6 border-t border-slate-600 mt-6">
                <button className="btn-primary flex-1">
                  📞 Zadzwoń
                </button>
                <button className="btn-secondary flex-1">
                  📧 Wyślij email
                </button>
                <button className="btn-secondary flex-1">
                  📋 Przypisz zadanie
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Real-time Activity Feed */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-bold text-white mb-4">Aktywność w czasie rzeczywistym</h3>
        <div className="space-y-3 max-h-40 overflow-y-auto">
          {technicians.filter(t => t.isOnline).slice(0, 5).map((tech, idx) => (
            <div key={idx} className="flex items-center gap-3 text-sm">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-slate-300">{tech.fullName}</span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-400">{tech.currentTask}</span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-500">{tech.location}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}