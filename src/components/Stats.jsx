function StatCard({ icon, title, value, trend, trendValue, color = "orange" }) {
  const colorClasses = {
    orange: "from-orange-500 to-red-600",
    blue: "from-blue-500 to-indigo-600",
    emerald: "from-emerald-500 to-teal-600", 
    amber: "from-amber-500 to-orange-600",
    purple: "from-purple-500 to-violet-600"
  };

  return (
    <div className="group bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl shadow-xl p-8 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300">
      <div className="flex items-start justify-between mb-6">
        <div className={`w-16 h-16 bg-gradient-to-br ${colorClasses[color]} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
          <span className="text-2xl">{icon}</span>
        </div>
        {trend && (
          <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
            trend === 'up' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
          }`}>
            <span>{trend === 'up' ? '↗️' : '↘️'}</span>
            <span>{trendValue}</span>
          </div>
        )}
      </div>
      
      <div className="space-y-2">
        <div className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
          {value}
        </div>
        <div className="text-slate-600 font-semibold text-lg">
          {title}
        </div>
      </div>
    </div>
  );
}

export default function Stats() {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
      <StatCard 
        icon="👷" 
        title="Technicy na zmianie" 
        value="6" 
        trend="up" 
        trendValue="+1" 
        color="orange"
      />
      <StatCard 
        icon="📋" 
        title="Zadania w toku" 
        value="12" 
        trend="down" 
        trendValue="-3%" 
        color="blue"
      />
      <StatCard 
        icon="🔄" 
        title="Pula zadań" 
        value="8" 
        trend="up" 
        trendValue="+2" 
        color="amber"
      />
      <StatCard 
        icon="✅" 
        title="Wykonane dziś" 
        value="24" 
        trend="up" 
        trendValue="+15%" 
        color="emerald"
      />
    </section>
  );
}