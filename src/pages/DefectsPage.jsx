import { useState } from "react";
import Topbar from "../components/Topbar";

export default function DefectsPage() {
  const [activeTab, setActiveTab] = useState("active");
  const [showCreateModal, setShowCreateModal] = useState(false);

  const defectStatuses = [
    { id: "reported", name: "Zgłoszone", color: "blue", icon: "📝" },
    { id: "diagnosed", name: "Zdiagnozowane", color: "amber", icon: "🔍" },
    { id: "waiting_materials", name: "Oczekuje na materiały", color: "purple", icon: "📦" },
    { id: "waiting_service", name: "Oczekuje na serwis", color: "orange", icon: "🔧" },
    { id: "in_repair", name: "W naprawie", color: "yellow", icon: "⚡" },
    { id: "testing", name: "Testowanie", color: "indigo", icon: "🧪" },
    { id: "completed", name: "Zakończone", color: "green", icon: "✅" },
    { id: "cancelled", name: "Anulowane", color: "red", icon: "❌" }
  ];

  const tabs = [
    { id: "active", label: "Aktywne", icon: "⚡", count: 15 },
    { id: "waiting", label: "Oczekujące", icon: "⏳", count: 8 },
    { id: "completed", label: "Zakończone", icon: "✅", count: 42 },
    { id: "critical", label: "Krytyczne", icon: "🚨", count: 3 }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <Topbar 
        title="Zarządzanie usterkami" 
        subtitle="Zgłoszenia, diagnostyka i śledzenie napraw"
        action={
          <button 
            onClick={() => setShowCreateModal(true)}
            className="btn-primary flex items-center gap-2"
          >
            <span>⚠️</span>
            <span>Zgłoś usterkę</span>
          </button>
        }
      />

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {tabs.map((tab) => (
          <div key={tab.id} className="metric-card">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center">
                <span className="text-2xl">{tab.icon}</span>
              </div>
              <div className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-sm font-bold">
                {tab.count}
              </div>
            </div>
            <h3 className="text-lg font-semibold text-white mb-1">{tab.label}</h3>
            <p className="text-slate-400 text-sm">Usterki w kategorii</p>
          </div>
        ))}
      </div>

      {/* Defect Status Flow */}
      <div className="glass-card p-8">
        <h3 className="text-xl font-bold text-white mb-6">Etapy usuwania usterek</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {defectStatuses.map((status, index) => (
            <div key={status.id} className="relative">
              <div className={`glass-card-light p-4 text-center hover:bg-${status.color}-500/20 transition-all duration-200 cursor-pointer`}>
                <div className="text-2xl mb-2">{status.icon}</div>
                <div className={`text-sm font-semibold text-${status.color}-400`}>{status.name}</div>
              </div>
              
              {index < defectStatuses.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-2 transform -translate-y-1/2 text-slate-600">
                  →
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Defect Tabs */}
      <div className="glass-card p-2">
        <div className="flex gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-6 py-4 rounded-xl font-semibold transition-all duration-200 flex-1 ${
                activeTab === tab.id
                  ? "gradient-danger text-white shadow-lg"
                  : "text-slate-400 hover:text-white hover:bg-slate-700/50"
              }`}
            >
              <span className="text-lg">{tab.icon}</span>
              <div className="text-left">
                <div>{tab.label}</div>
                <div className="text-xs opacity-70">{tab.count} usterek</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="glass-card p-8">
        <div className="text-center py-12 text-slate-400">
          <div className="text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-semibold text-slate-300 mb-2">System usterek</h3>
          <p className="text-slate-500">Funkcjonalność będzie dostępna wkrótce</p>
        </div>
      </div>
    </div>
  );
}