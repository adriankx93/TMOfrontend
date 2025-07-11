import { useEffect, useState } from "react";
import Topbar from "../components/Topbar";
import TaskList from "../components/TaskList";
import TaskPool from "../components/TaskPool";
import CreateTaskModal from "../components/CreateTaskModal";
import { useTasks } from "../hooks/useTasks";

export default function TasksPage() {
  const [activeTab, setActiveTab] = useState("current");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { tasks } = useTasks();

  // Oblicz statystyki zadań
  const getTaskStats = () => {
    const currentTasks = tasks.filter(t => ['assigned', 'in_progress'].includes(t.status));
    const poolTasks = tasks.filter(t => t.status === 'pool');
    const completedTasks = tasks.filter(t => t.status === 'completed');
    const overdueTasks = tasks.filter(t => 
      t.status === 'overdue' || 
      (t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'completed')
    );

    return {
      current: currentTasks.length,
      pool: poolTasks.length,
      completed: completedTasks.length,
      overdue: overdueTasks.length
    };
  };

  const stats = getTaskStats();

  const tabs = [
    { id: "current", label: "Aktywne", icon: "⚡", count: stats.current, color: "blue" },
    { id: "pool", label: "Pula zadań", icon: "🔄", count: stats.pool, color: "amber" },
    { id: "completed", label: "Zakończone", icon: "✅", count: stats.completed, color: "green" },
    { id: "overdue", label: "Przeterminowane", icon: "⚠️", count: stats.overdue, color: "red" }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <Topbar 
        title="Zarządzanie zadaniami" 
        subtitle="System CMMS - Maintenance Management"
        action={
          <button 
            onClick={() => setShowCreateModal(true)}
            className="btn-primary flex items-center gap-2"
          >
            <span>➕</span>
            <span>Nowe zadanie</span>
          </button>
        }
      />

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {tabs.map((tab) => (
          <div key={tab.id} className="metric-card">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 bg-${tab.color}-500/20 rounded-xl flex items-center justify-center`}>
                <span className="text-2xl">{tab.icon}</span>
              </div>
              <div className={`px-3 py-1 bg-${tab.color}-500/20 text-${tab.color}-400 rounded-full text-sm font-bold`}>
                {tab.count}
              </div>
            </div>
            <h3 className="text-lg font-semibold text-white mb-1">{tab.label}</h3>
            <p className="text-slate-400 text-sm">Zadania w kategorii</p>
          </div>
        ))}
      </div>

      {/* Advanced Tabs */}
      <div className="glass-card p-2">
        <div className="flex gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-6 py-4 rounded-xl font-semibold transition-all duration-200 flex-1 ${
                activeTab === tab.id
                  ? `gradient-primary text-white shadow-lg glow-${tab.color}`
                  : "text-slate-400 hover:text-white hover:bg-slate-700/50"
              }`}
            >
              <span className="text-lg">{tab.icon}</span>
              <div className="text-left">
                <div>{tab.label}</div>
                <div className="text-xs opacity-70">{tab.count} zadań</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="animate-slide-in-up">
        {activeTab === "current" && <TaskList type="current" />}
        {activeTab === "pool" && <TaskPool />}
        {activeTab === "completed" && <TaskList type="completed" />}
        {activeTab === "overdue" && <TaskList type="overdue" />}
      </div>

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