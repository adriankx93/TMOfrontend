import { useState, useEffect } from "react";
import { sheetsService } from "../services/sheetsService";

export default function CurrentMonthChart() {
  const [data, setData] = useState({
    technicians: [],
    shifts: [],
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
    sheetName: ""
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [connectionTest, setConnectionTest] = useState(null);

  const months = [
    "Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec",
    "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień"
  ];

  useEffect(() => {
    testConnection();
    fetchCurrentMonthData();
    const interval = setInterval(fetchCurrentMonthData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const testConnection = async () => {
    try {
      const result = await sheetsService.testConnection();
      setConnectionTest(result);
    } catch (err) {
      setConnectionTest({
        success: false,
        message: err.message,
        sheets: []
      });
    }
  };

  const fetchCurrentMonthData = async () => {
    try {
      setLoading(true);
      setError(null);
      const monthData = await sheetsService.getCurrentMonthShifts();
      setData(monthData);
    } catch (err) {
      setError(err.message || "Błąd podczas pobierania danych");
    } finally {
      setLoading(false);
    }
  };

  const getMonthStats = () => {
    if (!data.shifts || data.shifts.length === 0) {
      return {
        totalDays: 0,
        totalWorkingDays: 0,
        avgWorkersPerDay: 0,
        allTechnicians: new Set()
      };
    }
    const totalDays = data.shifts.length;
    const totalWorkingDays = data.shifts.filter(s => s.totalWorking > 0).length;

    const allTechnicians = new Set();
    let totalWorkers = 0;

    data.shifts.forEach(shift => {
      [...(shift.dayTechnicians || []), ...(shift.nightTechnicians || []), ...(shift.firstShiftTechnicians || [])]
        .forEach(t => {
          allTechnicians.add(t);
          totalWorkers++;
        });
    });

    return {
      totalDays,
      totalWorkingDays,
      avgWorkersPerDay: totalDays > 0 ? (totalWorkers / totalDays).toFixed(1) : 0,
      allTechnicians
    };
  };

  const getTechnicianWorkload = () => {
    if (!data.shifts || data.shifts.length === 0) return [];

    const stats = {};
    data.shifts.forEach(shift => {
      const add = (type, arr) => {
        (arr || []).forEach(name => {
          if (!stats[name]) {
            stats[name] = { day: 0, night: 0, first: 0, vacation: 0, l4: 0 };
          }
          stats[name][type]++;
        });
      };
      add("day", shift.dayTechnicians);
      add("night", shift.nightTechnicians);
      add("first", shift.firstShiftTechnicians);
      add("vacation", shift.vacationTechnicians);
      add("l4", shift.l4Technicians);
    });

    return Object.entries(stats).map(([name, s]) => ({
      name,
      dayShifts: s.day,
      nightShifts: s.night,
      firstShifts: s.first,
      vacationDays: s.vacation,
      l4Days: s.l4,
      totalShifts: s.day + s.night,
      workingDays: s.day + s.night,
      totalDays: s.day + s.night + s.vacation + s.l4
    })).sort((a, b) => b.totalShifts - a.totalShifts);
  };

  const stats = getMonthStats();
  const workload = getTechnicianWorkload();

  if (loading) {
    return <div className="p-8 text-center">Ładowanie danych...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl shadow-xl p-8 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">
              Grafik zmian - {months[data.month]} {data.year}
            </h1>
            <p className="text-blue-100 text-lg mt-1">
              Dane z arkusza "{data.sheetName}"
            </p>
          </div>
          <button
            onClick={fetchCurrentMonthData}
            className="px-6 py-3 bg-white/20 backdrop-blur-xl rounded-xl border border-white/20"
          >
            🔄 Odśwież
          </button>
        </div>
      </div>

      <StatisticsCards stats={stats} />

      <TechnicianWorkload workload={workload} technicians={data.technicians} />

      <DailyScheduleTable shifts={data.shifts} />
    </div>
  );
}

/**
 * Statystyki miesiąca
 */
function StatisticsCards({ stats }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      <Card icon="📅" color="blue" label="Dni w miesiącu" value={stats.totalDays} />
      <Card icon="👥" color="emerald" label="Aktywni technicy" value={stats.allTechnicians.size} />
      <Card icon="💼" color="orange" label="Dni robocze" value={stats.totalWorkingDays} />
      <Card icon="📊" color="purple" label="Śr. pracowników/dzień" value={stats.avgWorkersPerDay} />
    </div>
  );
}
function Card({ icon, color, label, value }) {
  return (
    <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-2xl p-6 text-center">
      <div className={`w-12 h-12 bg-${color}-100 rounded-2xl flex items-center justify-center mx-auto mb-3`}>
        <span className="text-2xl">{icon}</span>
      </div>
      <div className={`text-3xl font-bold text-${color}-600 mb-1`}>{value}</div>
      <div className="text-slate-600 font-medium">{label}</div>
    </div>
  );
}

/**
 * Lista techników
 */
function TechnicianWorkload({ workload, technicians }) {
  if (workload.length === 0) {
    return (
      <div className="text-center py-12 text-slate-500">
        <span className="text-4xl mb-4 block">📋</span>
        Brak danych dla aktualnego miesiąca
      </div>
    );
  }
  return (
    <div className="space-y-4">
      {workload.map((tech, i) => {
        const max = Math.max(...workload.map(t => t.totalShifts));
        const pct = max > 0 ? (tech.totalShifts / max) * 100 : 0;
        return (
          <div key={i} className="p-4 border rounded-xl bg-white/80">
            <div className="flex justify-between items-center">
              <div className="font-bold">{tech.name}</div>
              <div>{tech.totalShifts} zmian</div>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-3 mt-2">
              <div className="h-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full" style={{ width: `${pct}%` }}></div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/**
 * Tabela harmonogramu
 */
function DailyScheduleTable({ shifts }) {
  if (shifts.length === 0) {
    return (
      <div className="text-center py-12 text-slate-500">
        <span className="text-4xl mb-4 block">📅</span>
        Brak danych zmian dla aktualnego miesiąca
      </div>
    );
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="p-2 text-left">Data</th>
            <th className="p-2 text-left">Dzienna + pierwsza</th>
            <th className="p-2 text-left">Nocna</th>
            <th className="p-2 text-left">Urlopy</th>
            <th className="p-2 text-left">L4</th>
          </tr>
        </thead>
        <tbody>
          {shifts.map((s, i) => (
            <tr key={i} className="border-b">
              <td className="p-2">{new Date(s.date).toLocaleDateString("pl-PL")}</td>
              <td className="p-2">{[...(s.dayTechnicians || []), ...(s.firstShiftTechnicians || [])].join(", ") || "-"}</td>
              <td className="p-2">{(s.nightTechnicians || []).join(", ") || "-"}</td>
              <td className="p-2">{(s.vacationTechnicians || []).join(", ") || "-"}</td>
              <td className="p-2">{(s.l4Technicians || []).join(", ") || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
