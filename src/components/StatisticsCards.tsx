import React from 'react';
import { MonthStats } from '../types/sheets';

interface StatisticsCardsProps {
  stats: MonthStats;
}

interface CardProps {
  icon: string;
  color: string;
  label: string;
  value: string | number;
}

function Card({ icon, color, label, value }: CardProps) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    emerald: 'bg-emerald-100 text-emerald-600',
    orange: 'bg-orange-100 text-orange-600',
    purple: 'bg-purple-100 text-purple-600'
  };

  return (
    <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-2xl p-6 text-center">
      <div className={`w-12 h-12 ${colorClasses[color as keyof typeof colorClasses] || 'bg-gray-100 text-gray-600'} rounded-2xl flex items-center justify-center mx-auto mb-3`}>
        <span className="text-2xl">{icon}</span>
      </div>
      <div className={`text-3xl font-bold ${colorClasses[color as keyof typeof colorClasses]?.replace('bg-', 'text-').replace('-100', '-600') || 'text-gray-600'} mb-1`}>
        {value}
      </div>
      <div className="text-slate-600 font-medium">{label}</div>
    </div>
  );
}

export default function StatisticsCards({ stats }: StatisticsCardsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      <Card icon="📅" color="blue" label="Dni w miesiącu" value={stats.totalDays} />
      <Card icon="👥" color="emerald" label="Aktywni technicy" value={stats.allTechnicians.size} />
      <Card icon="💼" color="orange" label="Dni robocze" value={stats.totalWorkingDays} />
      <Card icon="📊" color="purple" label="Śr. pracowników/dzień" value={stats.avgWorkersPerDay} />
    </div>
  );
}