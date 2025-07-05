import { useState, useEffect } from "react";
import { sheetsService } from "../services/sheetsService";
import StatisticsCards from "./StatisticsCards";
import TechnicianWorkload from "./TechnicianWorkload";
import DailyScheduleTable from "./DailyScheduleTable";

export default function CurrentMonthChart() {
  const [data, setData] = useState({
    technicians: [],
    shifts: [],
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
    sheetName: "",
    debugRawData: {}
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const months = [
    "Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec",
    "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień"
  ];

  useEffect(() => {
    fetchCurrentMonthData();
  }, []);

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

  const stats = getMonthStats();

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
              Dane z arkusza <strong>{data.sheetName}</strong>
            </p>
          </div>
          <button
            onClick={fetchCurrentMonthData}
            className="px-6 py-3 bg-white/20 backdrop-blur-xl rounded-xl border border-white/20"
          >
            🔄 Odśwież dane
          </button>
        </div>
      </div>

      <StatisticsCards stats={stats} />
      <TechnicianWorkload workload={[]} />
      <DailyScheduleTable shifts={data.shifts} />

      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-2">📋 Surowe dane debug:</h2>
        <pre className="bg-gray-100 text-black p-4 text-xs overflow-x-auto rounded-lg">
          {JSON.stringify(data.debugRawData, null, 2)}
        </pre>
      </div>
    </div>
  );
}
