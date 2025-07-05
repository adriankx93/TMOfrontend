import React, { useState, useEffect } from "react";
import { sheetsService } from "../services/sheetsService";

interface SheetStats {
  totalTechnicians: number;
  activeTechnicians: number;
  totalShiftsToday: number;
  vacationToday: number;
  sickLeaveToday: number;
}

export default function SheetsDashboardStats() {
  const [stats, setStats] = useState<SheetStats>({
    totalTechnicians: 0,
    activeTechnicians: 0,
    totalShiftsToday: 0,
    vacationToday: 0,
    sickLeaveToday: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    
    // Refresh every 10 minutes
    const interval = setInterval(fetchStats, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await sheetsService.getCurrentMonthData();
      
      const today = new Date();
      const todayShift = data.shifts.find(shift => {
        const shiftDate = new Date(shift.date);
        return shiftDate.toDateString() === today.toDateString();
      });

      const newStats: SheetStats = {
        totalTechnicians: data.technicians.length,
        activeTechnicians: todayShift ? todayShift.totalWorking : 0,
        totalShiftsToday: todayShift ? (
          todayShift.dayTechnicians.length + 
          todayShift.nightTechnicians.length + 
          todayShift.firstShiftTechnicians.length
        ) : 0,
        vacationToday: todayShift ? todayShift.vacationTechnicians.length : 0,
        sickLeaveToday: todayShift ? todayShift.l4Technicians.length : 0
      };

      setStats(newStats);
    } catch (error) {
      console.error('Error fetching sheet stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl shadow-xl p-8">
        <div className="animate-pulse">
          <div className="h-6 bg-slate-200 rounded mb-4"></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-16 bg-slate-200 rounded"></div>
            <div className="h-16 bg-slate-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl shadow-xl p-8">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
          <span className="text-white text-xl">📊</span>
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-800">Statystyki z arkusza</h3>
          <p className="text-slate-600">Dane na dzisiaj z Google Sheets</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="text-center p-4 bg-blue-50 rounded-xl border border-blue-200">
          <div className="text-2xl font-bold text-blue-600">{stats.totalTechnicians}</div>
          <div className="text-sm text-blue-600">Wszyscy technicy</div>
        </div>
        
        <div className="text-center p-4 bg-emerald-50 rounded-xl border border-emerald-200">
          <div className="text-2xl font-bold text-emerald-600">{stats.activeTechnicians}</div>
          <div className="text-sm text-emerald-600">Pracuje dziś</div>
        </div>
        
        <div className="text-center p-4 bg-orange-50 rounded-xl border border-orange-200">
          <div className="text-2xl font-bold text-orange-600">{stats.totalShiftsToday}</div>
          <div className="text-sm text-orange-600">Zmian dziś</div>
        </div>
        
        <div className="text-center p-4 bg-green-50 rounded-xl border border-green-200">
          <div className="text-2xl font-bold text-green-600">{stats.vacationToday}</div>
          <div className="text-sm text-green-600">Na urlopie</div>
        </div>
        
        <div className="text-center p-4 bg-red-50 rounded-xl border border-red-200">
          <div className="text-2xl font-bold text-red-600">{stats.sickLeaveToday}</div>
          <div className="text-sm text-red-600">Na L4</div>
        </div>
        
        <div className="text-center p-4 bg-purple-50 rounded-xl border border-purple-200">
          <div className="text-2xl font-bold text-purple-600">
            {Math.round((stats.activeTechnicians / stats.totalTechnicians) * 100) || 0}%
          </div>
          <div className="text-sm text-purple-600">Dostępność</div>
        </div>
      </div>
    </div>
  );
}