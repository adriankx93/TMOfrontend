export default function DashboardCards() {
  const cards = [
    { title: "Aktywni użytkownicy", value: 8, icon: "👤" },
    { title: "Zgłoszenia", value: 17, icon: "🛠️" },
    { title: "Technicy w terenie", value: 4, icon: "🚗" },
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
      {cards.map((c) => (
        <div key={c.title} className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center hover:scale-105 transition">
          <div className="text-4xl mb-2">{c.icon}</div>
          <div className="text-2xl font-bold text-blue-900">{c.value}</div>
          <div className="text-gray-700">{c.title}</div>
        </div>
      ))}
    </div>
  );
}
