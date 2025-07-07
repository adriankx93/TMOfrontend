@@ -3,11 +3,73 @@ import TechniciansFromSheets from "../components/TechniciansFromSheets.tsx";

export default function TechniciansPage() {
  return (
    <div className="space-y-8">
    <div className="space-y-8 animate-fade-in">
      <Topbar 
        title="Zespół techników" 
        subtitle="Dane techników z arkusza Google Sheets"
        title="Zespół techniczny" 
        subtitle="Zarządzanie zasobami ludzkimi i kompetencjami"
        action={
          <button className="btn-primary flex items-center gap-2">
            <span>👥</span>
            <span>Dodaj technika</span>
          </button>
        }
      />
      
      {/* Team Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="metric-card">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
              <span className="text-2xl">👥</span>
            </div>
            <div className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-sm font-bold">
              17
            </div>
          </div>
          <h3 className="text-lg font-semibold text-white mb-1">Zespół</h3>
          <p className="text-slate-400 text-sm">Aktywni technicy</p>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <span className="text-2xl">⚡</span>
            </div>
            <div className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm font-bold">
              12
            </div>
          </div>
          <h3 className="text-lg font-semibold text-white mb-1">Na zmianie</h3>
          <p className="text-slate-400 text-sm">Obecnie pracuje</p>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center">
              <span className="text-2xl">📊</span>
            </div>
            <div className="px-3 py-1 bg-amber-500/20 text-amber-400 rounded-full text-sm font-bold">
              87%
            </div>
          </div>
          <h3 className="text-lg font-semibold text-white mb-1">Wydajność</h3>
          <p className="text-slate-400 text-sm">Średnia zespołu</p>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
              <span className="text-2xl">🎯</span>
            </div>
            <div className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-bold">
              24
            </div>
          </div>
          <h3 className="text-lg font-semibold text-white mb-1">Zadania</h3>
          <p className="text-slate-400 text-sm">Wykonane dziś</p>
        </div>
      </div>

      <TechniciansFromSheets />
    </div>
  );
