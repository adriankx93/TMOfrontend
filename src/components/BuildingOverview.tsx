import React, { useState } from "react";
import { buildingService } from "../services/buildingService";
import { Building, Complex } from "../types/building";

export default function BuildingOverview() {
  const [complex] = useState<Complex>(buildingService.getComplexStructure());
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'technical' | 'equipment'>('overview');

  const getBuildingIcon = (building: Building) => {
    if (building.type === 'garage') return '🚗';
    if (building.code.includes('COMP')) return '🏢';
    if (building.code.includes('BAY')) return '🏭';
    return '🏢';
  };

  const getBuildingColor = (building: Building) => {
    if (building.type === 'garage') return 'from-gray-500 to-slate-600';
    if (building.code.includes('COMP')) return 'from-blue-500 to-indigo-600';
    if (building.code.includes('BAY')) return 'from-green-500 to-emerald-600';
    return 'from-orange-500 to-red-600';
  };

  const getEquipmentStatusColor = (status: string) => {
    switch(status) {
      case 'operational': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'maintenance': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'broken': return 'bg-red-100 text-red-800 border-red-200';
      case 'decommissioned': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getEquipmentStatusLabel = (status: string) => {
    switch(status) {
      case 'operational': return 'Sprawny';
      case 'maintenance': return 'Konserwacja';
      case 'broken': return 'Uszkodzony';
      case 'decommissioned': return 'Wycofany';
      default: return 'Nieznany';
    }
  };

  return (
    <div className="space-y-8">
      {/* Complex Overview */}
      <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl shadow-xl p-8 text-white">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Kompleks Miasteczko Orange</h1>
            <p className="text-blue-100 text-lg">Struktura budynków i infrastruktury</p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold">{complex.buildings.length}</div>
            <div className="text-blue-100">Budynków</div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold">{complex.totalArea.toLocaleString()}</div>
            <div className="text-blue-100">m² powierzchni</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">{complex.totalFloors}</div>
            <div className="text-blue-100">Pięter</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">{complex.totalRooms}</div>
            <div className="text-blue-100">Pomieszczeń</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">{complex.parkingSpaces}</div>
            <div className="text-blue-100">Miejsc parkingowych</div>
          </div>
        </div>
      </div>

      {/* Buildings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {complex.buildings.map((building) => (
          <div 
            key={building.id}
            className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl shadow-xl p-6 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 cursor-pointer"
            onClick={() => setSelectedBuilding(building)}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className={`w-16 h-16 bg-gradient-to-br ${getBuildingColor(building)} rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg`}>
                {getBuildingIcon(building)}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-slate-800">{building.name}</h3>
                <div className="text-sm text-slate-600">{building.description}</div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-slate-500">Powierzchnia</div>
                  <div className="font-semibold">{building.totalArea.toLocaleString()} m²</div>
                </div>
                <div>
                  <div className="text-slate-500">Piętra</div>
                  <div className="font-semibold">{building.floors.length}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-slate-500">Pomieszczenia</div>
                  <div className="font-semibold">
                    {building.floors.reduce((sum, floor) => sum + floor.rooms.length, 0)}
                  </div>
                </div>
                <div>
                  <div className="text-slate-500">Pom. techniczne</div>
                  <div className="font-semibold">{building.technicalRooms.length}</div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200">
                <div className="text-xs text-slate-500 text-center">
                  Kliknij aby zobaczyć szczegóły
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Building Details Modal */}
      {selectedBuilding && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 bg-gradient-to-br ${getBuildingColor(selectedBuilding)} rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg`}>
                    {getBuildingIcon(selectedBuilding)}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-800">{selectedBuilding.name}</h2>
                    <p className="text-slate-600">{selectedBuilding.description}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedBuilding(null)}
                  className="p-2 hover:bg-slate-100 rounded-xl transition-all duration-200"
                >
                  <span className="text-2xl text-slate-400">×</span>
                </button>
              </div>

              {/* Tabs */}
              <div className="flex gap-2 mb-6">
                {[
                  { id: 'overview', label: 'Przegląd', icon: '🏢' },
                  { id: 'technical', label: 'Pomieszczenia techniczne', icon: '⚙️' },
                  { id: 'equipment', label: 'Wyposażenie', icon: '🔧' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all duration-200 ${
                      activeTab === tab.id
                        ? "bg-orange-500 text-white"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    <span>{tab.icon}</span>
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-slate-50 rounded-2xl p-4">
                      <h3 className="font-bold text-slate-800 mb-3">Informacje podstawowe</h3>
                      <div className="space-y-2 text-sm">
                        <div><strong>Kod:</strong> {selectedBuilding.code}</div>
                        <div><strong>Typ:</strong> {selectedBuilding.type === 'office' ? 'Biurowy' : 'Garaż'}</div>
                        <div><strong>Powierzchnia:</strong> {selectedBuilding.totalArea.toLocaleString()} m²</div>
                        <div><strong>Liczba pięter:</strong> {selectedBuilding.floors.length}</div>
                      </div>
                    </div>

                    <div className="bg-slate-50 rounded-2xl p-4">
                      <h3 className="font-bold text-slate-800 mb-3">Statystyki</h3>
                      <div className="space-y-2 text-sm">
                        <div><strong>Pomieszczenia:</strong> {selectedBuilding.floors.reduce((sum, floor) => sum + floor.rooms.length, 0)}</div>
                        <div><strong>Pom. techniczne:</strong> {selectedBuilding.technicalRooms.length}</div>
                        <div><strong>Wyposażenie:</strong> {selectedBuilding.technicalRooms.reduce((sum, room) => sum + room.equipment.length, 0)}</div>
                      </div>
                    </div>

                    <div className="bg-slate-50 rounded-2xl p-4">
                      <h3 className="font-bold text-slate-800 mb-3">Status</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                          <span>Operacyjny</span>
                        </div>
                        <div><strong>Ostatnia inspekcja:</strong> 2024-01-15</div>
                        <div><strong>Następna inspekcja:</strong> 2024-07-15</div>
                      </div>
                    </div>
                  </div>

                  {/* Floors */}
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 mb-4">Piętra</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {selectedBuilding.floors.map((floor) => (
                        <div key={floor.id} className="bg-slate-50 rounded-2xl p-4">
                          <h4 className="font-semibold text-slate-800 mb-2">{floor.name}</h4>
                          <div className="text-sm text-slate-600 space-y-1">
                            <div>Powierzchnia: {floor.area} m²</div>
                            <div>Pomieszczenia: {floor.rooms.length}</div>
                            <div>Udogodnienia: {floor.facilities.length}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'technical' && (
                <div className="space-y-6">
                  {selectedBuilding.technicalRooms.length === 0 ? (
                    <div className="text-center py-8 text-slate-500">
                      <span className="text-4xl mb-4 block">⚙️</span>
                      Brak pomieszczeń technicznych
                    </div>
                  ) : (
                    <div className="grid gap-6">
                      {selectedBuilding.technicalRooms.map((room) => (
                        <div key={room.id} className="bg-slate-50 rounded-2xl p-6">
                          <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-2xl">
                              {room.type === 'electrical' ? '⚡' : 
                               room.type === 'hvac' ? '🌡️' : 
                               room.type === 'server' ? '💻' : '📦'}
                            </div>
                            <div>
                              <h4 className="font-bold text-slate-800">{room.name}</h4>
                              <div className="text-sm text-slate-600">{room.location}</div>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <div className="text-sm text-slate-500 mb-1">Typ pomieszczenia</div>
                              <div className="font-semibold">
                                {room.type === 'electrical' ? 'Elektryczne' :
                                 room.type === 'hvac' ? 'HVAC' :
                                 room.type === 'server' ? 'Serwerowe' : 'Magazynowe'}
                              </div>
                            </div>
                            <div>
                              <div className="text-sm text-slate-500 mb-1">Wyposażenie</div>
                              <div className="font-semibold">{room.equipment.length} urządzeń</div>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <div className="text-sm text-slate-500 mb-1">Ostatnia inspekcja</div>
                              <div className="font-semibold">{new Date(room.lastInspection).toLocaleDateString('pl-PL')}</div>
                            </div>
                            <div>
                              <div className="text-sm text-slate-500 mb-1">Następna inspekcja</div>
                              <div className="font-semibold">{new Date(room.nextInspection).toLocaleDateString('pl-PL')}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'equipment' && (
                <div className="space-y-6">
                  {selectedBuilding.technicalRooms.reduce((acc, room) => acc + room.equipment.length, 0) === 0 ? (
                    <div className="text-center py-8 text-slate-500">
                      <span className="text-4xl mb-4 block">🔧</span>
                      Brak wyposażenia
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {selectedBuilding.technicalRooms.map((room) => (
                        <div key={room.id}>
                          <h4 className="font-bold text-slate-800 mb-4">{room.name}</h4>
                          <div className="grid gap-4">
                            {room.equipment.map((equipment) => (
                              <div key={equipment.id} className="bg-slate-50 rounded-2xl p-4">
                                <div className="flex items-center justify-between mb-3">
                                  <h5 className="font-semibold text-slate-800">{equipment.name}</h5>
                                  <span className={`px-3 py-1 rounded-xl text-sm font-semibold border ${getEquipmentStatusColor(equipment.status)}`}>
                                    {getEquipmentStatusLabel(equipment.status)}
                                  </span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                  <div>
                                    <div className="text-slate-500 mb-1">Szczegóły</div>
                                    <div className="space-y-1">
                                      <div><strong>Typ:</strong> {equipment.type}</div>
                                      <div><strong>Producent:</strong> {equipment.manufacturer}</div>
                                      <div><strong>Model:</strong> {equipment.model}</div>
                                      <div><strong>S/N:</strong> {equipment.serialNumber}</div>
                                    </div>
                                  </div>
                                  
                                  <div>
                                    <div className="text-slate-500 mb-1">Daty</div>
                                    <div className="space-y-1">
                                      <div><strong>Instalacja:</strong> {new Date(equipment.installationDate).toLocaleDateString('pl-PL')}</div>
                                      <div><strong>Gwarancja do:</strong> {new Date(equipment.warrantyExpiry).toLocaleDateString('pl-PL')}</div>
                                    </div>
                                  </div>
                                  
                                  <div>
                                    <div className="text-slate-500 mb-1">Konserwacja</div>
                                    <div className="space-y-1">
                                      <div><strong>Ostatnia:</strong> {new Date(equipment.lastMaintenance).toLocaleDateString('pl-PL')}</div>
                                      <div><strong>Następna:</strong> {new Date(equipment.nextMaintenance).toLocaleDateString('pl-PL')}</div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="mt-8 pt-6 border-t border-slate-200">
                <button
                  onClick={() => setSelectedBuilding(null)}
                  className="w-full py-3 bg-slate-100 text-slate-700 rounded-2xl font-semibold hover:bg-slate-200 transition-all duration-200"
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