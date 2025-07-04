export default function Topbar({ title, subtitle, action }) {
  const currentTime = new Date().toLocaleTimeString('pl-PL', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
  
  const currentDate = new Date().toLocaleDateString('pl-PL', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <header className="bg-white/80 backdrop-blur-xl border border-white/20 shadow-xl rounded-3xl mb-8 p-6">
      <div className="flex justify-between items-center">
        {/* Title Section */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-white text-xl">🏢</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              {title}
            </h1>
            <p className="text-slate-500 text-sm font-medium">
              {subtitle}
            </p>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex gap-4 items-center">
          {/* Time and Date */}
          <div className="hidden lg:block text-right mr-4">
            <div className="text-lg font-bold text-slate-800">{currentTime}</div>
            <div className="text-sm text-slate-500 capitalize">{currentDate}</div>
          </div>

          {/* Action Button */}
          {action && action}

          {/* Search */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <span className="text-slate-400">🔍</span>
            </div>
            <input
              className="pl-12 pr-4 py-3 w-80 rounded-2xl border border-slate-200 bg-slate-50/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition-all duration-200 placeholder-slate-400 font-medium"
              placeholder="Szukaj zadań, techników..."
            />
          </div>

          {/* Notifications */}
          <button className="relative p-3 rounded-2xl bg-slate-100 hover:bg-slate-200 transition-all duration-200 group">
            <span className="text-xl group-hover:scale-110 transition-transform duration-200">🔔</span>
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">3</span>
            </div>
          </button>

          {/* Profile */}
          <button className="flex items-center gap-3 p-2 rounded-2xl hover:bg-slate-100 transition-all duration-200 group">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center font-bold text-white shadow-lg group-hover:scale-105 transition-transform duration-200">
              K
            </div>
            <div className="hidden lg:block text-left">
              <div className="font-semibold text-slate-800 text-sm">Koordynator</div>
              <div className="text-slate-500 text-xs">Online</div>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
}