export default function DailyScheduleTable({ shifts }) {
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
