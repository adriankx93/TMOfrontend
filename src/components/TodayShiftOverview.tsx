import React, { useState, useEffect } from "react";
import { sheetsService } from "../services/sheetsService";

interface TodayShift {
  date: string;
  dayTechnicians: string[];
  nightTechnicians: string[];
  firstShiftTechnicians: string[];
  vacationTechnicians: string[];
  l4Technicians: string[];
  totalWorking: number;
}

export default function TodayShiftOverview() {
  const [todayShift, setTodayShift] = useState<TodayShift | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTodayShift();
    
    // Refresh every 30 minutes
    const interval = setInterval(fetchTodayShift, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchTodayShift = async () => {
    try {
      setLoading(true);
      const data = await sheetsService.getCurrentMonthData();
      
      const today = new Date();
      const shift = data.shifts.find(shift => {
        const shiftDate = new Date(shift.date);
        return shiftDate.toDateString() === today.toDateString();
      });

      setTodayShift(shift || null);
    } catch (error) {
      console.error('Error fetching today shift:', error);
    } finally {
      setLoading(false);
    }
  };

  const currentHour = new Date().getHours();
  const isDay = currentHour >= 7 && currentHour < 19;

  if (loading) {
    return (
      <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl shadow-xl p-8">
        <div className="animate-pulse">
          <div className="h-6 bg-slate-200 rounded mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-slate-200 rounded"></div>
            <div className="h-4 bg-slate-200 rounded"></div>
            <div className="h-4 bg-slate-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!todayShift) {
    return (
      <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl shadow-xl p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-white text-xl">📅</span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-800">Dzisiejsze zmiany</h3>
            <p className="text-slate-600">Brak danych na dzisiaj</p>
          </div>
        </div>
        <div className="text-center py-8 text-slate-500">
          <span className="text-4xl mb-4 block">📋</span>
          Brak zaplanowanych zmian na dzisiaj
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl shadow-xl p-8">
      <div className="flex items-center gap-4 mb-6">
        <div className={`w-12 h-12 bg-gradient-to-br ${isDay ? 'from-yellow-400 to-orange-500' : 'from-blue-500 to-indigo-600'} rounded-2xl flex items-center justify-center shadow-lg`}>
          <span className="text-white text-xl">{isDay ? '☀️' : '🌙'}</span>
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-800">Dzisiejsze zmiany</h3>
          <p className="text-slate-600">
            {new Date().toLocaleDateString('pl-PL', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Current Shift Highlight */}
        <div className={`p-4 rounded-2xl border-2 ${isDay ? 'bg-yellow-50 border-yellow-200' : 'bg-blue-50 border-blue-200'}`}>
          <div className="flex items-center justify-between mb-3">
            <h4 className={`font-bold text-lg ${isDay ? 'text-yellow-800' : 'text-blue-800'}`}>
              Aktualna zmiana: {isDay ? 'Dzienna' : 'Nocna'}
            </h4>
            <span className={`px-3 py-1 rounded-xl text-sm font-semibold ${isDay ? 'bg-yellow-200 text-yellow-800' : 'bg-blue-200 text-blue-800'}`}>
              {isDay ? '07:00 - 19:00' : '19:00 - 07:00'}
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="text-sm font-semibold text-slate-700 mb-2">Pierwsza zmiana</div>
              <div className="space-y-1">
                {todayShift.firstShiftTechnicians.length > 0 ? (
                  todayShift.firstShiftTechnicians.map((tech, idx) => (
                    <div key={idx} className="text-sm bg-purple-100 text-purple-800 px-2 py-1 rounded">
                      {tech}
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-slate-500">Brak</div>
                )}
              </div>
            </div>
            
            <div>
              <div className="text-sm font-semibold text-slate-700 mb-2">Zmiana dzienna</div>
              <div className="space-y-1">
                {todayShift.dayTechnicians.length > 0 ? (
                  todayShift.dayTechnicians.map((tech, idx) => (
                    <div key={idx} className="text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                      {tech}
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-slate-500">Brak</div>
                )}
              </div>
            </div>
            
            <div>
              <div className="text-sm font-semibold text-slate-700 mb-2">Zmiana nocna</div>
              <div className="space-y-1">
                {todayShift.nightTechnicians.length > 0 ? (
                  todayShift.nightTechnicians.map((tech, idx) => (
                    <div key={idx} className="text-sm bg-indigo-100 text-indigo-800 px-2 py-1 rounded">
                      {tech}
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-slate-500">Brak</div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Absences */}
        {(todayShift.vacationTechnicians.length > 0 || todayShift.l4Technicians.length > 0) && (
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <h4 className="font-bold text-slate-800 mb-3">Nieobecności</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm font-semibold text-slate-700 mb-2">Urlopy</div>
                <div className="space-y-1">
                  {todayShift.vacationTechnicians.length > 0 ? (
                    todayShift.vacationTechnicians.map((tech, idx) => (
                      <div key={idx} className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                        {tech}
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-slate-500">Brak</div>
                  )}
                </div>
              </div>
              
              <div>
                <div className="text-sm font-semibold text-slate-700 mb-2">Zwolnienia (L4)</div>
                <div className="space-y-1">
                  {todayShift.l4Technicians.length > 0 ? (
                    todayShift.l4Technicians.map((tech, idx) => (
                      <div key={idx} className="text-sm bg-red-100 text-red-800 px-2 py-1 rounded">
                        {tech}
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-slate-500">Brak</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Summary */}
        <div className="flex justify-between items-center p-4 bg-emerald-50 rounded-2xl border border-emerald-200">
          <div>
            <div className="font-semibold text-emerald-800">Łącznie pracuje dziś</div>
            <div className="text-sm text-emerald-600">Wszystkie zmiany</div>
          </div>
          <div className="text-3xl font-bold text-emerald-600">
            {todayShift.totalWorking}
          </div>
        </div>
      </div>
    </div>
  );
}