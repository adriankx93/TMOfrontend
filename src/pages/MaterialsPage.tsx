import React, { useState, useEffect } from "react";
import Topbar from "../components/Topbar";
import { useTasks } from "../hooks/useTasks";
import { useTechnicians } from "../hooks/useTechnicians";

interface Material {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  price: number;
  status: 'requested' | 'approved' | 'ordered' | 'delivered' | 'in_stock';
  requestedBy: string;
  requestedAt: string;
  supplier?: string;
  notes?: string;
  urgency: 'low' | 'medium' | 'high' | 'critical';
}

export default function MaterialsPage() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedUrgency, setSelectedUrgency] = useState("all");
  const { tasks, updateTask, moveToPool } = useTasks();
  const { technicians } = useTechnicians();
  const [selectedTask, setSelectedTask] = useState(null);
  const [showTaskDetailsModal, setShowTaskDetailsModal] = useState(false);
  const [showAddMaterialModal, setShowAddMaterialModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // Mock materials data
  useEffect(() => {
    const mockMaterials: Material[] = [
      {
        id: "mat-1",
        name: "Żarówki LED 10W",
        category: "Elektryka",
        quantity: 20,
        unit: "szt.",
        price: 15.99,
        status: 'in_stock',
        requestedBy: "Jan Kowalski",
        requestedAt: new Date().toISOString(),
        supplier: "ElektroHurt",
        notes: "Do wymiany w biurach",
        urgency: 'medium'
      },
      {
        id: "mat-2",
        name: "Filtry powietrza HVAC",
        category: "HVAC",
        quantity: 5,
        unit: "szt.",
        price: 89.99,
        status: 'ordered',
        requestedBy: "Anna Nowak",
        requestedAt: new Date().toISOString(),
        supplier: "KlimaSystem",
        urgency: 'high'
      },
      {
        id: "mat-3",
        name: "Przewód elektryczny 3x1.5mm",
        category: "Elektryka",
        quantity: 100,
        unit: "m",
        price: 3.50,
        status: 'requested',
        requestedBy: "Piotr Wiśniewski",
        requestedAt: new Date().toISOString(),
        urgency: 'low'
      }
    ];
    setMaterials(mockMaterials);
  }, []);

  // Filtruj zadania z brakującymi materiałami
  const tasksWithMissingMaterials = tasks.filter(task => 
    task.status === 'pool' && 
    (task.needsMaterials || task.missingMaterials || 
     (task.poolReason && task.poolReason.toLowerCase().includes('materiał')))
  );

  const getStats = () => {
    return {
      total: materials.length,
      requested: materials.filter(m => m.status === 'requested').length,
      approved: materials.filter(m => m.status === 'approved').length,
      ordered: materials.filter(m => m.status === 'ordered').length,
      delivered: materials.filter(m => m.status === 'delivered').length,
      inStock: materials.filter(m => m.status === 'in_stock').length,
      missingMaterials: tasksWithMissingMaterials.length
    };
  };

  const stats = getStats();

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'Krytyczny': return 'bg-red-100 text-red-800 border-red-200';
      case 'Wysoki': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Średni': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Niski': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch(urgency) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'requested': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'approved': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'ordered': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'delivered': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'in_stock': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch(status) {
      case 'requested': return 'Zgłoszone';
      case 'approved': return 'Zatwierdzone';
      case 'ordered': return 'Zamówione';
      case 'delivered': return 'Dostarczone';
      case 'in_stock': return 'Na stanie';
      default: return 'Nieznany';
    }
  };

  const getTechnicianName = (technicianId: string) => {
    if (!technicianId) return 'Nieprzypisane';
    const technician = technicians.find(t => t._id === technicianId);
    return technician ? `${technician.firstName} ${technician.lastName}` : 'Nieznany';
  };

  const handleAddMaterial = () => {
    setShowAddMaterialModal(true);
  };

  const handleMarkAsAvailable = async (task: any) => {
    setLoading(true);
    try {
      // Przenieś zadanie z powrotem do puli z informacją o dostępności materiałów
      await moveToPool(task._id, "Materiały są już dostępne", {
        needsMaterials: false,
        missingMaterials: null,
        history: [
          ...(task.history || []),
          {
            action: "materials_available",
            user: "Administrator Systemu",
            timestamp: new Date().toISOString(),
            details: "Oznaczono materiały jako dostępne. Zadanie gotowe do przypisania."
          }
        ]
      });
      
      alert("Zadanie zostało oznaczone jako gotowe do przypisania!");
    } catch (error) {
      console.error("Błąd podczas oznaczania materiałów jako dostępne:", error);
      alert("Wystąpił błąd podczas aktualizacji zadania");
    } finally {
      setLoading(false);
    }
  };

  const handleOrderMaterials = (task: any) => {
    // Symulacja zamówienia materiałów
    const newMaterial: Material = {
      id: `mat-${Date.now()}`,
      name: `Materiały do zadania: ${task.title}`,
      category: task.category || "Inne",
      quantity: 1,
      unit: "komplet",
      price: Math.floor(Math.random() * 1000) + 100,
      status: 'ordered',
      requestedBy: "Administrator Systemu",
      requestedAt: new Date().toISOString(),
      urgency: 'high',
      notes: `Materiały do zadania: ${task.title}. ${task.missingMaterials || ''}`
    };

    setMaterials(prev => [...prev, newMaterial]);
    alert("Materiały zostały zamówione!");
  };

  const handleMoveToInventory = (materialId: string) => {
    setMaterials(prev => 
      prev.map(m => 
        m.id === materialId 
          ? {...m, status: 'in_stock'} 
          : m
      )
    );
    alert("Materiał został przeniesiony do magazynu!");
  };

  const handleShowDetails = (task: any) => {
    setSelectedTask(task);
    setShowTaskDetailsModal(true);
  };

  const filteredMaterials = materials.filter(m => {
    const matchesStatus = selectedStatus === "all" || m.status === selectedStatus;
    const matchesUrgency = selectedUrgency === "all" || m.urgency === selectedUrgency;
    return matchesStatus && matchesUrgency;
  });

  return (
    <div className="space-y-8 animate-fade-in">
      <Topbar 
        title="Zarządzanie materiałami" 
        subtitle="Zamówienia, dostawy i kontrola przepływu materiałów"
        action={
          <button 
            onClick={handleAddMaterial}
            className="btn-primary flex items-center gap-2"
          >
            <span>🛒</span>
            <span>Dodaj materiał</span>
          </button>
        }
      />

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-7 gap-6">
        <div className="metric-card">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <span className="text-2xl">📋</span>
            </div>
            <div className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm font-bold">
              {stats.total}
            </div>
          </div>
          <h3 className="text-lg font-semibold text-white mb-1">Łącznie</h3>
          <p className="text-slate-400 text-sm">Wszystkie materiały</p>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
              <span className="text-2xl">📝</span>
            </div>
            <div className="px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full text-sm font-bold">
              {stats.requested}
            </div>
          </div>
          <h3 className="text-lg font-semibold text-white mb-1">Zgłoszone</h3>
          <p className="text-slate-400 text-sm">Oczekują na akceptację</p>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
              <span className="text-2xl">✅</span>
            </div>
            <div className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm font-bold">
              {stats.approved}
            </div>
          </div>
          <h3 className="text-lg font-semibold text-white mb-1">Zatwierdzone</h3>
          <p className="text-slate-400 text-sm">Gotowe do zamówienia</p>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center">
              <span className="text-2xl">🛒</span>
            </div>
            <div className="px-3 py-1 bg-amber-500/20 text-amber-400 rounded-full text-sm font-bold">
              {stats.ordered}
            </div>
          </div>
          <h3 className="text-lg font-semibold text-white mb-1">Zamówione</h3>
          <p className="text-slate-400 text-sm">W trakcie dostawy</p>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center">
              <span className="text-2xl">📦</span>
            </div>
            <div className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-sm font-bold">
              {stats.delivered}
            </div>
          </div>
          <h3 className="text-lg font-semibold text-white mb-1">Dostarczone</h3>
          <p className="text-slate-400 text-sm">Gotowe do magazynu</p>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
              <span className="text-2xl">🏬</span>
            </div>
            <div className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-sm font-bold">
              {stats.inStock}
            </div>
          </div>
          <h3 className="text-lg font-semibold text-white mb-1">Na stanie</h3>
          <p className="text-slate-400 text-sm">Dostępne w magazynie</p>
        </div>
        
        <div className="metric-card">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center">
              <span className="text-2xl">⚠️</span>
            </div>
            <div className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-sm font-bold">
              {stats.missingMaterials}
            </div>
          </div>
          <h3 className="text-lg font-semibold text-white mb-1">Braki</h3>
          <p className="text-slate-400 text-sm">Zadania oczekujące</p>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card p-6">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="flex items-center gap-4 flex-1">
            <span className="font-semibold text-slate-200">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="input-field"
            >
              <option value="all">Wszystkie</option>
              <option value="requested">Zgłoszone</option>
              <option value="approved">Zatwierdzone</option>
              <option value="ordered">Zamówione</option>
              <option value="delivered">Dostarczone</option>
              <option value="in_stock">Na stanie</option>
            </select>
          </div>
          
          <div className="flex items-center gap-4 flex-1">
            <span className="font-semibold text-slate-200">Pilność:</span>
            <select
              value={selectedUrgency}
              onChange={(e) => setSelectedUrgency(e.target.value)}
              className="input-field"
            >
              <option value="all">Wszystkie</option>
              <option value="critical">Krytyczne</option>
              <option value="high">Wysokie</option>
              <option value="medium">Średnie</option>
              <option value="low">Niskie</option>
            </select>
          </div>
        </div>
      </div>

      {/* Materials List */}
      <div className="glass-card p-8">
        <h3 className="text-xl font-bold text-white mb-6">Lista materiałów</h3>
        
        {filteredMaterials.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <div className="text-6xl mb-4">🛒</div>
            <h3 className="text-xl font-semibold text-slate-300 mb-2">Brak materiałów</h3>
            <p className="text-slate-500">Nie znaleziono materiałów spełniających kryteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">Nazwa</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">Kategoria</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">Ilość</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">Cena</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">Pilność</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">Akcje</th>
                </tr>
              </thead>
              <tbody>
                {filteredMaterials.map((material) => (
                  <tr key={material.id} className="border-b border-slate-700/50 hover:bg-slate-700/20">
                    <td className="px-4 py-3 text-white">{material.name}</td>
                    <td className="px-4 py-3 text-slate-300">{material.category}</td>
                    <td className="px-4 py-3 text-slate-300">{material.quantity} {material.unit}</td>
                    <td className="px-4 py-3 text-slate-300">{material.price.toFixed(2)} PLN</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${getStatusColor(material.status)}`}>
                        {getStatusLabel(material.status)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${getUrgencyColor(material.urgency)}`}>
                        {material.urgency === 'critical' ? 'Krytyczna' : 
                         material.urgency === 'high' ? 'Wysoka' : 
                         material.urgency === 'medium' ? 'Średnia' : 'Niska'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        {material.status === 'delivered' && (
                          <button 
                            onClick={() => handleMoveToInventory(material.id)}
                            className="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded-lg text-xs hover:bg-emerald-500/30 transition-all duration-200"
                          >
                            Do magazynu
                          </button>
                        )}
                        <button className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-lg text-xs hover:bg-blue-500/30 transition-all duration-200">
                          Szczegóły
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Tasks with Missing Materials */}
      <div className="glass-card p-8">
        <h3 className="text-xl font-bold text-white mb-6">Zadania z brakującymi materiałami</h3>
        
        {tasksWithMissingMaterials.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <div className="text-6xl mb-4">🛒</div>
            <h3 className="text-xl font-semibold text-slate-300 mb-2">Brak zadań oczekujących na materiały</h3>
            <p className="text-slate-500">Wszystkie zadania mają potrzebne materiały.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {tasksWithMissingMaterials.map((task) => (
              <div key={task._id} className="p-6 glass-card-light rounded-2xl hover:bg-slate-600/30 transition-all duration-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h4 className="font-semibold text-white text-base">{task.title}</h4>
                      <span className={`px-3 py-1 rounded-xl text-sm font-semibold border ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-slate-300 mb-3">
                      <div className="flex items-center gap-2">
                        <span>👤</span>
                        <span>{getTechnicianName(task.assignedTo)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>📍</span>
                        <span>{task.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>🕐</span>
                        <span>
                          {task.dueDate 
                            ? new Date(task.dueDate).toLocaleDateString('pl-PL')
                            : 'Bez terminu'
                          }
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-red-500/20 rounded-xl border border-red-500/30 mb-3">
                      <div className="text-sm font-medium text-red-400 mb-1">Brakujące materiały:</div>
                      <div className="text-sm text-red-300">
                        {task.missingMaterials || task.poolReason || "Brak szczegółowych informacji"}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-4 border-t border-slate-600">
                  <button 
                    onClick={() => handleOrderMaterials(task)}
                    className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-xl hover:bg-blue-500/30 transition-all duration-200 font-medium"
                    disabled={loading}
                  >
                    Zamów materiały
                  </button>
                  
                  <button 
                    onClick={() => handleMarkAsAvailable(task)}
                    className="px-4 py-2 bg-green-500/20 text-green-400 rounded-xl hover:bg-green-500/30 transition-all duration-200 font-medium"
                    disabled={loading}
                  >
                    Oznacz jako dostępne
                  </button>
                  
                  <button 
                    onClick={() => handleShowDetails(task)}
                    className="px-4 py-2 bg-purple-500/20 text-purple-400 rounded-xl hover:bg-purple-500/30 transition-all duration-200 font-medium"
                  >
                    Szczegóły zadania
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Material Modal */}
      {showAddMaterialModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass-card max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <span className="text-white text-xl">🛒</span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Dodaj nowy materiał</h2>
                    <p className="text-slate-400">Wprowadź dane materiału</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowAddMaterialModal(false)}
                  className="p-2 hover:bg-slate-700/50 rounded-xl transition-all duration-200"
                >
                  <span className="text-2xl text-slate-400 hover:text-white">×</span>
                </button>
              </div>

              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-200 mb-2">
                      Nazwa materiału *
                    </label>
                    <input
                      type="text"
                      className="input-field w-full"
                      placeholder="np. Żarówki LED 10W"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-200 mb-2">
                      Kategoria *
                    </label>
                    <select className="input-field w-full" required>
                      <option value="">Wybierz kategorię</option>
                      <option value="Elektryka">Elektryka</option>
                      <option value="HVAC">HVAC</option>
                      <option value="Hydraulika">Hydraulika</option>
                      <option value="Narzędzia">Narzędzia</option>
                      <option value="Części zamienne">Części zamienne</option>
                      <option value="Inne">Inne</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-200 mb-2">
                      Ilość *
                    </label>
                    <input
                      type="number"
                      min="1"
                      className="input-field w-full"
                      placeholder="np. 10"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-200 mb-2">
                      Jednostka *
                    </label>
                    <select className="input-field w-full" required>
                      <option value="szt.">szt.</option>
                      <option value="m">m</option>
                      <option value="kg">kg</option>
                      <option value="l">l</option>
                      <option value="komplet">komplet</option>
                      <option value="opak.">opak.</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-200 mb-2">
                      Cena jednostkowa (PLN) *
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      className="input-field w-full"
                      placeholder="np. 15.99"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-200 mb-2">
                      Dostawca
                    </label>
                    <input
                      type="text"
                      className="input-field w-full"
                      placeholder="np. ElektroHurt"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-200 mb-2">
                      Pilność *
                    </label>
                    <select className="input-field w-full" required>
                      <option value="low">Niska</option>
                      <option value="medium">Średnia</option>
                      <option value="high">Wysoka</option>
                      <option value="critical">Krytyczna</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-200 mb-2">
                    Dodatkowe informacje
                  </label>
                  <textarea
                    rows={3}
                    className="input-field w-full"
                    placeholder="Dodatkowe informacje o materiale..."
                  />
                </div>

                <div className="flex gap-4 pt-6 border-t border-slate-600">
                  <button
                    type="submit"
                    className="flex-1 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-200"
                    onClick={(e) => {
                      e.preventDefault();
                      const newMaterial: Material = {
                        id: `mat-${Date.now()}`,
                        name: "Nowy materiał",
                        category: "Inne",
                        quantity: 1,
                        unit: "szt.",
                        price: 0,
                        status: 'requested',
                        requestedBy: "Administrator Systemu",
                        requestedAt: new Date().toISOString(),
                        urgency: 'medium'
                      };
                      setMaterials(prev => [...prev, newMaterial]);
                      setShowAddMaterialModal(false);
                    }}
                  >
                    Dodaj materiał
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddMaterialModal(false)}
                    className="px-8 py-4 bg-slate-700 text-slate-300 rounded-2xl font-semibold hover:bg-slate-600 transition-all duration-200"
                  >
                    Anuluj
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}