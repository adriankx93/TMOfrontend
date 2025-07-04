import { useState } from "react";
import { useTasks } from "../hooks/useTasks";
import { useTechnicians } from "../hooks/useTechnicians";

export default function CreateTaskModal({ onClose, onTaskCreated }) {
  const { createTask } = useTasks();
  const { technicians } = useTechnicians();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "Średni",
    assignedTo: "",
    location: "",
    shift: "Dzienna",
    dueTime: "",
    estimatedDuration: "30",
    category: "Elektryka"
  });

  const locations = [
    "Hala A",
    "Hala B", 
    "Hala C",
    "Biuro administracyjne",
    "Parking",
    "Dach budynku A",
    "Dach budynku B",
    "Magazyn A",
    "Magazyn B",
    "Magazyn C",
    "Korytarze A-C",
    "Wjazd główny",
    "Cały obiekt"
  ];

  const categories = [
    "Elektryka",
    "HVAC",
    "Mechanika",
    "Elektronika",
    "Sprzątanie",
    "Bezpieczeństwo",
    "Inne"
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const taskData = {
        ...formData,
        estimatedDuration: parseInt(formData.estimatedDuration),
        status: formData.assignedTo ? "assigned" : "pool",
        createdAt: new Date().toISOString(),
        dueDate: formData.dueTime ? new Date(`${new Date().toDateString()} ${formData.dueTime}`).toISOString() : null
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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white text-xl">📋</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-800">Nowe zadanie</h2>
                <p className="text-slate-600">Utwórz nowe zadanie dla technika</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-xl transition-all duration-200"
              disabled={loading}
            >
              <span className="text-2xl text-slate-400">×</span>
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl">
              <div className="text-red-800 font-medium">{error}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Tytuł zadania *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full p-4 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition-all duration-200"
                placeholder="np. Naprawa oświetlenia w hali A"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Opis zadania
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full p-4 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition-all duration-200"
                placeholder="Szczegółowy opis zadania..."
                disabled={loading}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Priorytet *
                </label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="w-full p-4 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition-all duration-200"
                  required
                  disabled={loading}
                >
                  <option value="Niski">Niski</option>
                  <option value="Średni">Średni</option>
                  <option value="Wysoki">Wysoki</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Kategoria *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full p-4 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition-all duration-200"
                  required
                  disabled={loading}
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Przypisz do technika
              </label>
              <select
                name="assignedTo"
                value={formData.assignedTo}
                onChange={handleChange}
                className="w-full p-4 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition-all duration-200"
                disabled={loading}
              >
                <option value="">Zostaw w puli zadań</option>
                {technicians.map((tech) => (
                  <option key={tech._id} value={tech._id}>
                    {tech.firstName} {tech.lastName} - {tech.specialization}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Lokalizacja *
                </label>
                <select
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full p-4 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition-all duration-200"
                  required
                  disabled={loading}
                >
                  <option value="">Wybierz lokalizację</option>
                  {locations.map((location) => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Zmiana *
                </label>
                <select
                  name="shift"
                  value={formData.shift}
                  onChange={handleChange}
                  className="w-full p-4 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition-all duration-200"
                  required
                  disabled={loading}
                >
                  <option value="Dzienna">Dzienna (07:00 - 19:00)</option>
                  <option value="Nocna">Nocna (19:00 - 07:00)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Termin wykonania
                </label>
                <input
                  type="time"
                  name="dueTime"
                  value={formData.dueTime}
                  onChange={handleChange}
                  className="w-full p-4 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition-all duration-200"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Szacowany czas (minuty)
                </label>
                <input
                  type="number"
                  name="estimatedDuration"
                  value={formData.estimatedDuration}
                  onChange={handleChange}
                  min="15"
                  step="15"
                  className="w-full p-4 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition-all duration-200"
                  placeholder="30"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="flex gap-4 pt-6 border-t border-slate-200">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Tworzenie..." : "Utwórz zadanie"}
              </button>
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="px-8 py-4 bg-slate-100 text-slate-700 rounded-2xl font-semibold hover:bg-slate-200 transition-all duration-200 disabled:opacity-50"
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