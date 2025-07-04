export default function TicketsTable() {
  const tickets = [
    { id: 1, title: "Awaria światła", status: "Nowe", tech: "Jan Nowak", date: "2025-07-01" },
    { id: 2, title: "Uszkodzona brama", status: "W trakcie", tech: "Alicja K.", date: "2025-07-02" },
    { id: 3, title: "Czujnik alarmu", status: "Zamknięte", tech: "Piotr Z.", date: "2025-07-03" },
  ];
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 mt-2">
      <div className="text-xl font-bold mb-4 text-blue-900">Zgłoszenia</div>
      <table className="min-w-full">
        <thead>
          <tr className="text-left bg-blue-50">
            <th className="py-3 px-6 rounded-l-xl">Temat</th>
            <th className="py-3 px-6">Status</th>
            <th className="py-3 px-6">Technik</th>
            <th className="py-3 px-6 rounded-r-xl">Data</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((t, i) => (
            <tr key={t.id} className="hover:bg-blue-50 transition">
              <td className="py-3 px-6 font-semibold">{t.title}</td>
              <td className="py-3 px-6">
                <span className={
                  t.status === "Nowe" ? "bg-blue-200 text-blue-800 px-3 py-1 rounded-full text-xs font-bold" :
                  t.status === "W trakcie" ? "bg-yellow-200 text-yellow-800 px-3 py-1 rounded-full text-xs font-bold" :
                  "bg-green-200 text-green-800 px-3 py-1 rounded-full text-xs font-bold"
                }>
                  {t.status}
                </span>
              </td>
              <td className="py-3 px-6">{t.tech}</td>
              <td className="py-3 px-6">{t.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
