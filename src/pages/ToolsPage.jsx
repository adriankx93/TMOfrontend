import { useState } from "react";
import Topbar from "../components/Topbar";

// Pełna lista narzędzi z pliku/screena
const tools = [
  { numer: "OPC00002900", nazwa: "odkurzacza GAS 25 0601979108", kategoria: "Urządzenie" },
  { numer: "OPC00001583", nazwa: "Myjka SIHL RE128 PLUS", kategoria: "Urządzenie" },
  { numer: "OPC00001858", nazwa: "Wiertarka udarowa Bosch 2-24 DFR", kategoria: "elektronarzędzia" },
  { numer: "OPC00002418", nazwa: "Wkrętarka Powermaxx 12 basic 10,8V-metabo", kategoria: "elektronarzędzia" },
  { numer: "OPC00002419", nazwa: "Wkrętarka Powermaxx 12 basic 10,8V-metabo", kategoria: "elektronarzędzia" },
  { numer: "OPC00002451", nazwa: "Imadło ślusarskie 125mm-Stan", kategoria: "narzędzia" },
  { numer: "OPC00002457", nazwa: "Kompresor profi 255-10/50-matabo", kategoria: "Urządzenie" },
  { numer: "OPC00002609", nazwa: "Stół warsztatowy SS03L", kategoria: "narzędzia" },
  { numer: "OPC00002460", nazwa: "Opalarka Stanleya 3459", kategoria: "elektronarzędzia" },
  { numer: "OPC00002463", nazwa: "Odkurzacz asr 35l-metabo", kategoria: "Urządzenie" },
  { numer: "OPC00002464", nazwa: "Opalarka BOSCH GHG 660 LCD", kategoria: "elektronarzędzia" },
  { numer: "OPC00002605", nazwa: "Wózek osiatkowany", kategoria: "Urządzenie" },
  { numer: "OPC00002466", nazwa: "Pompa ps 18000 sn-metabo", kategoria: "Pompa" },
  { numer: "OPC00002470", nazwa: "Stacja lutownicza lf 389d_xytronic", kategoria: "narzędzia" },
  { numer: "OPC00002471", nazwa: "Szlifierka kątowa WEA 14-125-metabo", kategoria: "elektronarzędzia" },
  { numer: "OPC00002594", nazwa: "Ostrzałka do wierteł BSG 220 Prox", kategoria: "elektronarzędzia" },
  { numer: "OPC00002474", nazwa: "Latarka bml 185 18v li-jon-Makita", kategoria: "narzędzia" },
  { numer: "OPC00002591", nazwa: "Wózek paleciak PR 2000", kategoria: "narzędzia" },
  { numer: "OPC00002592", nazwa: "Wózek platformowy składany", kategoria: "narzędzia" },
  { numer: "OPC00004329", nazwa: "Zasilacz laboratoryjny RXN-3010D", kategoria: "Urządzenie" },
  { numer: "OPC00004883", nazwa: "Imadło maszynowe wiertarskie BISON-BIAL (0642-265-435-500) ze szczękami 100mm", kategoria: "narzędzia" },
  { numer: "OPC00003903", nazwa: "Odkurzacz  plecakowy DVC 260 RM akumulatorowy", kategoria: "Urządzenie" },
  { numer: "OPC00003902", nazwa: "Reflektor akumulatorowy led 200v TOP light", kategoria: "Urządzenie" },
  { numer: "OPC00002919", nazwa: "pompa ręczna prób cisnień PR-50", kategoria: "Pompa" },
  { numer: "OPC00004884", nazwa: "Klucz udarowy MAKITA DTW 190Z (wersja body )", kategoria: "elektronarzędzia" },
  { numer: "OPC00003322", nazwa: "Myjka ciśnieniowa Kercher K7 premium", kategoria: "Urządzenie" },
  { numer: "OPC00003759", nazwa: "Szlifierka stołowa 250W 150mm + 200mm TC-WD 150/200, NA SUCHO / MOKRO", kategoria: "elektronarzędzia" },
  { numer: "OPC00003760", nazwa: "Pompa ogrodowa P 3300 G 600963000 metabo", kategoria: "Pompa" },
  { numer: "OPC00003791", nazwa: "Stół warsztatowy szufladyGSW", kategoria: "narzędzia" },
  { numer: "OPC00003873", nazwa: "Pompa ssąco tłocząca REPUMP", kategoria: "Pompa" },
  { numer: "OPC00003874", nazwa: "Pompa ssąco tłocząca REPUMP", kategoria: "Pompa" },
  { numer: "OPC00003900", nazwa: "Wiertarka kolumnowa Einhel BT BD 911", kategoria: "elektronarzędzia" },
  { numer: "OPC00003901", nazwa: "Reflektor akumulatorowy led 200v TOP light", kategoria: "elektronarzędzia" },
  { numer: "OPC00006397", nazwa: "Pompa WO 2200F", kategoria: "Pompa" },
  { numer: "OPC00007136", nazwa: "Ryobi pistolet na klej", kategoria: "elektronarzędzia" },
  { numer: "OPC00007137", nazwa: "Ryobi Multitool", kategoria: "elektronarzędzia" },
  { numer: "OPC00007138", nazwa: "Ryobi pilarka tarczowa", kategoria: "elektronarzędzia" },
  { numer: "OPC00007139", nazwa: "Ryobi wyżynarka", kategoria: "elektronarzędzia" },
  { numer: "OPC00007140", nazwa: "Ryobi wkrętarka", kategoria: "elektronarzędzia" },
  { numer: "OPC00007141", nazwa: "Ryobi szlifierka", kategoria: "elektronarzędzia" },
  { numer: "OPC00007143", nazwa: "Ryobi - 2.0Ah", kategoria: "Bateria" },
  { numer: "OPC00007144", nazwa: "Ryobi - 5.0Ah", kategoria: "Bateria" },
  { numer: "OPC00007145", nazwa: "Ryobi - 5.0Ah", kategoria: "Bateria" },
  { numer: "OPC00007146", nazwa: "Ryobi szlifierka oscylacyjna", kategoria: "elektronarzędzia" },
  { numer: "OPC00007148", nazwa: "Ryobi piła szablasta", kategoria: "elektronarzędzia" },
  { numer: "OPC00007154", nazwa: "Ryobi zakrętarka udarowa", kategoria: "elektronarzędzia" },
  { numer: "OPC00007159", nazwa: "Ryobi lampa", kategoria: "elektronarzędzia" },
  { numer: "OPC00007160", nazwa: "Zestaw kluczy NEO", kategoria: "Ręczne" },
  { numer: "OPC00007161", nazwa: "Zgrzewarka PP", kategoria: "elektronarzędzia" },
];

