import { useState, useEffect } from "react";
import Topbar from "../components/Topbar";
import { useTasks } from "../hooks/useTasks";
import { useTechnicians } from "../hooks/useTechnicians";

export default function ReportsPage() {
  const { tasks } = useTasks();
  const { technicians } = useTechnicians();
  const [selectedPeriod, setSelectedPeriod] = useState("week");
  const [reportData, setReportData] = useState({});

  useEffect(() => {
    generateReportData();
  }, [tasks, technicians, selectedPeriod]);

  const generateReportData = () => {
    const now = new Date();
    let startDate;

    switch(selectedPeriod) {
      case 'day':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      default:
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }

    const periodTasks = tasks.filter(task => 
      new Date(task.createdAt) >= startDate
    );

    const completedTasks = periodTasks.filter(task => task.status === 'completed');
    const totalTasks = periodTasks.length;
    const completionRate = totalTasks > 0 ? (completedTasks.length / totalTasks * 100).toFixed(1) : 0;

    setReportData({
      totalTasks,
      completedTasks: completedTasks.length,
      completionRate,
      avgTaskTime: completedTasks.length > 0 
        ? Math.round(completedTasks.reduce((acc, task) => acc + (task.estimatedDuration || 0), 0) / completedTasks.length)
        : 0
    });
  };

  const getPeriodLabel = () => {
    switch(selectedPeriod) {
      case 'day': return 'Dzisiaj';
      case 'week': return 'Ostatnie 7 dni';
      case 'month': return 'Bieżący miesiąc';
      default: return 'Ostatnie 7 dni';
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <Topbar 
        title="Analityka i raporty" 
        subtitle="KPI, metryki wydajności i business intelligence"
        action={
          <button className="btn-primary flex items-center gap-2">
            <span>📊</span>
            <span>Eksportuj raport</span>
          </button>
        }
      />

      {/* Period Selection */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white">Okres raportowania</h3>
          <div className="flex gap-2">
            {[
              { value: 'day', label: 'Dzisiaj' },
              { value: 'week', label: '7 dni' },
              { value: 'month', label: 'Miesiąc' }
            ].map(period => (
              <button
                key={period.value}
                onClick={() => setSelectedPeriod(period.value)}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                  selectedPeriod === period.value
                    ? 'gradient-primary text-white glow-blue'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                {period.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="metric-card">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <span className="text-2xl">📋</span>
            </div>
            <div className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm font-bold">
              {reportData.totalTasks || 0}
            </div>
          </div>
          <h3 className="text-lg font-semibold text-white mb-1">Łączne zadania</h3>
          <p className="text-slate-400 text-sm">{getPeriodLabel()}</p>
        </div>
        
        <div className="metric-card">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
              <span className="text-2xl">✅</span>
            </div>
            <div className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-sm font-bold">
              {reportData.completedTasks || 0}
            </div>
          </div>
          <h3 className="text-lg font-semibold text-white mb-1">Wykonane</h3>
          <p className="text-slate-400 text-sm">{getPeriodLabel()}</p>
        </div>
        
        <div className="metric-card">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
              <span className="text-2xl">📊</span>
            </div>
            <div className="px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full text-sm font-bold">
              {reportData.completionRate || 0}%
            </div>
          </div>
          <h3 className="text-lg font-semibold text-white mb-1">Wskaźnik wykonania</h3>
          <p className="text-slate-400 text-sm">{getPeriodLabel()}</p>
        </div>
        
        <div className="metric-card">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
              <span className="text-2xl">⏱️</span>
            </div>
            <div className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm font-bold">
              {reportData.avgTaskTime || 0}min
            </div>
          </div>
          <h3 className="text-lg font-semibold text-white mb-1">Średni czas zadania</h3>
          <p className="text-slate-400 text-sm">{getPeriodLabel()}</p>
        </div>
      </div>

      {/* Advanced Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-card p-8">
          <h3 className="text-xl font-bold text-white mb-6">Trendy wydajności</h3>
          <div className="h-64 flex items-center justify-center text-slate-400">
            <div className="text-center">
              <div className="text-4xl mb-4">📈</div>
              <p>Wykres trendów będzie dostępny wkrótce</p>
            </div>
          </div>
        </div>

        <div className="glass-card p-8">
          <h3 className="text-xl font-bold text-white mb-6">Analiza kategorii</h3>
          <div className="h-64 flex items-center justify-center text-slate-400">
            <div className="text-center">
              <div className="text-4xl mb-4">🎯</div>
              <p>Analiza kategorii zadań będzie dostępna wkrótce</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="glass-card p-8">
        <h3 className="text-xl font-bold text-white mb-6">Szybkie akcje</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-6 glass-card-light hover:bg-slate-600/30 rounded-2xl transition-all duration-200 text-left group">
            <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-200">📊</div>
            <div className="font-semibold text-blue-300">Generuj raport miesięczny</div>
            <div className="text-sm text-slate-400">Pełny raport wydajności</div>
          </button>
          
          <button className="p-6 glass-card-light hover:bg-slate-600/30 rounded-2xl transition-all duration-200 text-left group">
            <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-200">📧</div>
            <div className="font-semibold text-green-300">Wyślij powiadomienia</div>
            <div className="text-sm text-slate-400">Automatyczne raporty</div>
          </button>
          
          <button className="p-6 glass-card-light hover:bg-slate-600/30 rounded-2xl transition-all duration-200 text-left group">
            <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-200">📋</div>
            <div className="font-semibold text-purple-300">Eksportuj dane</div>
            <div className="text-sm text-slate-400">Excel, PDF, CSV</div>
          </button>
        </div>
      </div>
    </div>
  );
}