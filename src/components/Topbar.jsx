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
    <header className="glass-card mb-1 md:mb-8 p-1.5 md:p-6 animate-slide-in-up">
      <div className="flex justify-between items-center gap-1">
        {/* Title Section - Added min-w-0 to prevent overflow */}
        <div className="flex items-center gap-1 md:gap-6 flex-1 min-w-0">
          <div>
            <h1 className="text-xs md:text-3xl font-bold text-white mb-0 md:mb-1 truncate">
              {title}
            </h1>
            <p className="text-slate-400 mobile-micro-text md:text-lg font-medium hidden md:block truncate">
              {subtitle}
            </p>
          </div>
        </div>

        {/* Right Section - Added flex-nowrap */}
        <div className="flex flex-nowrap gap-0.5 md:gap-6 items-center">
          {/* Time and Date */}
          <div className="hidden md:block text-right">
            <div className="text-xl md:text-2xl font-bold text-white">{currentTime}</div>
            <div className="text-sm text-slate-400 capitalize">{currentDate}</div>
          </div>

          {/* Action Button */}
          {action && action}

          {/* Search */}
          <div className="relative hidden lg:block">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <span className="text-slate-400">🔍</span>
            </div>
            <input
              className="input-field pl-12 pr-4 py-3 w-80 placeholder-slate-400"
              placeholder="Szukaj w systemie..."
            />
          </div>

          {/* Notifications */}
          <button className="relative p-0.5 md:p-3 glass-card-light hover:bg-slate-600/30 transition-all duration-200 group">
            <span className="text-sm md:text-xl group-hover:scale-110 transition-transform duration-200">N</span>
            <div className="absolute -top-0.5 -right-0.5 md:-top-1 md:-right-1 w-2 h-2 md:w-5 md:h-5 bg-red-500 rounded-full flex items-center justify-center glow-red">
              <span className="text-white mobile-micro-text md:text-xs font-bold">3</span>
            </div>
          </button>

          {/* Quick Actions */}
          <button className="p-0.5 md:p-3 glass-card-light hover:bg-slate-600/30 transition-all duration-200 group hidden lg:block">
            <span className="text-xl group-hover:scale-110 transition-transform duration-200">U</span>
          </button>
        </div>
      </div>
    </header>
  );
}