import { useState } from "react";
import Topbar from "../components/Topbar";
import TaskList from "../components/TaskList";
import TaskPool from "../components/TaskPool";
import CreateTaskModal from "../components/CreateTaskModal";

export default function TasksPage() {
  const [activeTab, setActiveTab] = useState("current");
  const [showCreateModal, setShowCreateModal] = useState(false);

  const tabs = [
    { id: "current", label: "Bieżące zadania", icon: "📋" },
    { id: "pool", label: "Pula zadań", icon: "🔄" },
    { id: "completed", label: "Zakończone", icon: "✅" },
    { id: "overdue", label: "Przeterminowane", icon: "⚠️" }
  ];

  return (
    <div className="space-y-8">
      <Topbar 
        title="Zarządzanie zadaniami" 
        subtitle="Przypisuj i monitoruj zadania dla techników"
        action={
          <button 
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
          >
            + Nowe zadanie
          </button>
        }
      />

      {/* Tabs */}
      <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl shadow-xl p-2">
        <div className="flex gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-6 py-4 rounded-2xl font-semibold transition-all duration-200 ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <span className="text-lg">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {activeTab === "current" && <TaskList type="current" />}
      {activeTab === "pool" && <TaskPool />}
      {activeTab === "completed" && <TaskList type="completed" />}
      {activeTab === "overdue" && <TaskList type="overdue" />}

      {/* Create Task Modal */}
      {showCreateModal && (
        <CreateTaskModal 
          onClose={() => setShowCreateModal(false)} 
          onTaskCreated={() => setShowCreateModal(false)}
        />
      )}
    </div>
  );
}