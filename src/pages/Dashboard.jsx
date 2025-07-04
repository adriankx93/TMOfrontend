import { useEffect, useState } from "react";
import Topbar from "../components/Topbar";
import Stats from "../components/Stats";
import ShiftOverview from "../components/ShiftOverview";
import TasksOverview from "../components/TasksOverview";
import TechniciansStatus from "../components/TechniciansStatus";
import { useTasks } from "../hooks/useTasks";
import { useTechnicians } from "../hooks/useTechnicians";

export default function Dashboard() {
  const { tasks } = useTasks();
  const { technicians } = useTechnicians();
  const [dashboardStats, setDashboardStats] = useState({
    activeTechnicians: 0,
    currentTasks: 0,
    completedToday: 0,
    poolTasks: 0
  });

  useEffect(() => {
    // Calculate real-time statistics
    const activeTechnicians = technicians.filter(t => t.status === 'active').length;
    const currentTasks = tasks.filter(t => ['assigned', 'in_progress'].includes(t.status)).length;
    const poolTasks = tasks.filter(t => t.status === 'pool').length;
    
    const today = new Date().toDateString();
    const completedToday = tasks.filter(t => 
      t.status === 'completed' && 
      t.completedAt && 
      new Date(t.completedAt).toDateString() === today
    ).length;

    setDashboardStats({
      activeTechnicians,
      currentTasks,
      completedToday,
      poolTasks
    });
  }, [tasks, technicians]);

  return (
    <div className="space-y-8">
      <Topbar title="Dashboard" subtitle="Przegląd systemu Miasteczko Orange" />
      <Stats stats={dashboardStats} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ShiftOverview />
        <TechniciansStatus />
      </div>
      <TasksOverview />
    </div>
  );
}