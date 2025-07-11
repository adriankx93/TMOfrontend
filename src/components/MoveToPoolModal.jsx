import { useState } from "react";
import { useTasks } from "../hooks/useTasks";

export default function MoveToPoolModal({ task, onClose, onMoved }) {
  const { updateTask } = useTasks();
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const commonReasons = [
    "Brak dostępnych techników",
    "Oczekiwanie na materiały",
    "Konieczność konsultacji",
    "Zmiana priorytetu",
    "Problemy techniczne",
    "Oczekiwanie na zgodę",
    "Inne"
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reason.trim()) {
      setError("Podaj powód przeniesienia do puli");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const updateData = {
        status: 'pool',
        poolReason: reason,
        movedToPoolAt: new Date().toISOString(),
        movedToPoolBy: "Administrator Systemu",
        assignedTo: null,
        lastModified: new Date().toISOString(),
        lastModifiedBy: "Administrator Systemu",
        history: [
          ...(task.history || []),
          {
            action: "moved_to_pool",
            user: "Administrator Systemu",
            timestamp: new Date().toISOString(),
            details: `Przeniesiono do puli. Powód: ${reason}`
          }
        ]
      };

      await updateTask(task._id, updateData);
      onMoved();
    } catch (err) {
      setError(err.response?.data?.message || "Błąd podczas przenoszenia zadania");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="glass-card max-w-lg w-full">
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white text-xl">🔄</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Przenieś do puli</h2>
                <p className="text-slate-400">Podaj powód przeniesienia zadania</p>
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
                Wybierz powód lub wpisz własny
              </label>
              
              <div className="grid grid-cols-1 gap-2 mb-4">
                {commonReasons.map((commonReason) => (
                  <button
                    key={commonReason}
                    type="button"
                    onClick={() => setReason(commonReason)}
                    className={`p-3 text-left rounded-xl transition-all duration-200 ${
                      reason === commonReason
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/50'
                        : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50'
                    }`}
                    disabled={loading}
                  >
                    {commonReason}
                  </button>
                ))}
              </div>

              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
                className="input-field w-full"
                placeholder="Lub wpisz własny powód..."
                disabled={loading}
              />
            </div>

            <div className="flex gap-4 pt-6 border-t border-slate-600">
              <button
                type="submit"
                disabled={loading || !reason.trim()}
                className="flex-1 py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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