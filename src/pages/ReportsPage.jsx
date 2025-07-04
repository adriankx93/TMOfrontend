import Topbar from "../components/Topbar";

export default function ReportsPage() {
  return (
    <div className="space-y-8">
      <Topbar 
        title="Raporty i statystyki" 
        subtitle="Analizuj wydajność i efektywność pracy"
      />
      <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl shadow-xl p-8">
        <h3 className="text-xl font-bold text-slate-800 mb-4">Raporty będą dostępne wkrótce</h3>
        <p className="text-slate-600">Tutaj znajdziesz szczegółowe raporty dotyczące wykonanych zadań, czasu pracy techników i efektywności zmian.</p>
      </div>
    </div>
  );
}