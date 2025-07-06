import { useState } from "react";
import { useEffect } from "react";
import { useTasks } from "../hooks/useTasks";
import { sheetsService } from "../services/sheetsService";

export default function CreateTaskModal({ onClose, onTaskCreated }) {
  const { createTask } = useTasks();
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    assignedTo: "",
    dueDate: "",
    shift: "Dzienna"
  });

  useEffect(() => {
    // Fetch technicians from sheets service
    fetchTechnicians();
  }, []);

  const fetchTechnicians = async () => {
    try {
      const data = await sheetsService.getCurrentMonthData();
      const techniciansList = data.technicians.map(tech => ({
        _id: tech.id,
        firstName: tech.firstName,
        lastName: tech.lastName,
        specialization: tech.specialization,
        fullName: tech.fullName
      }));
      setTechnicians(techniciansList);
    } catch (error) {
      console.error('Error fetching technicians:', error);
      setTechnicians([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const taskData = {
        ...formData,
        priority: "Średni", // Domyślny priorytet
        location: "Do określenia", // Domyślna lokalizacja
        category: "Ogólne", // Domyślna kategoria
        estimatedDuration: 60, // Domyślny czas 60 minut
        status: formData.assignedTo ? "assigned" : "pool",
        createdAt: new Date().toISOString(),
        dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null
      };

      await createTask(taskData);
      
      if (onTaskCreated) {
        onTaskCreated();
      }
      
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Błąd podczas tworzenia zadania");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="glass-card max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 gradient-primary rounded-2xl flex items-center justify-center shadow-lg glow-blue">
                <span className="text-white text-xl">📋</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Nowe zadanie</h2>
                <p className="text-slate-400">Szybkie utworzenie zadania</p>
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

          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-2xl">
              <div className="text-red-400 font-medium">{error}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Tytuł zadania */}
            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-2">
                Tytuł zadania *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="input-field w-full"
                placeholder="np. Naprawa oświetlenia w hali A"
                required
                disabled={loading}
              />
            </div>

            {/* Opis zadania */}
            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-2">
                Opis zadania
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="input-field w-full"
                placeholder="Szczegółowy opis zadania..."
                disabled={loading}
              />
            </div>

            {/* Przypisanie do technika */}
            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-2">
                Przypisz do technika
              </label>
              <select
                name="assignedTo"
                value={formData.assignedTo}
                onChange={handleChange}
                className="input-field w-full"
                disabled={loading}
              >
                <option value="">Zostaw w puli zadań</option>
                {technicians.map((tech) => (
                  <option key={tech._id || tech.id} value={tech._id || tech.id}>
                    {tech.fullName || `${tech.firstName} ${tech.lastName}`} - {tech.specialization}
                  </option>
                ))}
              </select>
            </div>

            {/* Data i zmiana */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-200 mb-2">
                  Data wykonania
                </label>
                <input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                  className="input-field w-full"
                  disabled={loading}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-200 mb-2">
                  Zmiana *
                </label>
                <select
                  name="shift"
                  value={formData.shift}
                  onChange={handleChange}
                  className="input-field w-full"
                  required
                  disabled={loading}
                >
                  <option value="Dzienna">Dzienna (07:00 - 19:00)</option>
                  <option value="Nocna">Nocna (19:00 - 07:00)</option>
                </select>
              </div>
            </div>

            {/* Informacja o domyślnych wartościach */}
            <div className="p-4 bg-blue-500/20 rounded-2xl border border-blue-500/30">
              <div className="flex items-center gap-3">
                <span className="text-blue-400 text-xl">💡</span>
                <div className="text-sm text-blue-300">
                  <div className="font-semibold mb-1">Automatycznie ustawione:</div>
                  <div>• Priorytet: Średni</div>
                  <div>• Kategoria: Ogólne</div>
                  <div>• Szacowany czas: 60 minut</div>
                  <div>• Lokalizacja: Do określenia</div>
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-6 border-t border-slate-600">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex-1"
              >
                {loading ? "Tworzenie..." : "Utwórz zadanie"}
              </button>
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="btn-secondary px-8"
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