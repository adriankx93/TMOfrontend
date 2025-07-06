import React, { useState, useEffect } from "react";
import Topbar from "../components/Topbar";

export default function MaterialsPage() {
  const [materials, setMaterials] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedUrgency, setSelectedUrgency] = useState("all");

  const getStats = () => {
    return {
      total: 0,
      requested: 0,
      approved: 0,
      ordered: 0,
      delivered: 0,
      totalCost: 0
    };
  };

  const stats = getStats();

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

      {/* Empty State */}
      <div className="glass-card p-12 text-center animate-slide-in-up">
        <div className="text-6xl mb-4">🛒</div>
        <h3 className="text-xl font-semibold text-slate-300 mb-2">Brak zamówień materiałów</h3>
        <p className="text-slate-500 mb-6">Rozpocznij zarządzanie materiałami dodając pierwsze zamówienie.</p>
        <button className="btn-primary">
          Nowe zamówienie
        </button>
      </div>
    </div>
  );
}