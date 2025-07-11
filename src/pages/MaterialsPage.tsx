import React, { useState, useEffect } from "react";
import Topbar from "../components/Topbar";
import { useTasks } from "../hooks/useTasks";
import { useTechnicians } from "../hooks/useTechnicians";

export default function MaterialsPage() {
  const [materials, setMaterials] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedUrgency, setSelectedUrgency] = useState("all");
  const { tasks } = useTasks();
  const { technicians } = useTechnicians();
  const [selectedTask, setSelectedTask] = useState(null);
  const [showTaskDetailsModal, setShowTaskDetailsModal] = useState(false);

  // Filtruj zadania z brakującymi materiałami
  const tasksWithMissingMaterials = tasks.filter(task => 
    task.status === 'pool' && 
    (task.needsMaterials || task.missingMaterials || 
     (task.poolReason && task.poolReason.toLowerCase().includes('materiał')))
  );

  const getStats = () => {
    return {
      total: 0,
      requested: 0,
      approved: 0,
      ordered: 0,
      delivered: 0,
      totalCost: 0,
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

  const getTechnicianName = (technicianId: string) => {
    if (!technicianId) return 'Nieprzypisane';
    const technician = technicians.find(t => t._id === technicianId);
    return technician ? `${technician.firstName} ${technician.lastName}` : 'Nieznany';
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <Topbar 
        title="Zarządzanie materiałami" 
        subtitle="Zamówienia, dostawy i kontrola przepływu materiałów"
        action={
          <button className="btn-primary flex items-center gap-2">
            <span>🛒</span>
            <span>Nowe zamówienie</span>
          </button>
        }
      />

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-6">
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
          <p className="text-slate-400 text-sm">Wszystkie zamówienia</p>
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
            <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
              <span className="text-2xl">✅</span>
            </div>
            <div className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-bold">
              {stats.approved}
            </div>
          </div>
          <h3 className="text-lg font-semibold text-white mb-1">Zatwierdzone</h3>
          <p className="text-slate-400 text-sm">Gotowe do zamówienia</p>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
              <span className="text-2xl">🛒</span>
            </div>
            <div className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm font-bold">
              {stats.ordered}
            </div>
          </div>
          <h3 className="text-lg font-semibold text-white mb-1">Zamówione</h3>
          <p className="text-slate-400 text-sm">W trakcie dostawy</p>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
              <span className="text-2xl">📦</span>
            </div>
            <div className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-sm font-bold">
              {stats.delivered}
            </div>
          </div>
          <h3 className="text-lg font-semibold text-white mb-1">Dostarczone</h3>
          <p className="text-slate-400 text-sm">Gotowe do magazynu</p>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center">
              <span className="text-2xl">💰</span>
            </div>
            <div className="px-3 py-1 bg-indigo-500/20 text-indigo-400 rounded-full text-sm font-bold">
              {stats.totalCost.toFixed(0)}
            </div>
          </div>
          <h3 className="text-lg font-semibold text-white mb-1">Wartość</h3>
          <p className="text-slate-400 text-sm">PLN łącznie</p>
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
          <h3 className="text-lg font-semibold text-white mb-1">Wartość</h3>
          <p className="text-slate-400 text-sm">PLN łącznie</p>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card p-6">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="flex items-center gap-4">
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
              <option value="rejected">Odrzucone</option>
            </select>
          </div>
          
          <div className="flex items-center gap-4">
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
              <div key={task._id} className="p-6 glass-card-light rounded-2xl hover:bg-slate-600/30 transition-all duration-200 cursor-pointer">
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
                  <button className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-xl hover:bg-blue-500/30 transition-all duration-200 font-medium">
                    Zamów materiały
                  </button>
                  
                  <button className="px-4 py-2 bg-green-500/20 text-green-400 rounded-xl hover:bg-green-500/30 transition-all duration-200 font-medium">
                    Oznacz jako dostępne
                  </button>
                  
                  <button className="px-4 py-2 bg-purple-500/20 text-purple-400 rounded-xl hover:bg-purple-500/30 transition-all duration-200 font-medium">
                    Szczegóły zadania
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}