import React from 'react';
import { TechnicianWorkload as TechnicianWorkloadType } from '../types/sheets';

interface TechnicianWorkloadProps {
  workload: TechnicianWorkloadType[];
}

export default function TechnicianWorkload({ workload }: TechnicianWorkloadProps) {
  if (workload.length === 0) {
    return (
      <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl shadow-xl p-8">
        <h3 className="text-xl font-bold text-slate-800 mb-6">Obciążenie techników</h3>
        <div className="text-center py-12 text-slate-500">
          <span className="text-4xl mb-4 block">📋</span>
          Brak danych dla aktualnego miesiąca
        </div>
      </div>
    );
  }

  const maxShifts = Math.max(...workload.map(t => t.totalShifts));

  const getSpecializationIcon = (specialization: string): string => {
    switch(specialization) {
      case 'Elektryka': return '⚡';
      case 'HVAC': return '🌡️';
      case 'Mechanika': return '🔧';
      case 'Elektronika': return '💻';
      case 'Sprzątanie': return '🧹';
      case 'Bezpieczeństwo': return '🛡️';
      default: return '🛠️';
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl shadow-xl p-8">
      <h3 className="text-xl font-bold text-slate-800 mb-6">Obciążenie techników w miesiącu</h3>
      
      <div className="space-y-4">
        {workload.map((tech, index) => {
          const percentage = maxShifts > 0 ? (tech.totalShifts / maxShifts) * 100 : 0;
          
          return (
            <div key={index} className="p-4 bg-slate-50 rounded-2xl">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-white font-bold">
                    {tech.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-800">{tech.name}</div>
                    <div className="text-sm text-slate-600 flex items-center gap-1">
                      <span>{getSpecializationIcon(tech.specialization)}</span>
                      <span>{tech.specialization}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-slate-800">{tech.totalShifts}</div>
                  <div className="text-sm text-slate-600">zmian</div>
                </div>
              </div>
              
              <div className="mb-3">
                <div className="flex justify-between text-sm text-slate-600 mb-1">
                  <span>Dzienne: {tech.dayShifts}</span>
                  <span>Nocne: {tech.nightShifts}</span>
                  <span>Pierwsze: {tech.firstShifts}</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-emerald-500 to-teal-500 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>

              {(tech.vacationDays > 0 || tech.sickDays > 0) && (
                <div className="flex gap-4 text-sm text-slate-600">
                  {tech.vacationDays > 0 && (
                    <span>🏖️ Urlopy: {tech.vacationDays}</span>
                  )}
                  {tech.sickDays > 0 && (
                    <span>🏥 L4: {tech.sickDays}</span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}