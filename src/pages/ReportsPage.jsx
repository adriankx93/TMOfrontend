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

    // Task completion by technician
    const technicianStats = technicians.map(tech => {
      const techTasks = periodTasks.filter(task => task.assignedTo === tech._id);
      const techCompleted = techTasks.filter(task => task.status === 'completed');
      
      return {
        name: `${tech.firstName} ${tech.lastName}`,
        specialization: tech.specialization,
        shift: tech.shift,
        totalTasks: techTasks.length,
        completedTasks: techCompleted.length,
        completionRate: techTasks.length > 0 ? (techCompleted.length / techTasks.length * 100).toFixed(1) : 0,
        avgTime: techCompleted.length > 0 
          ? Math.round(techCompleted.reduce((acc, task) => acc + (task.estimatedDuration || 0), 0) / techCompleted.length)
          : 0
      };
    });

    // Task completion by category
    const categoryStats = {};
    periodTasks.forEach(task => {
      if (!categoryStats[task.category]) {
        categoryStats[task.category] = { total: 0, completed: 0 };
      }
      categoryStats[task.category].total++;
      if (task.status === 'completed') {
        categoryStats[task.category].completed++;
      }
    });

    // Task completion by shift
    const shiftStats = {
      'Dzienna': { total: 0, completed: 0 },
      'Nocna': { total: 0, completed: 0 }
    };
    
    periodTasks.forEach(task => {
      shiftStats[task.shift].total++;
      if (task.status === 'completed') {
        shiftStats[task.shift].completed++;
      }
    });

    // Priority distribution
    const priorityStats = {
      'Wysoki': { total: 0, completed: 0 },
      'Średni': { total: 0, completed: 0 },
      'Niski': { total: 0, completed: 0 }
    };

    periodTasks.forEach(task => {
      priorityStats[task.priority].total++;
      if (task.status === 'completed') {
        priorityStats[task.priority].completed++;
      }
    });

    setReportData({
      totalTasks,
      completedTasks: completedTasks.length,
      completionRate,
      technicianStats,
      categoryStats,
      shiftStats,
      priorityStats,
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
    <div className="space-y-8">
      <Topbar 
        title="Raporty i statystyki" 
        subtitle="Analizuj wydajność i efektywność pracy"
      />

      {/* Period Selection */}
      <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl shadow-xl p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-800">Okres raportowania</h3>
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
                    ? 'bg-orange-500 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
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
        <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl shadow-xl p-6 text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">{reportData.totalTasks || 0}</div>
          <div className="text-slate-600 font-medium">Łączne zadania</div>
          <div className="text-sm text-slate-500 mt-1">{getPeriodLabel()}</div>
        </div>
        
        <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl shadow-xl p-6 text-center">
          <div className="text-3xl font-bold text-emerald-600 mb-2">{reportData.completedTasks || 0}</div>
          <div className="text-slate-600 font-medium">Wykonane</div>
          <div className="text-sm text-slate-500 mt-1">{getPeriodLabel()}</div>
        </div>
        
        <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl shadow-xl p-6 text-center">
          <div className="text-3xl font-bold text-orange-600 mb-2">{reportData.completionRate || 0}%</div>
          <div className="text-slate-600 font-medium">Wskaźnik wykonania</div>
          <div className="text-sm text-slate-500 mt-1">{getPeriodLabel()}</div>
        </div>
        
        <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl shadow-xl p-6 text-center">
          <div className="text-3xl font-bold text-purple-600 mb-2">{reportData.avgTaskTime || 0}min</div>
          <div className="text-slate-600 font-medium">Średni czas zadania</div>
          <div className="text-sm text-slate-500 mt-1">{getPeriodLabel()}</div>
        </div>
      </div>

      {/* Technician Performance */}
      <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl shadow-xl p-8">
        <h3 className="text-xl font-bold text-slate-800 mb-6">Wydajność techników</h3>
        
        {reportData.technicianStats?.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            Brak danych o technikach w wybranym okresie
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Technik</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Specjalizacja</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Zmiana</th>
                  <th className="text-center py-3 px-4 font-semibold text-slate-700">Zadania</th>
                  <th className="text-center py-3 px-4 font-semibold text-slate-700">Wykonane</th>
                  <th className="text-center py-3 px-4 font-semibold text-slate-700">Wskaźnik</th>
                  <th className="text-center py-3 px-4 font-semibold text-slate-700">Śr. czas</th>
                </tr>
              </thead>
              <tbody>
                {reportData.technicianStats?.map((tech, index) => (
                  <tr key={index} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-4 px-4 font-medium text-slate-800">{tech.name}</td>
                    <td className="py-4 px-4 text-slate-600">{tech.specialization}</td>
                    <td className="py-4 px-4 text-slate-600">{tech.shift}</td>
                    <td className="py-4 px-4 text-center text-slate-800">{tech.totalTasks}</td>
                    <td className="py-4 px-4 text-center text-emerald-600 font-semibold">{tech.completedTasks}</td>
                    <td className="py-4 px-4 text-center">
                      <span className={`px-2 py-1 rounded-lg text-sm font-semibold ${
                        tech.completionRate >= 80 ? 'bg-emerald-100 text-emerald-800' :
                        tech.completionRate >= 60 ? 'bg-amber-100 text-amber-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {tech.completionRate}%
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center text-slate-600">{tech.avgTime}min</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Category and Shift Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Category Stats */}
        <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl shadow-xl p-8">
          <h3 className="text-xl font-bold text-slate-800 mb-6">Zadania wg kategorii</h3>
          
          <div className="space-y-4">
            {Object.entries(reportData.categoryStats || {}).map(([category, stats]) => (
              <div key={category} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                <div>
                  <div className="font-semibold text-slate-800">{category}</div>
                  <div className="text-sm text-slate-600">
                    {stats.completed} z {stats.total} zadań
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-orange-600">
                    {stats.total > 0 ? Math.round(stats.completed / stats.total * 100) : 0}%
                  </div>
                  <div className="w-20 bg-slate-200 rounded-full h-2 mt-1">
                    <div 
                      className="bg-gradient-to-r from-orange-500 to-red-600 h-2 rounded-full"
                      style={{ width: `${stats.total > 0 ? (stats.completed / stats.total * 100) : 0}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Shift Stats */}
        <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl shadow-xl p-8">
          <h3 className="text-xl font-bold text-slate-800 mb-6">Zadania wg zmian</h3>
          
          <div className="space-y-4">
            {Object.entries(reportData.shiftStats || {}).map(([shift, stats]) => (
              <div key={shift} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                <div>
                  <div className="font-semibold text-slate-800">Zmiana {shift}</div>
                  <div className="text-sm text-slate-600">
                    {stats.completed} z {stats.total} zadań
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-blue-600">
                    {stats.total > 0 ? Math.round(stats.completed / stats.total * 100) : 0}%
                  </div>
                  <div className="w-20 bg-slate-200 rounded-full h-2 mt-1">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full"
                      style={{ width: `${stats.total > 0 ? (stats.completed / stats.total * 100) : 0}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Priority Stats */}
          <div className="mt-8">
            <h4 className="text-lg font-bold text-slate-800 mb-4">Zadania wg priorytetu</h4>
            <div className="space-y-3">
              {Object.entries(reportData.priorityStats || {}).map(([priority, stats]) => (
                <div key={priority} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <div className="text-sm">
                    <span className="font-semibold text-slate-800">{priority}</span>
                    <span className="text-slate-600 ml-2">({stats.completed}/{stats.total})</span>
                  </div>
                  <div className="text-sm font-bold text-slate-700">
                    {stats.total > 0 ? Math.round(stats.completed / stats.total * 100) : 0}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}