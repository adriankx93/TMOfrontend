import ThemeToggle from "./ThemeToggle";
import { useState, useEffect } from "react";

export default function Topbar({ title, subtitle, action }) {
  const [currentTime, setCurrentTime] = useState(new Date());
  
  useEffect(() => {
    // Initial time sync
    syncTimeWithServer();
    
    // Update time every second
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    // Sync with server every 10 minutes
    const syncInterval = setInterval(syncTimeWithServer, 10 * 60 * 1000);
    
    return () => {
      clearInterval(timeInterval);
      clearInterval(syncInterval);
    };
  }, []);
  
  const syncTimeWithServer = async () => {
    try {
      // Fetch time from WorldTimeAPI for Warsaw
      const response = await fetch('https://worldtimeapi.org/api/timezone/Europe/Warsaw');
      const data = await response.json();
      
      if (data && data.datetime) {
        // Parse the datetime string to get a Date object
        const serverTime = new Date(data.datetime);
        setCurrentTime(serverTime);
      }
    } catch (error) {
      console.error('Error fetching time:', error);
      // Fallback to local time if API fails
      setCurrentTime(new Date());
    }
  };
  
  const formattedTime = currentTime.toLocaleTimeString('pl-PL', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
  
  const currentDate = currentTime.toLocaleDateString('pl-PL', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <header className="glass-card mb-1 md:mb-8 p-1.5 md:p-6 animate-slide-in-up">
      <div className="flex justify-between items-center gap-1">
        {/* Title Section */}
        <div className="flex items-center gap-1 md:gap-6 flex-1 min-w-0 dark:text-white light:text-slate-800">
          <div>
            <h1 className="text-xs md:text-3xl font-bold mb-0 md:mb-1 truncate">
              {title}
            </h1>
            <p className="mobile-micro-text md:text-lg font-medium hidden md:block truncate dark:text-slate-400 light:text-slate-500">
              {subtitle}
            </p>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex flex-nowrap gap-1 md:gap-6 items-center">
          {/* Time and Date */}
          <div className="hidden md:block text-right">
            <div className="text-xl md:text-2xl font-bold dark:text-white light:text-slate-800">
              {formattedTime}
            </div>
            <div className="text-sm capitalize dark:text-slate-400 light:text-slate-600">
              {currentDate}
            </div>
          </div>

          {/* Action Button */}
          {action && <div className="mx-1">{action}</div>}

          {/* Search */}
          <div className="relative hidden lg:block">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <span className="dark:text-slate-400 light:text-slate-400">
                🔍
              </span>
            </div>
            <input
              className="input-field pl-12 pr-4 py-3 w-80 dark:placeholder-slate-400 light:placeholder-slate-400 dark:bg-slate-800/80 light:bg-white"
              placeholder="Szukaj w systemie..."
            />
          </div>

          {/* Notifications */}
          <button className="relative p-0.5 md:p-3 glass-card-light transition-all duration-200 group dark:hover:bg-slate-600/30 light:hover:bg-blue-100/50">
            <span className="text-sm md:text-xl group-hover:scale-110 transition-transform duration-200">N</span>
            <div className="absolute -top-0.5 -right-0.5 md:-top-1 md:-right-1 w-2 h-2 md:w-5 md:h-5 bg-red-500 rounded-full flex items-center justify-center glow-red">
              <span className="text-white mobile-micro-text md:text-xs font-bold">3</span>
            </div>
          </button>

          {/* Quick Actions */}
          <button className="p-0.5 md:p-3 glass-card-light transition-all duration-200 group hidden lg:block dark:hover:bg-slate-600/30 light:hover:bg-blue-100/50">
            <span className="text-xl group-hover:scale-110 transition-transform duration-200">U</span>
          </button>
          
          {/* Theme Toggle */}
          <div className="hidden md:block">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}