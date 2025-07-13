import { useState } from "react";

export default function EditTaskModal({ task, employees, onClose, onTaskUpdated }) {
  const [technicianId, setTechnicianId] = useState(task.technicianId || "");

  if (!task) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl p-8 shadow-xl max-w-lg w-full">
        <h2 className="text-xl font-bold mb-4">Edytuj zadanie</h2>
        <div className="mb-4">Numer: {task.id}</div>
        <div className="mb-4">Nazwa: {task.name || task.title}</div>
        
        {/* Select technika */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">Technik</label>
          <select
            className="w-full border rounded-lg p-2"
            value={technicianId}
            onChange={e => setTechnicianId(e.target.value)}
          >
            <option value="">Wybierz technika</option>
            {employees && employees.length > 0 ? (
              employees.map(emp => (
                <option key={emp.id} value={emp.id}>
                  {emp.name || `${emp.firstName} ${emp.lastName}`}
                </option>
              ))
            ) : (
              <option disabled>Brak techników</option>
            )}
          </select>
        </div>

        <button
          className="btn-primary"
          onClick={() => {
            // Tutaj możesz wywołać API lub callback, przekazując zmienione wartości
            onTaskUpdated?.({ ...task, technicianId });
            onClose?.();
          }}
        >Zapisz</button>
        <button
          className="ml-2 btn"
          onClick={onClose}
        >Anuluj</button>
      </div>
    </div>
  );
}