// Dynamiczne kategorie na podstawie narzędzi
const categories = Array.from(new Set(tools.map(t => t.kategoria)));

// Mapowanie ikon na kategorie
const iconMap = {
  "elektronarzędzia": "⚡",
  "narzędzia": "🔧",
  "Urządzenie": "🔌",
  "Pompa": "💧",
  "Bateria": "🔋",
  "Ręczne": "🛠️",
};

export default function ToolsPage() {
  const [activeCategory, setActiveCategory] = useState(null);
  const [search, setSearch] = useState("");

  const [activeTab, setActiveTab] = useState("inventory");
  const [showRequestModal, setShowRequestModal] = useState(false);

  // Statystyki
  const tabs = [
    { id: "inventory", label: "Inwentaryzacja", icon: "📋", count: tools.length },
    { id: "requests", label: "Zapotrzebowania", icon: "📝", count: 8 },
    { id: "missing", label: "Braki", icon: "❌", count: 12 },
    { id: "condition", label: "Stan techniczny", icon: "🔧", count: 23 }
  ];

  // Filtrowanie po kategorii i wyszukiwaniu
  const filteredTools = tools
    .filter(t => t.kategoria === activeCategory)
    .filter(t =>
      t.numer.toLowerCase().includes(search.toLowerCase()) ||
      t.nazwa.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <div className="space-y-8 animate-fade-in">
      <Topbar 
        title="Zarządzanie narzędziami" 
        subtitle="Inwentaryzacja, zapotrzebowania i kontrola stanu"
        action={
          <button 
            onClick={() => setShowRequestModal(true)}
            className="btn-primary flex items-center gap-2"
          >
            <span>📝</span>
            <span>Zgłoś zapotrzebowanie</span>
          </button>
        }
      />

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {tabs.map((tab) => (
          <div key={tab.id} className="metric-card">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
                <span className="text-2xl">{tab.icon}</span>
              </div>
              <div className="px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full text-sm font-bold">
                {tab.count}
              </div>
            </div>
            <h3 className="text-lg font-semibold text-white mb-1">{tab.label}</h3>
            <p className="text-slate-400 text-sm">Pozycji w kategorii</p>
          </div>
        ))}
      </div>

      {/* Kategorie narzędzi */}
      {!activeCategory && (
        <div className="glass-card p-8">
          <h3 className="text-xl font-bold text-white mb-6">Kategorie narzędzi</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((cat) => (
              <div
                key={cat}
                onClick={() => {
                  setActiveCategory(cat);
                  setSearch(""); // resetuj wyszukiwarkę przy zmianie kategorii
                }}
                className={`glass-card-light p-6 text-center transition-all duration-200 cursor-pointer
                  hover:bg-slate-600/30 ${activeCategory === cat ? "bg-orange-500/40 ring-2 ring-orange-400" : ""}`}
              >
                <div className="text-3xl mb-3">
                  {iconMap[cat] || "🛠️"}
                </div>
                <h4 className="font-semibold text-white mb-2">{cat}</h4>
                <p className="text-sm text-slate-400">
                  {tools.filter(t => t.kategoria === cat).length} narzędzi
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lista narzędzi w wybranej kategorii */}
      {activeCategory && (
        <div className="glass-card p-8 mt-6">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <div>
              <h3 className="text-xl font-bold text-white mb-2">
                Narzędzia w kategorii: <span className="text-orange-300">{activeCategory}</span>
              </h3>
              <p className="text-slate-400">
                Łącznie: <span className="text-orange-300">{tools.filter(t => t.kategoria === activeCategory).length}</span>
              </p>
            </div>
            <button
              className="text-slate-400 hover:text-orange-400 text-sm underline"
              onClick={() => setActiveCategory(null)}
            >
              ← Wróć do wyboru kategorii
            </button>
          </div>

          {/* Wyszukiwarka */}
          <div className="mb-4 flex items-center gap-2">
            <input
              className="rounded-xl px-4 py-2 bg-slate-700/50 text-slate-200 w-full max-w-md focus:outline-none focus:ring-2 focus:ring-orange-400"
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Szukaj po nazwie lub numerze narzędzia..."
            />
            <button
              className="ml-2 text-slate-400 hover:text-orange-400"
              onClick={() => setSearch("")}
              title="Wyczyść wyszukiwanie"
            >✕</button>
          </div>

          {/* Tabela narzędzi */}
          {filteredTools.length === 0 ? (
            <div className="text-slate-400 py-12 text-center">Brak narzędzi spełniających kryteria.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-slate-200">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left">Numer</th>
                    <th className="px-4 py-2 text-left">Nazwa</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTools.map((tool, idx) => (
                    <tr key={idx} className="border-b border-slate-700/40 hover:bg-slate-700/20">
                      <td className="px-4 py-2">{tool.numer}</td>
                      <td className="px-4 py-2">{tool.nazwa}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
