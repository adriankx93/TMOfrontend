import { useState } from "react";
import { useTasks } from "../hooks/useTasks"; 

export default function MissingMaterialsModal({ task, onClose, onMoved }) {
  const { moveToPoolWithData } = useTasks();
  const [materials, setMaterials] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const commonMaterials = [
    "Części zamienne",
    "Narzędzia specjalistyczne",
    "Materiały elektryczne",
    "Elementy hydrauliczne",
    "Filtry",
    "Śruby i złączki",
    "Farby i lakiery",
    "Uszczelki",
    "Przewody",
    "Inne"
  ];

  const handleSubmit = async (e) => {

    setLoading(true);
    setError("");
            action: "moved_to_pool_materials",
    try {
      const fullReason = `Brak materiałów: ${materials}${additionalNotes ? `. Dodatkowe uwagi: ${additionalNotes}` : ''}`;
      
      await moveToPoolWithData(task._id, fullReason, {
        needsMaterials: true
      });
      onMoved();
    } catch (err) {
      setError(err.response?.data?.message || "Błąd podczas przenoszenia zadania");
    } finally {
      setLoading(false);
    }
  };

  const toggleMaterial = (material) => {
    const currentMaterials = materials.split(', ').filter(m => m.trim());
    if (currentMaterials.includes(material)) {
      setMaterials(currentMaterials.filter(m => m !== material).join(', '));
    } else {
      setMaterials([...currentMaterials, material].join(', '));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="glass-card max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white text-xl">📦</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Brak materiałów</h2>
                <p className="text-slate-400">Określ jakich materiałów brakuje</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-slate-700/50 rounded-xl transition-all duration-200"
              disabled={loading}
            >
              <span className="text-2xl text-slate-400 hover:text-white">×</span>
            </button>
          </div>

          {/* Task Info */}
          <div className="mb-6 p-4 glass-card-light rounded-2xl">
            <h3 className="font-semibold text-white mb-2">{task.title}</h3>
            <div className="text-sm text-slate-400 space-y-1">
              <div>📍 {task.location}</div>
              <div>🏷️ {task.category}</div>
              <div>⏱️ {task.estimatedDuration} minut</div>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-2xl">
              <div className="text-red-400 font-medium">{error}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-3">
                Wybierz brakujące materiały
              </label>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
                {commonMaterials.map((material) => (
                  <button
                    key={material}
                    type="button"
                    onClick={() => toggleMaterial(material)}
                    className={`p-3 text-sm text-center rounded-xl transition-all duration-200 ${
                      materials.includes(material)
                        ? 'bg-orange-500/20 text-orange-400 border border-orange-500/50'
                        : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50'
                    }`}
                    disabled={loading}
                  >
                    {material}
                  </button>
                ))}
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-200 mb-2">
                    Szczegółowy opis materiałów
                  </label>
                  <textarea
                    value={materials}
                    onChange={(e) => setMaterials(e.target.value)}
                    rows={3}
                    className="input-field w-full"
                    placeholder="Opisz dokładnie jakich materiałów brakuje..."
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-200 mb-2">
                    Dodatkowe uwagi (opcjonalne)
                  </label>
                  <textarea
                    value={additionalNotes}
                    onChange={(e) => setAdditionalNotes(e.target.value)}
                    rows={2}
                    className="input-field w-full"
                    placeholder="Dodatkowe informacje, specyfikacje, dostawcy..."
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            <div className="bg-blue-500/20 border border-blue-500/30 rounded-2xl p-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">💡</span>
                <div className="text-sm text-blue-300">
                  <div className="font-semibold mb-1">Wskazówka:</div>
                  <div>Podaj jak najdokładniejszy opis materiałów, aby zespół zakupów mógł szybko je zamówić. Uwzględnij specyfikacje techniczne, ilości i preferowanych dostawców.</div>
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-6 border-t border-slate-600">
              <button
                type="submit"
                disabled={loading || !materials.trim()}
                className="flex-1 py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Przenoszenie..." : "Przenieś do puli"}
              </button>
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="px-8 py-4 bg-slate-700 text-slate-300 rounded-2xl font-semibold hover:bg-slate-600 transition-all duration-200 disabled:opacity-50"
              >
                Anuluj
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}