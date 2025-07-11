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
    { id: "current", label: "Aktywne", count: stats.current, color: "blue", icon: "⚡" },
    { id: "pool", label: "Pula zadań", count: stats.pool, color: "amber", icon: "📋" },
    { id: "completed", label: "Zakończone", count: stats.completed, color: "green", icon: "✅" },
    { id: "overdue", label: "Przeterminowane", count: stats.overdue, color: "red", icon: "⚠️" }
  ];

  // Sprawdź URL hash i ustaw odpowiedni tab
  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash && tabs.find(tab => tab.id === hash)) {
      setActiveTab(hash);
    }
  }, []);

  return (
    <div className="space-y-8 animate-fade-in">
      <Topbar 
        title="Zadania" 
        subtitle="System CMMS - Maintenance Management"
        action={
          <button 
            onClick={() => setShowCreateModal(true)}
            className="btn-primary flex items-center gap-1 text-xs md:text-sm"
          >
            <span>+</span>
            <span className="hidden xs:inline">Nowe</span>
          </button>
        }
      />

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-6">
        {tabs.map((tab) => (
          <div key={tab.id} className="metric-card card-mobile md:p-6">
            <div className="flex items-center justify-between mb-1 md:mb-4">
              <div className={`w-6 h-6 md:w-12 md:h-12 bg-${tab.color}-500/20 rounded-lg md:rounded-xl flex items-center justify-center`}>
                <span className="text-sm md:text-2xl">{tab.icon}</span>
              </div>
              <div className={`px-1.5 py-0.5 md:px-3 md:py-1 bg-${tab.color}-500/20 text-${tab.color}-400 rounded-full text-xs font-bold`}>
                {tab.count}
              </div>
            </div>
            <h3 className="text-xs md:text-lg font-semibold text-white mb-0 md:mb-1">{tab.label}</h3>
            <p className="text-mobile-xs md:text-sm text-slate-400 hidden xs:block">Zadania</p>
          </div>
        ))}
      </div>

      {/* Advanced Tabs */}
      <div className="mobile-scroll-x md:block glass-card p-0.5 md:p-2">
        <div className="inline-flex md:grid md:grid-cols-4 gap-0.5 md:gap-2 w-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              data-tab={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1 md:gap-3 px-2 md:px-6 py-2 md:py-4 rounded-lg md:rounded-xl font-semibold transition-all duration-200 flex-1 text-xs md:text-base ${
                activeTab === tab.id
                  ? `gradient-primary text-white shadow-lg glow-${tab.color}`
                  : "text-slate-400 hover:text-white hover:bg-slate-700/50"
              }`}
            >
              <span className="text-sm md:text-lg">{tab.icon}</span>
              <div className="text-left">
                <div className="text-xs md:text-base">{tab.label}</div>
                <div className="text-mobile-xs md:text-xs opacity-70 hidden md:block">{tab.count} zadań</div>
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