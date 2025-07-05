import React from 'react';
import { Shift } from '../types/sheets';

interface DailyScheduleTableProps {
  shifts: Shift[];
}

export default function DailyScheduleTable({ shifts }: DailyScheduleTableProps) {
  if (shifts.length === 0) {
    return (
      <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl shadow-xl p-8">
        <h3 className="text-xl font-bold text-slate-800 mb-6">Szczegółowy rozkład zmian</h3>
        <div className="text-center py-12 text-slate-500">
          <span className="text-4xl mb-4 block">📅</span>
          Brak danych zmian dla aktualnego miesiąca
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl shadow-xl p-8">
      <h3 className="text-xl font-bold text-slate-800 mb-6">Szczegółowy rozkład zmian</h3>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="text-left py-3 px-4 font-semibold text-slate-700">Data</th>
              <th className="text-left py-3 px-4 font-semibold text-slate-700">Pierwsza zmiana</th>
              <th className="text-left py-3 px-4 font-semibold text-slate-700">Zmiana dzienna</th>
              <th className="text-left py-3 px-4 font-semibold text-slate-700">Zmiana nocna</th>
              <th className="text-left py-3 px-4 font-semibold text-slate-700">Urlopy</th>
              <th className="text-left py-3 px-4 font-semibold text-slate-700">L4</th>
              <th className="text-center py-3 px-4 font-semibold text-slate-700">Łącznie</th>
            </tr>
          </thead>
          <tbody>
            {shifts.map((shift, index) => (
              <tr key={index} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="py-3 px-4 font-medium text-slate-800">
                  {new Date(shift.date).toLocaleDateString('pl-PL')}
                </td>
                <td className="py-3 px-4">
                  <div className="flex flex-wrap gap-1">
                    {shift.firstShiftTechnicians.map((tech, idx) => (
                      <span key={idx} className="px-2 py-1 bg-purple-100 text-purple-800 rounded-lg text-sm">
                        {tech}
                      </span>
                    ))}
                    {shift.firstShiftTechnicians.length === 0 && (
                      <span className="text-slate-400 text-sm">-</span>
                    )}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex flex-wrap gap-1">
                    {shift.dayTechnicians.map((tech, idx) => (
                      <span key={idx} className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-lg text-sm">
                        {tech}
                      </span>
                    ))}
                    {shift.dayTechnicians.length === 0 && (
                      <span className="text-slate-400 text-sm">-</span>
                    )}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex flex-wrap gap-1">
                    {shift.nightTechnicians.map((tech, idx) => (
                      <span key={idx} className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded-lg text-sm">
                        {tech}
                      </span>
                    ))}
                    {shift.nightTechnicians.length === 0 && (
                      <span className="text-slate-400 text-sm">-</span>
                    )}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex flex-wrap gap-1">
                    {shift.vacationTechnicians.map((tech, idx) => (
                      <span key={idx} className="px-2 py-1 bg-green-100 text-green-800 rounded-lg text-sm">
                        {tech}
                      </span>
                    ))}
                    {shift.vacationTechnicians.length === 0 && (
                      <span className="text-slate-400 text-sm">-</span>
                    )}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex flex-wrap gap-1">
                    {shift.l4Technicians.map((tech, idx) => (
                      <span key={idx} className="px-2 py-1 bg-red-100 text-red-800 rounded-lg text-sm">
                        {tech}
                      </span>
                    ))}
                    {shift.l4Technicians.length === 0 && (
                      <span className="text-slate-400 text-sm">-</span>
                    )}
                  </div>
                </td>
                <td className="py-3 px-4 text-center">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full font-semibold">
                    {shift.totalWorking}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}