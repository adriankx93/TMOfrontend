import { useEffect, useState } from "react";
import Topbar from "../components/Topbar";
import Stats from "../components/Stats";
import TodayShiftOverview from "../components/TodayShiftOverview";
import SheetsDashboardStats from "../components/SheetsDashboardStats";
import TasksOverview from "../components/TasksOverview";
import TechniciansStatus from "../components/TechniciansStatus";
import { useTasks } from "../hooks/useTasks";
import { useTechnicians } from "../hooks/useTechnicians";
import { sheetsService } from "../services/sheetsService";

export default function Dashboard() {
  const { tasks } = useTasks();
  const { technicians } = useTechnicians();
  const [dashboardStats, setDashboardStats] = useState({
    activeTechnicians: 0,
    currentTasks: 0,
    completedToday: 0,
    poolTasks: 0
  });
  const [sheetsStats, setSheetsStats] = useState({
    totalTechniciansFromSheets: 0,
    workingToday: 0,
    onVacation: 0,
    onSickLeave: 0
  });

  useEffect(() => {
    calculateStats();
    fetchSheetsStats();
    
    // Refresh sheets data every 10 minutes
    const interval = setInterval(fetchSheetsStats, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, [tasks, technicians]);

  const calculateStats = () => {
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
  };

  const fetchSheetsStats = async () => {
    try {
      const data = await sheetsService.getCurrentMonthData();
      
      const today = new Date();
      const todayShift = data.shifts.find(shift => {
        const shiftDate = new Date(shift.date);
        return shiftDate.toDateString() === today.toDateString();
      });

      setSheetsStats({
        totalTechniciansFromSheets: data.technicians.length,
        workingToday: todayShift ? todayShift.totalWorking : 0,
        onVacation: todayShift ? todayShift.vacationTechnicians.length : 0,
        onSickLeave: todayShift ? todayShift.l4Technicians.length : 0
      });
    } catch (error) {
      console.error('Error fetching sheets stats:', error);
    }
  };

  return (
    <div className="space-y-8">
      <Topbar title="Dashboard" subtitle="Przegląd systemu Miasteczko Orange" />
      
      {/* Combined Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-lg font-bold text-slate-800 mb-4">Statystyki systemu TMO</h2>
          <Stats stats={dashboardStats} />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-800 mb-4">Dane z arkusza Google Sheets</h2>
          <SheetsDashboardStats />
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <TodayShiftOverview />
        <TechniciansStatus />
      </div>
      
      <TasksOverview />
    </div>
  );
}