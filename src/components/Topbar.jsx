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
    <header className="glass-card mb-8 p-6 animate-slide-in-up">
      <div className="flex justify-between items-center">
        {/* Title Section */}
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center shadow-lg glow-blue">
            <span className="text-white text-2xl">⚡</span>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">
              {title}
            </h1>
            <p className="text-slate-400 text-lg font-medium">
              {subtitle}
            </p>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex gap-6 items-center">
          {/* Time and Date */}
          <div className="hidden lg:block text-right">
            <div className="text-2xl font-bold text-white">{currentTime}</div>
            <div className="text-sm text-slate-400 capitalize">{currentDate}</div>
          </div>

          {/* Action Button */}
          {action && action}

          {/* Search */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <span className="text-slate-400">🔍</span>
            </div>
            <input
              className="input-field pl-12 pr-4 py-3 w-80 placeholder-slate-400"
              placeholder="Szukaj w systemie..."
            />
          </div>

          {/* Notifications */}
          <button className="relative p-3 glass-card-light hover:bg-slate-600/30 transition-all duration-200 group">
            <span className="text-xl group-hover:scale-110 transition-transform duration-200">🔔</span>
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center glow-red">
              <span className="text-white text-xs font-bold">3</span>
            </div>
          </button>

          {/* Quick Actions */}
          <button className="p-3 glass-card-light hover:bg-slate-600/30 transition-all duration-200 group">
            <span className="text-xl group-hover:scale-110 transition-transform duration-200">⚙️</span>
          </button>
        </div>
      </div>
    </header>
  );
}