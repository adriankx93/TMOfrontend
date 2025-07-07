// src/components/EditTaskModal.jsx
export default function EditTaskModal({ task, employees, onClose, onTaskUpdated }) {
  if (!task) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl p-8 shadow-xl max-w-lg w-full">
        <h2 className="text-xl font-bold mb-4">Edytuj zadanie</h2>
        <div className="mb-4">Numer: {task.id}</div>
        <div className="mb-4">Nazwa: {task.name || task.title}</div>
        {/* Tu możesz dodać edycję pól, select pracownika, datę itd. */}
        <button
          className="btn-primary"
          onClick={() => {
            onTaskUpdated?.();
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
