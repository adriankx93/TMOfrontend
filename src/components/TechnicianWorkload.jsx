export default function TechnicianWorkload({ workload }) {
  if (workload.length === 0) {
    return (
      <div className="text-center py-12 text-slate-500">
        <span className="text-4xl mb-4 block">📋</span>
        Brak danych dla aktualnego miesiąca
      </div>
    );
  }
  const max = Math.max(...workload.map(t => t.totalShifts));
  return (
    <div className="space-y-4">
      {workload.map((tech, i) => {
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
