import { useState, useEffect } from 'react';
import { sheetsService } from '../services/sheetsService';

export default function CurrentMonthPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const monthData = await sheetsService.getCurrentMonthShifts();
      setData(monthData);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Wystąpił błąd');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Grafik zmian - aktualny miesiąc</h1>

      <button
        onClick={fetchData}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        🔄 Odśwież dane
      </button>

      {loading && <p className="text-slate-600">⏳ Ładowanie danych...</p>}

      {error && (
        <div className="p-4 bg-red-100 border border-red-300 rounded text-red-700">
          {error}
        </div>
      )}

      {data && (
        <div className="space-y-4">
          <div className="p-4 bg-green-50 border border-green-200 rounded text-green-800">
            Dane wczytane z arkusza: <strong>{data.sheetName}</strong>
            <br />
            Miesiąc: {data.month + 1} / {data.year}
            <br />
            Liczba techników: {data.technicians.length}
            <br />
            Liczba zmian: {data.shifts.length}
          </div>

          {/* 🟢 Surowe dane diagnostyczne */}
          <div className="p-4 bg-slate-100 border border-slate-300 rounded overflow-x-auto text-sm">
            <h2 className="font-bold mb-2">Surowe dane debug:</h2>
            <pre className="whitespace-pre-wrap break-all">
              {JSON.stringify(data.debug, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
