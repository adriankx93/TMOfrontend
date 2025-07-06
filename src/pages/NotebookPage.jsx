import { useState } from "react";
import Topbar from "../components/Topbar";

export default function NotebookPage() {
  const [activeTab, setActiveTab] = useState("my_notes");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [noteVisibility, setNoteVisibility] = useState("private");

  const tabs = [
    { id: "my_notes", label: "Moje notatki", icon: "📝", count: 12 },
    { id: "public_notes", label: "Notatki publiczne", icon: "🌐", count: 8 },
    { id: "shift_communication", label: "Komunikacja zmian", icon: "💬", count: 15 },
    { id: "important", label: "Ważne", icon: "⭐", count: 5 }
  ];

  const noteCategories = [
    { name: "Procedury", icon: "📋", color: "blue" },
    { name: "Awarie", icon: "⚠️", color: "red" },
    { name: "Konserwacja", icon: "🔧", color: "orange" },
    { name: "Bezpieczeństwo", icon: "🛡️", color: "green" },
    { name: "Ogólne", icon: "📄", color: "purple" }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <Topbar 
        title="Notatnik zespołowy" 
        subtitle="Komunikacja, procedury i wymiana informacji między zmianami"
        action={
          <button 
            onClick={() => setShowCreateModal(true)}
            className="btn-primary flex items-center gap-2"
          >
            <span>📝</span>
            <span>Nowa notatka</span>
          </button>
        }
      />

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {tabs.map((tab) => (
          <div key={tab.id} className="metric-card">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                <span className="text-2xl">{tab.icon}</span>
              </div>
              <div className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm font-bold">
                {tab.count}
              </div>
            </div>
            <h3 className="text-lg font-semibold text-white mb-1">{tab.label}</h3>
            <p className="text-slate-400 text-sm">Notatek w kategorii</p>
          </div>
        ))}
      </div>

      {/* Note Categories */}
      <div className="glass-card p-8">
        <h3 className="text-xl font-bold text-white mb-6">Kategorie notatek</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {noteCategories.map((category) => (
            <div key={category.name} className={`glass-card-light p-6 text-center hover:bg-${category.color}-500/20 transition-all duration-200 cursor-pointer`}>
              <div className="text-3xl mb-3">{category.icon}</div>
              <h4 className={`font-semibold text-${category.color}-400 mb-2`}>{category.name}</h4>
            </div>
          ))}
        </div>
      </div>

      {/* Create Note Panel */}
      <div className="glass-card p-8">
        <h3 className="text-xl font-bold text-white mb-6">Szybka notatka</h3>
        
        <div className="space-y-4">
          <div className="flex gap-4">
            <button
              onClick={() => setNoteVisibility("private")}
              className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                noteVisibility === "private"
                  ? "bg-blue-500/20 text-blue-400"
                  : "bg-slate-700 text-slate-300 hover:bg-slate-600"
              }`}
            >
              🔒 Prywatna
            </button>
            <button
              onClick={() => setNoteVisibility("public")}
              className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                noteVisibility === "public"
                  ? "bg-green-500/20 text-green-400"
                  : "bg-slate-700 text-slate-300 hover:bg-slate-600"
              }`}
            >
              🌐 Publiczna
            </button>
          </div>

          <textarea
            className="input-field w-full h-32"
            placeholder="Napisz notatkę..."
          />

          <div className="flex gap-4">
            <select className="input-field">
              <option>Wybierz kategorię</option>
              {noteCategories.map((cat) => (
                <option key={cat.name} value={cat.name}>{cat.icon} {cat.name}</option>
              ))}
            </select>
            <button className="btn-primary">
              Zapisz notatkę
            </button>
          </div>
        </div>
      </div>

      {/* Note Tabs */}
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
                <div className="text-xs opacity-70">{tab.count} notatek</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="glass-card p-8">
        <div className="text-center py-12 text-slate-400">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-xl font-semibold text-slate-300 mb-2">Notatnik zespołowy</h3>
          <p className="text-slate-500">Funkcjonalność będzie dostępna wkrótce</p>
        </div>
      </div>
    </div>
  );
}