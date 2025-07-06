import { useState } from "react";
import Topbar from "../components/Topbar";

export default function TrendAnalysisPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const trendCategories = [
    { id: "electrical", name: "Elektryka", icon: "⚡", trend: "+15%", color: "yellow" },
    { id: "hvac", name: "HVAC", icon: "🌡️", trend: "-8%", color: "blue" },
    { id: "mechanical", name: "Mechanika", icon: "🔧", trend: "+3%", color: "orange" },
    { id: "safety", name: "Bezpieczeństwo", icon: "🛡️", trend: "-12%", color: "green" },
    { id: "cleaning", name: "Sprzątanie", icon: "🧹", trend: "+5%", color: "purple" }
  ];

  const periods = [
    { value: "week", label: "Ostatni tydzień" },
    { value: "month", label: "Ostatni miesiąc" },
    { value: "quarter", label: "Ostatni kwartał" },
    { value: "year", label: "Ostatni rok" }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <Topbar 
        title="Analiza trendów awaryjności" 
        subtitle="Predykcyjna analiza i trendy w zarządzaniu facility"
        action={
          <button className="btn-primary flex items-center gap-2">
            <span>📊</span>
            <span>Generuj raport</span>
          </button>
        }
      />

      {/* Period Selection */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white">Okres analizy</h3>
          <div className="flex gap-2">
            {periods.map(period => (
              <button
                key={period.value}
                onClick={() => setSelectedPeriod(period.value)}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                  selectedPeriod === period.value
                    ? 'gradient-primary text-white glow-blue'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                {period.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Trend Categories */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {trendCategories.map((category) => (
          <div key={category.id} className="metric-card">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 bg-${category.color}-500/20 rounded-xl flex items-center justify-center`}>
                <span className="text-2xl">{category.icon}</span>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-bold ${
                category.trend.startsWith('+') 
                  ? 'bg-red-500/20 text-red-400' 
                  : 'bg-green-500/20 text-green-400'
              }`}>
                {category.trend}
              </div>
            </div>
            <h3 className="text-lg font-semibold text-white mb-1">{category.name}</h3>
            <p className="text-slate-400 text-sm">Trend awaryjności</p>
          </div>
        ))}
      </div>

      {/* Main Analysis Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Failure Trends Chart */}
        <div className="glass-card p-8">
          <h3 className="text-xl font-bold text-white mb-6">Trendy awaryjności</h3>
          <div className="h-64 flex items-center justify-center text-slate-400">
            <div className="text-center">
              <div className="text-4xl mb-4">📈</div>
              <p>Wykres trendów będzie dostępny wkrótce</p>
            </div>
          </div>
        </div>

        {/* Predictive Analysis */}
        <div className="glass-card p-8">
          <h3 className="text-xl font-bold text-white mb-6">Analiza predykcyjna</h3>
          <div className="h-64 flex items-center justify-center text-slate-400">
            <div className="text-center">
              <div className="text-4xl mb-4">🔮</div>
              <p>Predykcja awarii będzie dostępna wkrótce</p>
            </div>
          </div>
        </div>

        {/* Critical Equipment */}
        <div className="glass-card p-8">
          <h3 className="text-xl font-bold text-white mb-6">Urządzenia krytyczne</h3>
          <div className="space-y-4">
            <div className="glass-card-light p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-white">Centrala AHU1</div>
                  <div className="text-sm text-slate-400">Wysoki wskaźnik awarii</div>
                </div>
                <div className="px-3 py-1 bg-red-500/20 text-red-400 rounded-xl text-sm font-bold">
                  Ryzyko: 85%
                </div>
              </div>
            </div>
            
            <div className="glass-card-light p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-white">Winda B1</div>
                  <div className="text-sm text-slate-400">Częste usterki</div>
                </div>
                <div className="px-3 py-1 bg-amber-500/20 text-amber-400 rounded-xl text-sm font-bold">
                  Ryzyko: 65%
                </div>
              </div>
            </div>
            
            <div className="glass-card-light p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-white">Rozdzielnia A</div>
                  <div className="text-sm text-slate-400">Starzejące się komponenty</div>
                </div>
                <div className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-xl text-sm font-bold">
                  Ryzyko: 45%
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="glass-card p-8">
          <h3 className="text-xl font-bold text-white mb-6">Rekomendacje</h3>
          <div className="space-y-4">
            <div className="glass-card-light p-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                  <span className="text-blue-400">💡</span>
                </div>
                <div>
                  <div className="font-semibold text-white">Zwiększ częstotliwość przeglądów</div>
                  <div className="text-sm text-slate-400">Dla urządzeń HVAC</div>
                </div>
              </div>
            </div>
            
            <div className="glass-card-light p-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                  <span className="text-green-400">🔧</span>
                </div>
                <div>
                  <div className="font-semibold text-white">Wymień komponenty prewencyjnie</div>
                  <div className="text-sm text-slate-400">Przed końcem żywotności</div>
                </div>
              </div>
            </div>
            
            <div className="glass-card-light p-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center">
                  <span className="text-purple-400">📚</span>
                </div>
                <div>
                  <div className="font-semibold text-white">Szkolenie zespołu</div>
                  <div className="text-sm text-slate-400">W zakresie diagnostyki</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Insights */}
      <div className="glass-card p-8">
        <h3 className="text-xl font-bold text-white mb-6">Inteligentne wnioski AI</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card-light p-6 text-center">
            <div className="text-3xl mb-3">🤖</div>
            <h4 className="font-semibold text-white mb-2">Analiza wzorców</h4>
            <p className="text-sm text-slate-400">AI wykrywa powtarzające się wzorce awarii</p>
          </div>
          
          <div className="glass-card-light p-6 text-center">
            <div className="text-3xl mb-3">🎯</div>
            <h4 className="font-semibold text-white mb-2">Optymalizacja</h4>
            <p className="text-sm text-slate-400">Sugestie optymalizacji harmonogramów</p>
          </div>
          
          <div className="glass-card-light p-6 text-center">
            <div className="text-3xl mb-3">📊</div>
            <h4 className="font-semibold text-white mb-2">Predykcja</h4>
            <p className="text-sm text-slate-400">Przewidywanie przyszłych awarii</p>
          </div>
        </div>
      </div>
    </div>
  );
}