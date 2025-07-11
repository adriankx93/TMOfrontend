import { useState, useEffect } from "react";
import { useTasks } from "../hooks/useTasks";
import { sheetsService } from "../services/sheetsService";
import { buildingService } from "../services/buildingService";

export default function CreateTaskModal({ onClose, onTaskCreated }) {
  const { createTask } = useTasks();
  const [technicians, setTechnicians] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "Średni",
    location: "",
    customLocation: "",
    assignmentType: "shift", // "shift" lub "technician"
    selectedDate: "",
    selectedShift: "Dzienna",
    assignedTo: "",
    quickShift: "" // "today-day" lub "today-night"
  });

  useEffect(() => {
    fetchTechnicians();
    fetchLocations();
    
    // Ustaw dzisiejszą datę jako domyślną
    const today = new Date().toISOString().split('T')[0];
    setFormData(prev => ({ ...prev, selectedDate: today }));
  }, []);

  const fetchTechnicians = async () => {
    try {
      const data = await sheetsService.getCurrentMonthData();
      setTechnicians(data.technicians);
    } catch (error) {
      console.error('Error fetching technicians:', error);
      setTechnicians([]);
    }
  };

  const fetchLocations = () => {
    try {
      const locationsList = buildingService.getLocationsList();
      setLocations(locationsList);
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
      
      let assignmentData = {};
      
      if (formData.quickShift) {
        // Szybkie przypisanie do dzisiejszej zmiany
        const today = new Date().toISOString().split('T')[0];
        const shift = formData.quickShift === "today-day" ? "Dzienna" : "Nocna";
        assignmentData = {
          dueDate: today,
          shift: shift,
          status: "pool", // Trafia do puli dla danej zmiany
          assignedShift: shift
        };
      } else if (formData.assignmentType === "shift") {
        // Przypisanie do zmiany w wybranej dacie
        assignmentData = {
          dueDate: formData.selectedDate,
          shift: formData.selectedShift,
          status: "pool",
          assignedShift: formData.selectedShift
        };
      } else {
        // Bezpośrednie przypisanie do technika
        assignmentData = {
          assignedTo: formData.assignedTo,
          status: "assigned",
          dueDate: formData.selectedDate,
          shift: formData.selectedShift
        };
      }

      const taskData = {
        title: formData.title,
        description: formData.description,
        priority: formData.priority,
        location: finalLocation || "Do określenia",
        category: "Ogólne",
        estimatedDuration: 60,
        createdAt: new Date().toISOString(),
        createdBy: "Administrator Systemu", // W przyszłości z kontekstu użytkownika
        progress: 0,
        history: [{
          action: "created",
          user: "Administrator Systemu",
          timestamp: new Date().toISOString(),
          details: `Zadanie utworzone: "${formData.title}"`
        }],
        ...assignmentData
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
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      // Resetuj quickShift gdy wybieramy inne opcje
      ...(name !== "quickShift" && { quickShift: "" })
    }));
  };

  const handleQuickShift = (shiftType) => {
    setFormData(prev => ({
      ...prev,
      quickShift: shiftType,
      assignmentType: "shift"
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-0 md:p-4">
      <div className={`glass-card w-full max-w-2xl ${
        window.innerWidth < 768 ? 'modal-mobile' : 'max-h-[90vh]'
      } overflow-y-auto mobile-scroll`}>
        <div className={window.innerWidth < 768 ? 'modal-content-mobile' : ''}>
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 md:w-12 md:h-12 gradient-primary rounded-2xl flex items-center justify-center shadow-lg glow-blue">
                <span className="text-white text-lg md:text-xl">📋</span>
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Nowe zadanie</h2>
                <p className="text-slate-400 text-sm">Utwórz zadanie dla zespołu technicznego</p>
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
            {/* Podstawowe informacje */}
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
                  placeholder="np. Naprawa oświetlenia w hali A"
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-200 mb-2">
                  Opis zadania
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className="input-field w-full"
                  placeholder="Szczegółowy opis zadania..."
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
            </div>

            {/* Szybkie przypisanie */}
            <div className="p-3 md:p-4 bg-blue-500/20 rounded-2xl border border-blue-500/30">
              <h3 className="font-semibold text-blue-300 mb-3">⚡ Szybkie przypisanie</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleQuickShift("today-day")}
                  className={`p-3 md:p-4 rounded-xl font-medium transition-all duration-200 text-center ${
                    formData.quickShift === "today-day"
                      ? "bg-yellow-500/30 text-yellow-300 border border-yellow-500/50"
                      : "bg-slate-700/50 text-slate-300 hover:bg-slate-600/50"
                  }`}
                  disabled={loading}
                >
                  ☀️ Dzisiejsza dzienna
                  <div className="text-xs opacity-70 mt-1">07:00 - 19:00</div>
                </button>
                
                <button
                  type="button"
                  onClick={() => handleQuickShift("today-night")}
                  className={`p-3 md:p-4 rounded-xl font-medium transition-all duration-200 text-center ${
                    formData.quickShift === "today-night"
                      ? "bg-indigo-500/30 text-indigo-300 border border-indigo-500/50"
                      : "bg-slate-700/50 text-slate-300 hover:bg-slate-600/50"
                  }`}
                  disabled={loading}
                >
                  🌙 Dzisiejsza nocna
                  <div className="text-xs opacity-70 mt-1">19:00 - 07:00</div>
                </button>
              </div>
            </div>

            {/* Zaawansowane przypisanie */}
            {!formData.quickShift && (
              <div className="space-y-4">
                <h3 className="font-semibold text-slate-200">📅 Zaawansowane przypisanie</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-200 mb-2">
                      Data wykonania
                    </label>
                    <input
                      type="date"
                      name="selectedDate"
                      value={formData.selectedDate}
                      onChange={handleChange}
                      className="input-field w-full"
                      disabled={loading}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-200 mb-2">
                      Zmiana
                    </label>
                    <select
                      name="selectedShift"
                      value={formData.selectedShift}
                      onChange={handleChange}
                      className="input-field w-full"
                      disabled={loading}
                    >
                      <option value="Dzienna">☀️ Dzienna (07:00 - 19:00)</option>
                      <option value="Nocna">🌙 Nocna (19:00 - 07:00)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-200 mb-2">
                    Typ przypisania
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, assignmentType: "shift" }))}
                      className={`p-3 md:p-4 rounded-xl font-medium transition-all duration-200 text-center ${
                        formData.assignmentType === "shift"
                          ? "bg-purple-500/30 text-purple-300 border border-purple-500/50"
                          : "bg-slate-700/50 text-slate-300 hover:bg-slate-600/50"
                      }`}
                      disabled={loading}
                    >
                      🔄 Do puli zmiany
                      <div className="text-xs opacity-70 mt-1">Technik zostanie przypisany później</div>
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, assignmentType: "technician" }))}
                      className={`p-3 md:p-4 rounded-xl font-medium transition-all duration-200 text-center ${
                        formData.assignmentType === "technician"
                          ? "bg-green-500/30 text-green-300 border border-green-500/50"
                          : "bg-slate-700/50 text-slate-300 hover:bg-slate-600/50"
                      }`}
                      disabled={loading}
                    >
                      👤 Bezpośrednio do technika
                      <div className="text-xs opacity-70 mt-1">Wybierz konkretnego technika</div>
                    </button>
                  </div>
                </div>

                {formData.assignmentType === "technician" && (
                  <div>
                    <label className="block text-sm font-semibold text-slate-200 mb-2">
                      Wybierz technika
                    </label>
                    <select
                      name="assignedTo"
                      value={formData.assignedTo}
                      onChange={handleChange}
                      className="input-field w-full"
                      required={formData.assignmentType === "technician"}
                      disabled={loading}
                    >
                      <option value="">Wybierz technika</option>
                      {technicians.map((tech) => (
                        <option key={tech.id} value={tech.id}>
                          {tech.fullName} - {tech.specialization}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            )}

            <div className="flex gap-4 pt-6 border-t border-slate-600">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex-1 py-3 md:py-4"
              >
                {loading ? "Tworzenie..." : "Utwórz zadanie"}
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