import { useState } from "react";
import Topbar from "../components/Topbar";

export default function InspectionsPage() {
  const [activeTab, setActiveTab] = useState("scheduled");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedShift, setSelectedShift] = useState("Dzienna");

  const inspectionTypes = [
    { id: "weekly", name: "Przeglądy tygodniowe", frequency: "Co tydzień", icon: "📅" },
    { id: "monthly", name: "Przeglądy miesięczne", frequency: "Co miesiąc", icon: "🗓️" },
    { id: "quarterly", name: "Przeglądy kwartalne", frequency: "Co kwartał", icon: "📊" },
    { id: "annual", name: "Przeglądy roczne", frequency: "Co rok", icon: "📋" },
    { id: "external", name: "Przeglądy zewnętrzne", frequency: "Według harmonogramu", icon: "🏢" }
  ];

  const tabs = [
    { id: "scheduled", label: "Zaplanowane", icon: "📅", count: 12 },
    { id: "in_progress", label: "W trakcie", icon: "⚡", count: 3 },
    { id: "completed", label: "Zakończone", icon: "✅", count: 28 },
    { id: "overdue", label: "Przeterminowane", icon: "⚠️", count: 2 }
  ];

  const handleAssignInspection = () => {
    if (!selectedDate || !selectedShift) {
      alert("Wybierz datę i zmianę");
      return;
    }
    
    // Logika przypisywania przeglądu do zmiany
    console.log(`Przypisano przegląd na ${selectedDate}, zmiana ${selectedShift}`);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <Topbar 
        title="System przeglądów" 
        subtitle="Zarządzanie przeglądami, inspekcjami i kontrolami"
        action={
          <button 
            onClick={() => setShowCreateModal(true)}
            className="btn-primary flex items-center gap-2"
          >
            <span>🔍</span>
            <span>Nowy przegląd</span>
          </button>
        }
      />

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {tabs.map((tab) => (
          <div key={tab.id} className="metric-card">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <span className="text-2xl">{tab.icon}</span>
              </div>
              <div className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm font-bold">
                {tab.count}
              </div>
            </div>
            <h3 className="text-lg font-semibold text-white mb-1">{tab.label}</h3>
            <p className="text-slate-400 text-sm">Przeglądy w kategorii</p>
          </div>
        ))}
      </div>

      {/* Inspection Types */}
      <div className="glass-card p-8">
        <h3 className="text-xl font-bold text-white mb-6">Typy przeglądów</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {inspectionTypes.map((type) => (
            <div key={type.id} className="glass-card-light p-6 text-center hover:bg-slate-600/30 transition-all duration-200 cursor-pointer">
              <div className="text-3xl mb-3">{type.icon}</div>
              <h4 className="font-semibold text-white mb-2">{type.name}</h4>
              <p className="text-sm text-slate-400">{type.frequency}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Assignment Panel */}
      <div className="glass-card p-8">
        <h3 className="text-xl font-bold text-white mb-6">Przypisz przegląd do wykonania</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-semibold text-slate-200 mb-2">
              Data wykonania
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="input-field w-full"
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-200 mb-2">
              Zmiana
            </label>
            <select
              value={selectedShift}
              onChange={(e) => setSelectedShift(e.target.value)}
              className="input-field w-full"
            >
              <option value="Dzienna">Dzienna (07:00 - 19:00)</option>
              <option value="Nocna">Nocna (19:00 - 07:00)</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={handleAssignInspection}
              className="btn-primary w-full"
            >
              Przypisz do zmiany
            </button>
          </div>
        </div>
      </div>

      {/* Inspection Tabs */}
      <div className="glass-card p-2">
        <div className="flex gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-6 py-4 rounded-xl font-semibold transition-all duration-200 flex-1 ${
                activeTab === tab.id
                  ? "gradient-primary text-white shadow-lg"
                  : "text-slate-400 hover:text-white hover:bg-slate-700/50"
              }`}
            >
              <span className="text-lg">{tab.icon}</span>
              <div className="text-left">
                <div>{tab.label}</div>
                <div className="text-xs opacity-70">{tab.count} przeglądów</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="glass-card p-8">
        <div className="text-center py-12 text-slate-400">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-slate-300 mb-2">System przeglądów</h3>
          <p className="text-slate-500">Funkcjonalność będzie dostępna wkrótce</p>
        </div>
      </div>
    </div>
  );
}