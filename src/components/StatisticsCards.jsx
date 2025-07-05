export default function StatisticsCards({ stats }) {
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
