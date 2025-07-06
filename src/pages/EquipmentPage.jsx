import { useState } from "react";
import Topbar from "../components/Topbar";

export default function EquipmentPage() {
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);

  const keyEquipment = [
    {
      id: "ahu1",
      name: "Centrala wentylacyjna AHU1",
      type: "HVAC",
      location: "Budynek A - Dach",
      status: "operational",
      lastMaintenance: "2024-01-15",
      nextMaintenance: "2024-04-15",
      components: [
        { name: "Pasek napędowy", lastChanged: "2024-01-15", nextChange: "2024-07-15" },
        { name: "Filtry powietrza", lastChanged: "2024-01-10", nextChange: "2024-04-10" },
        { name: "Elementy elektryczne", lastChanged: "2023-12-20", nextChange: "2024-12-20" }
      ],
      externalInspections: [
        { company: "HVAC Service Sp. z o.o.", type: "Przegląd roczny", nextDate: "2024-06-15" },
        { company: "Elektro-Serwis", type: "Przegląd elektryczny", nextDate: "2024-08-20" }
      ]
    },
    {
      id: "ahu2",
      name: "Centrala wentylacyjna AHU2",
      type: "HVAC",
      location: "Budynek B - Dach",
      status: "maintenance",
      lastMaintenance: "2024-01-20",
      nextMaintenance: "2024-04-20",
      components: [
        { name: "Pasek napędowy", lastChanged: "2024-01-20", nextChange: "2024-07-20" },
        { name: "Filtry powietrza", lastChanged: "2024-01-15", nextChange: "2024-04-15" },
        { name: "Elementy elektryczne", lastChanged: "2023-12-25", nextChange: "2024-12-25" }
      ],
      externalInspections: [
        { company: "HVAC Service Sp. z o.o.", type: "Przegląd roczny", nextDate: "2024-07-20" }
      ]
    },
    {
      id: "chiller1",
      name: "Agregat chłodniczy CHILLER1",
      type: "HVAC",
      location: "Budynek C - Dach",
      status: "operational",
      lastMaintenance: "2024-01-10",
      nextMaintenance: "2024-07-10",
      components: [
        { name: "Kompresory", lastChanged: "2023-06-15", nextChange: "2025-06-15" },
        { name: "Wymienniki ciepła", lastChanged: "2024-01-10", nextChange: "2024-07-10" },
        { name: "Układ sterowania", lastChanged: "2023-12-01", nextChange: "2024-12-01" }
      ],
      externalInspections: [
        { company: "Cooling Systems Ltd.", type: "Przegląd specjalistyczny", nextDate: "2024-05-15" }
      ]
    }
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'operational': return 'bg-emerald-500/20 text-emerald-400';
      case 'maintenance': return 'bg-amber-500/20 text-amber-400';
      case 'broken': return 'bg-red-500/20 text-red-400';
      default: return 'bg-slate-500/20 text-slate-400';
    }
  };

  const getStatusLabel = (status) => {
    switch(status) {
      case 'operational': return 'Sprawne';
      case 'maintenance': return 'Konserwacja';
      case 'broken': return 'Uszkodzone';
      default: return 'Nieznany';
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <Topbar 
        title="Kluczowe urządzenia" 
        subtitle="Zarządzanie sprzętem, konserwacją i przeglądami"
        action={
          <button className="btn-primary flex items-center gap-2">
            <span>⚙️</span>
            <span>Dodaj urządzenie</span>
          </button>
        }
      />

      {/* Equipment Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="metric-card">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <span className="text-2xl">⚙️</span>
            </div>
            <div className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm font-bold">
              {keyEquipment.length}
            </div>
          </div>
          <h3 className="text-lg font-semibold text-white mb-1">Urządzenia</h3>
          <p className="text-slate-400 text-sm">Kluczowy sprzęt</p>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
              <span className="text-2xl">✅</span>
            </div>
            <div className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-sm font-bold">
              {keyEquipment.filter(eq => eq.status === 'operational').length}
            </div>
          </div>
          <h3 className="text-lg font-semibold text-white mb-1">Sprawne</h3>
          <p className="text-slate-400 text-sm">Gotowe do pracy</p>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center">
              <span className="text-2xl">🔧</span>
            </div>
            <div className="px-3 py-1 bg-amber-500/20 text-amber-400 rounded-full text-sm font-bold">
              {keyEquipment.filter(eq => eq.status === 'maintenance').length}
            </div>
          </div>
          <h3 className="text-lg font-semibold text-white mb-1">Konserwacja</h3>
          <p className="text-slate-400 text-sm">W trakcie serwisu</p>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
              <span className="text-2xl">📅</span>
            </div>
            <div className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm font-bold">
              5
            </div>
          </div>
          <h3 className="text-lg font-semibold text-white mb-1">Przeglądy</h3>
          <p className="text-slate-400 text-sm">Zaplanowane na miesiąc</p>
        </div>
      </div>

      {/* Equipment Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {keyEquipment.map((equipment) => (
          <div 
            key={equipment.id}
            className="glass-card p-6 hover:bg-slate-700/50 transition-all duration-300 cursor-pointer"
            onClick={() => setSelectedEquipment(equipment)}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center text-3xl">
                ⚙️
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-white text-lg">{equipment.name}</h3>
                <div className="text-sm text-slate-400">{equipment.location}</div>
              </div>
            </div>

            <div className="space-y-3">
              <div className={`px-3 py-2 rounded-xl text-sm font-semibold ${getStatusColor(equipment.status)}`}>
                {getStatusLabel(equipment.status)}
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-slate-400">Ostatnia konserwacja</div>
                  <div className="font-semibold text-white">
                    {new Date(equipment.lastMaintenance).toLocaleDateString('pl-PL')}
                  </div>
                </div>
                <div>
                  <div className="text-slate-400">Następna konserwacja</div>
                  <div className="font-semibold text-white">
                    {new Date(equipment.nextMaintenance).toLocaleDateString('pl-PL')}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-600">
                <div className="text-sm text-slate-400 mb-2">Komponenty:</div>
                <div className="text-sm text-slate-300">
                  {equipment.components.length} elementów do wymiany
                </div>
              </div>

              <div className="text-sm text-slate-400">
                Przeglądy zewnętrzne: {equipment.externalInspections.length}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Equipment Details Modal */}
      {selectedEquipment && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass-card max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center text-3xl">
                    ⚙️
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">{selectedEquipment.name}</h2>
                    <p className="text-slate-400">{selectedEquipment.location}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedEquipment(null)}
                  className="p-2 hover:bg-slate-700/50 rounded-xl transition-all duration-200"
                >
                  <span className="text-2xl text-slate-400 hover:text-white">×</span>
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Components */}
                <div>
                  <h3 className="text-lg font-bold text-white mb-4">Komponenty do wymiany</h3>
                  <div className="space-y-3">
                    {selectedEquipment.components.map((component, index) => (
                      <div key={index} className="glass-card-light p-4">
                        <div className="font-semibold text-white mb-2">{component.name}</div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <div className="text-slate-400">Ostatnia wymiana</div>
                            <div className="text-slate-300">
                              {new Date(component.lastChanged).toLocaleDateString('pl-PL')}
                            </div>
                          </div>
                          <div>
                            <div className="text-slate-400">Następna wymiana</div>
                            <div className="text-slate-300">
                              {new Date(component.nextChange).toLocaleDateString('pl-PL')}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* External Inspections */}
                <div>
                  <h3 className="text-lg font-bold text-white mb-4">Przeglądy zewnętrzne</h3>
                  <div className="space-y-3">
                    {selectedEquipment.externalInspections.map((inspection, index) => (
                      <div key={index} className="glass-card-light p-4">
                        <div className="font-semibold text-white mb-2">{inspection.type}</div>
                        <div className="text-sm text-slate-400 mb-2">{inspection.company}</div>
                        <div className="text-sm">
                          <span className="text-slate-400">Następny przegląd: </span>
                          <span className="text-slate-300 font-semibold">
                            {new Date(inspection.nextDate).toLocaleDateString('pl-PL')}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-6 border-t border-slate-600 mt-8">
                <button className="btn-primary">
                  Zaplanuj konserwację
                </button>
                <button className="btn-secondary">
                  Historia serwisu
                </button>
                <button 
                  onClick={() => setSelectedEquipment(null)}
                  className="btn-secondary"
                >
                  Zamknij
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}