import { useState, useEffect } from "react";
import { useTasks } from "../hooks/useTasks";
import { buildingService } from "../services/buildingService";

export default function TaskEditModal({ task, technicians, onClose, onTaskUpdated }) {
  const { updateTask } = useTasks();
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: task.title || "",
    description: task.description || "",
    priority: task.priority || "Średni",
    location: task.location || "",
    customLocation: "",
    assignedTo: task.assignedTo || "",
    dueDate: task.dueDate ? task.dueDate.split('T')[0] : "",
    shift: task.shift || task.assignedShift || "Dzienna",
    estimatedDuration: task.estimatedDuration || 60,
    progress: task.progress || 0
  });

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = () => {
    try {
      const locationsList = buildingService.getLocationsList();
      setLocations(locationsList);
      
      // Sprawdź czy aktualna lokalizacja jest w liście
      if (task.location && !locationsList.includes(task.location)) {
        setFormData(prev => ({
          ...prev,
          location: "custom",
          customLocation: task.location
        }));
      }
    } catch (error) {
      console.error('Error fetching locations:', error);
      setLocations([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const finalLocation = formData.location === "custom" ? formData.customLocation : formData.location;
      
      const updateData = {
        title: formData.title,
        description: formData.description,
        priority: formData.priority,
        location: finalLocation,
        assignedTo: formData.assignedTo || null,
        dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null,
        shift: formData.shift,
        estimatedDuration: parseInt(formData.estimatedDuration),
        progress: parseInt(formData.progress),
        lastModified: new Date().toISOString(),
        lastModifiedBy: "Administrator Systemu",
        history: [
          ...(task.history || []),
          {
            action: "edited",
            user: "Administrator Systemu",
            timestamp: new Date().toISOString(),
            details: "Zadanie zostało edytowane"
          }
        ]
      };

      await updateTask(task._id, updateData);
      
      if (onTaskUpdated) {
        onTaskUpdated();
      }
    } catch (err) {
      setError(err.response?.data?.message || "Błąd podczas aktualizacji zadania");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-0 md:p-4">
      <div className={`glass-card max-w-2xl w-full ${
        window.innerWidth < 768 ? 'modal-mobile' : 'max-h-[90vh]'
      } overflow-y-auto mobile-scroll`}>
        <div className={window.innerWidth < 768 ? 'modal-content-mobile' : ''}>
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white text-lg md:text-xl">✏️</span>
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Edytuj zadanie</h2>
                <p className="text-slate-400 text-sm">ID: #{task._id?.slice(-6) || 'N/A'}</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-slate-700/50 rounded-xl transition-all duration-200"
              disabled={loading}
            >
              <span className="text-xl md:text-2xl text-slate-400 hover:text-white">×</span>
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-2xl">
              <div className="text-red-400 font-medium">{error}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div className="space-y-4">
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
                    required
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-200 mb-2">
                    Priorytet *
                  </label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    className="input-field w-full"
                    required
                    disabled={loading}
                  >
                    <option value="Niski">🟢 Niski</option>
                    <option value="Średni">🟡 Średni</option>
                    <option value="Wysoki">🔴 Wysoki</option>
                    <option value="Krytyczny">🚨 Krytyczny</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-200 mb-2">
                    Lokalizacja
                  </label>
                  <select
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="input-field w-full"
                    disabled={loading}
                  >
                    <option value="">Wybierz lokalizację</option>
                    {locations.map((location, index) => (
                      <option key={index} value={location}>{location}</option>
                    ))}
                    <option value="custom">🖊️ Inna lokalizacja...</option>
                  </select>
                  
                  {formData.location === "custom" && (
                    <input
                      type="text"
                      name="customLocation"
                      value={formData.customLocation}
                      onChange={handleChange}
                      className="input-field w-full mt-2"
                      placeholder="Wpisz lokalizację..."
                      disabled={loading}
                    />
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-200 mb-2">
                    Przypisany technik
                  </label>
                  <select
                    name="assignedTo"
                    value={formData.assignedTo}
                    onChange={handleChange}
                    className="input-field w-full"
                    disabled={loading}
                  >
                    <option value="">Nieprzypisane</option>
                    {technicians.map((tech) => (
                      <option key={tech.id} value={tech.id}>
                        {tech.fullName} - {tech.specialization}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-4">
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
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-200 mb-2">
                    Zmiana
                  </label>
                  <select
                    name="shift"
                    value={formData.shift}
                    onChange={handleChange}
                    className="input-field w-full"
                    disabled={loading}
                  >
                    <option value="Dzienna">☀️ Dzienna (07:00 - 19:00)</option>
                    <option value="Nocna">🌙 Nocna (19:00 - 07:00)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-200 mb-2">
                    Szacowany czas (minuty)
                  </label>
                  <input
                    type="number"
                    name="estimatedDuration"
                    value={formData.estimatedDuration}
                    onChange={handleChange}
                    className="input-field w-full"
                    min="1"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-200 mb-2">
                    Postęp (%)
                  </label>
                  <div className="space-y-2">
                    <input
                      type="range"
                      name="progress"
                      value={formData.progress}
                      onChange={handleChange}
                      className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                      min="0"
                      max="100"
                      disabled={loading}
                    />
                    <div className="text-center text-slate-300 text-lg font-bold">{formData.progress}%</div>
                  </div>
                </div>
              </div>
            </div>

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

            <div className="flex gap-4 pt-6 border-t border-slate-600">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex-1 py-3 md:py-4"
              >
                {loading ? "Zapisywanie..." : "Zapisz zmiany"}
              </button>
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="btn-secondary px-4 md:px-8 py-3 md:py-4"
              >
                Anuluj
              </button>
            </div>
          </form>
        </div>
      </div>
      </div>
    </div>
  );
}