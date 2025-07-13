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

      {/* Advanced Tabs */}
      <div className="glass-card p-0.5 md:p-2 overflow-x-auto w-full">
        <div className="flex flex-nowrap md:grid md:grid-cols-4 gap-0.5 md:gap-2 w-max md:w-full">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              data-tab={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1 md:gap-3 px-2 md:px-6 py-2 md:py-4 rounded-lg md:rounded-xl font-semibold transition-all duration-200 whitespace-nowrap md:flex-1 text-xs md:text-base ${
                activeTab === tab.id
                  ? `gradient-primary text-white shadow-lg glow-${tab.color}`
                  : "text-slate-400 hover:text-white hover:bg-slate-700/50"
              }`}
            >
              <span className="text-sm md:text-lg">{tab.icon}</span>
              <div className="text-left min-w-0">
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
