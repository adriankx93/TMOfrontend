import { useEffect, useState } from "react";
import Topbar from "../components/Topbar";
import TaskList from "../components/TaskList";
import TaskPool from "../components/TaskPool";
import CreateTaskModal from "../components/CreateTaskModal";
import { useTasks } from "../hooks/useTasks";

// Jeśli korzystasz z lucide-react
import {
  AlertTriangle,
  AlertCircle,
  CheckCircle,
  Loader2,
  User
} from "lucide-react";

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

  const total = stats.current + stats.completed + stats.pool + stats.overdue || 1; // Zapobiega dzieleniu przez 0

  const percentCompleted = Math.round((stats.completed / total) * 100);
  const percentCurrent = Math.round((stats.current / total) * 100);
  const percentPool = Math.round((stats.pool / total) * 100);
  const percentOverdue = Math.round((stats.overdue / total) * 100);

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
    // eslint-disable-next-line
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

      {/* Nowoczesny pasek postępu */}
      <div className="w-full px-2 md:px-0">
        <div className="flex items-center gap-3">
          <div className="flex-1 h-4 rounded-xl bg-slate-200/80 shadow-inner flex overflow-hidden">
            <div
              className="transition-all duration-700 h-full bg-gradient-to-r from-green-400 to-green-600"
              style={{ width: `${percentCompleted}%` }}
              title="Zakończone"
            />
            <div
              className="transition-all duration-700 h-full bg-gradient-to-r from-blue-400 to-blue-600"
              style={{ width: `${percentCurrent}%` }}
              title="Aktywne"
            />
            <div
              className="transition-all duration-700 h-full bg-gradient-to-r from-amber-300 to-yellow-400"
              style={{ width: `${percentPool}%` }}
              title="Pula"
            />
            <div
              className="transition-all duration-700 h-full bg-gradient-to-r from-red-400 to-red-600"
              style={{ width: `${percentOverdue}%` }}
              title="Przeterminowane"
            />
          </div>
          <div className="flex flex-col items-end min-w-[70px]">
            <span className="text-xs font-semibold text-green-600">{percentCompleted}%</span>
            <span className="text-[10px] text-slate-400">zakończonych</span>
          </div>
        </div>
        <div className="flex justify-between mt-1 px-1 text-xs text-slate-500">
          <span>
            <span className="inline-flex items-center gap-1">
              <Loader2 className="w-3 h-3 text-blue-500" /> Aktywne
            </span> 
            : {stats.current}
          </span>
          <span>
            <span className="inline-flex items-center gap-1">
              <AlertCircle className="w-3 h-3 text-yellow-500" /> Pula
            </span> 
            : {stats.pool}
          </span>
          <span>
            <span className="inline-flex items-center gap-1">
              <CheckCircle className="w-3 h-3 text-green-500" /> Zakończone
            </span> 
            : {stats.completed}
          </span>
          <span>
            <span className="inline-flex items-center gap-1">
              <AlertTriangle className="w-3 h-3 text-red-500" /> Przeterminowane
            </span> 
            : {stats.overdue}
          </span>
        </div>
      </div>

      {/* Advanced Tabs */}
      <div className="glass-card p-0.5 md:p-2 overflow-x-auto w-full">
        <div className="flex flex-nowrap md:grid md:grid-cols-4 gap-0.5 md:gap-2 w-max md:w-full">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              data-tab={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1 md:gap-3 px-2 md:px-6 py-2 md:py-4 rounded-lg md:rounded-xl font-semibold transition-all duration-200 whitespace-nowrap md:flex-1 text-xs md:text-base min-w-[110px] md:min-w-0 ${
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
