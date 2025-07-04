function StatCard({ icon, title, value }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-7 flex flex-col gap-2 items-start min-w-[180px] flex-1 hover:scale-[1.03] transition">
      <div className="text-3xl">{icon}</div>
      <div className="text-lg text-blue-900 font-bold">{value}</div>
      <div className="text-slate-500 font-medium">{title}</div>
    </div>
  );
}

export default function Stats() {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7 mb-10">
      <StatCard icon="👤" title="Użytkownicy" value="8" />
      <StatCard icon="🛠️" title="Zgłoszenia" value="17" />
      <StatCard icon="🚗" title="Technicy" value="4" />
      <StatCard icon="⭐" title="Ocena systemu" value="4.9/5" />
    </section>
  );
}
