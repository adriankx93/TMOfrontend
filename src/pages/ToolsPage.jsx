import { useState } from "react";
import Topbar from "../components/Topbar";

export default function ToolsPage() {
  const [activeTab, setActiveTab] = useState("inventory");
  const [showRequestModal, setShowRequestModal] = useState(false);

  const tabs = [
    { id: "inventory", label: "Inwentaryzacja", icon: "📋", count: 156 },
    { id: "requests", label: "Zapotrzebowania", icon: "📝", count: 8 },
    { id: "missing", label: "Braki", icon: "❌", count: 12 },
    { id: "condition", label: "Stan techniczny", icon: "🔧", count: 23 }
  ];

  const toolCategories = [
    { name: "Narzędzia elektryczne", icon: "⚡", count: 45 },
    { name: "Narzędzia ręczne", icon: "🔧", count: 78 },
    { name: "Przyrządy pomiarowe", icon: "📏", count: 23 },
    { name: "Sprzęt bezpieczeństwa", icon: "🦺", count: 34 },
    { name: "Narzędzia specjalistyczne", icon: "🛠️", count: 19 }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <Topbar 
        title="Zarządzanie narzędziami" 
        subtitle="Inwentaryzacja, zapotrzebowania i kontrola stanu"
        action={
          <button 
            onClick={() => setShowRequestModal(true)}
            className="btn-primary flex items-center gap-2"
          >
            <span>📝</span>
            <span>Zgłoś zapotrzebowanie</span>
          </button>
        }
      />

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {tabs.map((tab) => (
          <div key={tab.id} className="metric-card">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
                <span className="text-2xl">{tab.icon}</span>
              </div>
              <div className="px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full text-sm font-bold">
                {tab.count}
              </div>
            </div>
            <h3 className="text-lg font-semibold text-white mb-1">{tab.label}</h3>
            <p className="text-slate-400 text-sm">Pozycji w kategorii</p>
          </div>
        ))}
      </div>

      {/* Tool Categories */}
      <div className="glass-card p-8">
        <h3 className="text-xl font-bold text-white mb-6">Kategorie narzędzi</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {toolCategories.map((category) => (
            <div key={category.name} className="glass-card-light p-6 text-center hover:bg-slate-600/30 transition-all duration-200 cursor-pointer">
              <div className="text-3xl mb-3">{category.icon}</div>
              <h4 className="font-semibold text-white mb-2">{category.name}</h4>
              <p className="text-sm text-slate-400">{category.count} narzędzi</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tool Tabs */}
      <div className="glass-card p-2">
        <div className="flex gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-6 py-4 rounded-xl font-semibold transition-all duration-200 flex-1 ${
                activeTab === tab.id
                  ? "gradient-warning text-white shadow-lg"
                  : "text-slate-400 hover:text-white hover:bg-slate-700/50"
              }`}
            >
              <span className="text-lg">{tab.icon}</span>
              <div className="text-left">
                <div>{tab.label}</div>
                <div className="text-xs opacity-70">{tab.count} pozycji</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="glass-card p-8">
        <div className="text-center py-12 text-slate-400">
          <div className="text-6xl mb-4">🔧</div>
          <h3 className="text-xl font-semibold text-slate-300 mb-2">System narzędzi</h3>
          <p className="text-slate-500">Funkcjonalność będzie dostępna wkrótce</p>
        </div>
      </div>
    </div>
  );
}