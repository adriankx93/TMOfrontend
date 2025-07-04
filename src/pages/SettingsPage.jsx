import Topbar from "../components/Topbar";

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <Topbar 
        title="Ustawienia systemu" 
        subtitle="Konfiguruj parametry systemu TMO"
      />
      <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl shadow-xl p-8">
        <h3 className="text-xl font-bold text-slate-800 mb-4">Ustawienia systemu</h3>
        <p className="text-slate-600">Panel ustawień będzie dostępny wkrótce.</p>
      </div>
    </div>
  );
}