import React from "react";

export default function ShiftCalendar({ shifts }) {
  const monthName = new Date().toLocaleString('pl-PL', { month: 'long' });

  return (
    <div className="glass-card p-4">
      <h2 className="text-white text-lg font-semibold mb-4">Kalendarz zmian ({monthName})</h2>
      <div className="grid grid-cols-7 gap-2 text-center text-xs text-white">
        {shifts.map((shift) => (
          <div
            key={shift.dayNumber}
            className={`p-2 rounded-lg ${shift.totalWorking === 0 ? 'bg-red-500/20' : 'bg-slate-700/50'}`}
          >
            <div className="font-bold">{shift.dayNumber}</div>
            <div>{shift.dayTechnicians.length + shift.nightTechnicians.length} os.</div>
          </div>
        ))}
      </div>
    </div>
  );
}
