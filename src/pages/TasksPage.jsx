import { useEffect, useState } from "react";
import Topbar from "../components/Topbar";
import TaskList from "../components/TaskList";
import TaskPool from "../components/TaskPool";
import CreateTaskModal from "../components/CreateTaskModal";
import EditTaskModal from "../components/EditTaskModal";
import { getEmployees } from "../services/sheetsService"; // Import pracowników

export default function TasksPage() {
  const [activeTab, setActiveTab] = useState("current");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedDate, setSelectedDate] = useState(() => {
    const now = new Date();
    return now.toISOString().substring(0, 10); // YYYY-MM-DD
  });

  // Załaduj pracowników z sheetsService
  useEffect(() => {
    getEmployees().then(setEmployees);
  }, []);

  // Przykładowe statystyki – można dynamicznie liczyć po taskach
  const tabs = [
    { id: "current", label: "Aktywne", icon: "⚡", count: 12, color: "blue" },
    { id: "pool", label: "Pula zadań", icon: "🔄", count: 5, color: "amber" },
    { id: "completed", label: "Zakończone", icon: "✅", count: 28, color: "green" },
    { id: "overdue", label: "Przeterminowane", icon: "⚠️", count: 3, color: "red" }
  ];

  // Otwórz modal edycji zadania (po kliknięciu "Edytuj" na liście)
  const handleEdit = (task) => {
    setSelectedTask(task);
    setShowEditModal(true);
  };

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
            <div className={`flex items-center justify-between mb-4`}>
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

      {/* Filtr po dacie i wyborze pracownika */}
      <div className="flex flex-wrap gap-4 items-center justify-between glass-card p-4">
        <div>
          <label className="block mb-1 text-slate-400 text-sm">Wybierz datę:</label>
          <input
            type="date"
            value={selectedDate}
            onChange={e => setSelectedDate(e.target.value)}
            className="rounded-xl px-4 py-2 bg-slate-700/50 text-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>
        <div>
          <label className="block mb-1 text-slate-400 text-sm">Pracownicy (do przypisania zadań):</label>
          <select className="rounded-xl px-4 py-2 bg-slate-700/50 text-slate-200">
            <option value="">Wszyscy pracownicy</option>
            {employees.map(e => (
              <option key={e.id || e.email || e.name} value={e.id || e.email}>{e.name}</option>
            ))}
          </select>
        </div>
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

      {/* Content – przekaż propsy: pracownicy, wybraną datę, handler do edycji */}
      <div className="animate-slide-in-up">
        {activeTab === "current" && (
          <TaskList 
            type="current"
            selectedDate={selectedDate}
            employees={employees}
            onEditTask={handleEdit}
          />
        )}
        {activeTab === "pool" && (
          <TaskPool
            employees={employees}
            onEditTask={handleEdit}
          />
        )}
        {activeTab === "completed" && (
          <TaskList 
            type="completed"
            selectedDate={selectedDate}
            employees={employees}
            onEditTask={handleEdit}
          />
        )}
        {activeTab === "overdue" && (
          <TaskList 
            type="overdue"
            selectedDate={selectedDate}
            employees={employees}
            onEditTask={handleEdit}
          />
        )}
      </div>

      {/* Create Task Modal */}
      {showCreateModal && (
        <CreateTaskModal 
          onClose={() => setShowCreateModal(false)} 
          onTaskCreated={() => setShowCreateModal(false)}
          employees={employees}
          selectedDate={selectedDate}
        />
      )}

      {/* Edit Task Modal */}
      {showEditModal && (
        <EditTaskModal
          task={selectedTask}
          employees={employees}
          onClose={() => {
            setShowEditModal(false);
            setSelectedTask(null);
          }}
          onTaskUpdated={() => setShowEditModal(false)}
        />
      )}
    </div>
  );
}
