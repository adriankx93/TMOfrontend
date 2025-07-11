export default function TaskDetailsModal({ task, technicians, onClose }) {
  const getStatusColor = (status) => {
    switch(status) {
      case 'assigned': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'in_progress': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'completed': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'overdue': return 'bg-red-100 text-red-800 border-red-200';
      case 'pool': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getStatusLabel = (status) => {
    switch(status) {
      case 'assigned': return 'Przypisane';
      case 'in_progress': return 'W trakcie';
      case 'completed': return 'Zakończone';
      case 'overdue': return 'Przeterminowane';
      case 'pool': return 'W puli';
      default: return 'Nieznany';
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'Krytyczny': return 'bg-red-100 text-red-800 border-red-200';
      case 'Wysoki': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Średni': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Niski': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getTechnicianName = (technicianId) => {
    const technician = technicians.find(t => t.id === technicianId);
    return technician ? technician.fullName : 'Nieprzypisane';
  };

  const getActionLabel = (action) => {
    switch(action) {
      case 'created': return '📝 Utworzono';
      case 'edited': return '✏️ Edytowano';
      case 'status_changed_to_assigned': return '👤 Przypisano';
      case 'status_changed_to_in_progress': return '▶️ Rozpoczęto';
      case 'status_changed_to_completed': return '✅ Zakończono';
      case 'status_changed_to_pool': return '🔄 Przeniesiono do puli';
      default: return '📋 Akcja';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white text-xl">📋</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-800">Szczegóły zadania</h2>
                <p className="text-slate-600">ID: #{task._id?.slice(-6) || 'N/A'}</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-xl transition-all duration-200"
            >
              <span className="text-2xl text-slate-400">×</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Title and Status */}
              <div>
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-bold text-slate-800">{task.title}</h3>
                  <div className="flex gap-2">
                    <span className={`px-3 py-1 rounded-xl text-sm font-semibold border ${getStatusColor(task.status)}`}>
                      {getStatusLabel(task.status)}
                    </span>
                    <span className={`px-3 py-1 rounded-xl text-sm font-semibold border ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                  </div>
                </div>
                
                {task.description && (
                  <p className="text-slate-600 bg-slate-50 p-4 rounded-xl">{task.description}</p>
                )}
              </div>

              {/* Task Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Lokalizacja</label>
                    <div className="p-3 bg-slate-50 rounded-xl text-slate-800">{task.location}</div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Przypisany technik</label>
                    <div className="p-3 bg-slate-50 rounded-xl text-slate-800">{getTechnicianName(task.assignedTo)}</div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Zmiana</label>
                    <div className="p-3 bg-slate-50 rounded-xl text-slate-800">{task.shift || task.assignedShift || 'Brak zmiany'}</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Szacowany czas</label>
                    <div className="p-3 bg-slate-50 rounded-xl text-slate-800">{task.estimatedDuration} minut</div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Termin wykonania</label>
                    <div className="p-3 bg-slate-50 rounded-xl text-slate-800">
                      {task.dueDate 
                        ? new Date(task.dueDate).toLocaleDateString('pl-PL')
                        : 'Bez terminu'
                      }
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Data utworzenia</label>
                    <div className="p-3 bg-slate-50 rounded-xl text-slate-800">
                      {new Date(task.createdAt).toLocaleString('pl-PL')}
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              {task.progress !== undefined && (
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Postęp wykonania</label>
                  <div className="bg-slate-50 p-4 rounded-xl">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-600">Ukończono</span>
                      <span className="font-semibold text-slate-800">{task.progress || 0}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-orange-500 to-red-600 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${task.progress || 0}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}

              {/* Special Status Info */}
              {task.status === 'completed' && task.completedAt && (
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Szczegóły wykonania</label>
                  <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl">
                    <div className="text-sm text-emerald-800 mb-2">
                      <strong>Zakończono:</strong> {new Date(task.completedAt).toLocaleString('pl-PL')}
                    </div>
                    {task.completedBy && (
                      <div className="text-sm text-emerald-800 mb-2">
                        <strong>Przez:</strong> {task.completedBy}
                      </div>
                    )}
                    {task.notes && (
                      <div className="text-sm text-emerald-700">
                        <strong>Notatki:</strong> {task.notes}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {task.status === 'pool' && (task.poolReason || task.missingMaterials) && (
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Powód przeniesienia do puli</label>
                  <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl">
                    <div className="text-sm text-amber-800">{task.poolReason}</div>
                    {task.missingMaterials && (
                      <div className="text-sm text-amber-700 mt-2">
                        <strong>Brakujące materiały:</strong> {task.missingMaterials}
                      </div>
                    )}
                    {task.movedToPoolAt && (
                      <div className="text-xs text-amber-600 mt-2">
                        Przeniesiono: {new Date(task.movedToPoolAt).toLocaleString('pl-PL')}
                        {task.movedToPoolBy && ` przez ${task.movedToPoolBy}`}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* History Sidebar */}
            <div className="space-y-6">
              <div className="bg-slate-50 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-slate-800 mb-4">Historia zmian</h3>
                
                {task.history && task.history.length > 0 ? (
                  <div className="space-y-3">
                    {task.history.slice().reverse().map((entry, index) => (
                      <div key={index} className="bg-white p-3 rounded-xl border border-slate-200">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm">{getActionLabel(entry.action)}</span>
                        </div>
                        <div className="text-xs text-slate-600 mb-1">
                          {entry.user} • {new Date(entry.timestamp).toLocaleString('pl-PL')}
                        </div>
                        {entry.details && (
                          <div className="text-xs text-slate-500">{entry.details}</div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-slate-500">
                    Brak historii zmian
                  </div>
                )}
              </div>

              {/* Creator Info */}
              {task.createdBy && (
                <div className="bg-slate-50 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-slate-800 mb-4">Informacje o zadaniu</h3>
                  <div className="space-y-2 text-sm">
                    <div><strong>Utworzone przez:</strong> {task.createdBy}</div>
                    <div><strong>Data utworzenia:</strong> {new Date(task.createdAt).toLocaleString('pl-PL')}</div>
                    {task.lastModified && (
                      <>
                        <div><strong>Ostatnia modyfikacja:</strong> {new Date(task.lastModified).toLocaleString('pl-PL')}</div>
                        {task.lastModifiedBy && (
                          <div><strong>Przez:</strong> {task.lastModifiedBy}</div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-4 pt-6 border-t border-slate-200 mt-8">
            <button
              onClick={onClose}
              className="flex-1 py-3 bg-slate-100 text-slate-700 rounded-2xl font-semibold hover:bg-slate-200 transition-all duration-200"
            >
              Zamknij
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}