import { useTechnicians } from "../hooks/useTechnicians";
import { useTasks } from "../hooks/useTasks";

export default function ShiftOverview() {
  const { technicians } = useTechnicians();
  const { tasks } = useTasks();
  
  const currentHour = new Date().getHours();
  const isDay = currentHour >= 7 && currentHour < 19;

  const dayTechnicians = technicians.filter(t => t.shift === 'Dzienna');
  const nightTechnicians = technicians.filter(t => t.shift === 'Nocna');

  const getDayTasks = () => {
    return tasks.filter(task => 
      task.shift === 'Dzienna' && 
      ['assigned', 'in_progress'].includes(task.status)
    ).length;
  };

  const getNightTasks = () => {
    return tasks.filter(task => 
      task.shift === 'Nocna' && 
      ['assigned', 'in_progress'].includes(task.status)
    ).length;
  };

  const getShiftTechnicians = (shift) => {
    return technicians.filter(t => t.shift === shift).map(tech => ({
      ...tech,
      tasks: tasks.filter(task => 
        task.assignedTo === tech._id && 
        ['assigned', 'in_progress'].includes(task.status)
      ).length
    }));
  };

  const currentShift = {
    name: isDay ? "Zmiana dzienna" : "Zmiana nocna",
    time: isDay ? "07:00 - 19:00" : "19:00 - 07:00",
    technicians: getShiftTechnicians(isDay ? 'Dzienna' : 'Nocna'),
    active: true
  };

  const nextShift = {
    name: isDay ? "Zmiana nocna" : "Zmiana dzienna", 
    time: isDay ? "19:00 - 07:00" : "07:00 - 19:00",
    technicians: getShiftTechnicians(isDay ? 'Nocna' : 'Dzienna'),
    active: false
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return 'bg-emerald-100 text-emerald-800';
      case 'break': return 'bg-amber-100 text-amber-800';
      case 'inactive': return 'bg-slate-100 text-slate-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  const getStatusLabel = (status) => {
    switch(status) {
      case 'active': return 'Aktywny';
      case 'break': return 'Przerwa';
      case 'inactive': return 'Nieaktywny';
      default: return 'Nieznany';
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-2xl md:rounded-3xl shadow-xl p-4 md:p-8">
      <div className="flex items-center gap-4 mb-6">
        <div className={`w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br ${isDay ? 'from-yellow-400 to-orange-500' : 'from-blue-500 to-indigo-600'} rounded-2xl flex items-center justify-center shadow-lg`}>
          <span className="text-white text-lg md:text-xl">{isDay ? '☀️' : '🌙'}</span>
        </div>
        <div>
          <h3 className="text-lg md:text-xl font-bold text-slate-800">Przegląd zmian</h3>
          <p className="text-slate-600 text-sm md:text-base">Status bieżącej i następnej zmiany</p>
        </div>
      </div>

      {/* Current Shift */}
      <div className="mb-6 md:mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="font-bold text-base md:text-lg text-slate-800">{currentShift.name}</h4>
            <p className="text-slate-600 text-sm md:text-base">{currentShift.time}</p>
          </div>
          <div className="px-3 md:px-4 py-2 bg-emerald-100 text-emerald-800 rounded-xl font-semibold text-sm md:text-base">
            Aktywna
          </div>
        </div>

        <div className="space-y-3">
          {currentShift.technicians.length === 0 ? (
            <div className="text-center py-3 md:py-4 text-slate-500 text-sm md:text-base">
              Brak techników na tej zmianie
            </div>
          ) : (
            currentShift.technicians.map((tech) => (
              <div key={tech._id} className="flex items-center justify-between p-3 md:p-4 bg-slate-50 rounded-xl md:rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 md:w-8 md:h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-white text-xs md:text-sm font-bold">
                    {tech.firstName[0]}{tech.lastName[0]}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-800 text-sm md:text-base">{tech.firstName} {tech.lastName}</div>
                    <div className="text-xs md:text-sm text-slate-600">{tech.tasks} zadań • {tech.specialization}</div>
                  </div>
                </div>
                <span className={`px-2 md:px-3 py-1 rounded-xl text-xs md:text-sm font-semibold ${getStatusColor(tech.status)}`}>
                  {getStatusLabel(tech.status)}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Next Shift Preview */}
      <div className="border-t border-slate-200 pt-4 md:pt-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="font-bold text-base md:text-lg text-slate-800">{nextShift.name}</h4>
            <p className="text-slate-600 text-sm md:text-base">{nextShift.time}</p>
          </div>
          <div className="px-3 md:px-4 py-2 bg-slate-100 text-slate-600 rounded-xl font-semibold text-sm md:text-base">
            Następna
          </div>
        </div>

        <div className="text-xs md:text-sm text-slate-600">
          {nextShift.technicians.length === 0 ? (
            <div>Brak techników przypisanych do następnej zmiany</div>
          ) : (
            <div>
              Technicy ({nextShift.technicians.length}): {nextShift.technicians.map(t => `${t.firstName} ${t.lastName}`).join(', ')}
            </div>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mt-4 md:mt-6 grid grid-cols-2 gap-3 md:gap-4">
        <div className="text-center p-3 md:p-4 bg-yellow-50 rounded-xl border border-yellow-200">
          <div className="text-xl md:text-2xl font-bold text-yellow-800">{getDayTasks()}</div>
          <div className="text-xs md:text-sm text-yellow-600">Zadania dzienna</div>
        </div>
        <div className="text-center p-3 md:p-4 bg-blue-50 rounded-xl border border-blue-200">
          <div className="text-xl md:text-2xl font-bold text-blue-800">{getNightTasks()}</div>
          <div className="text-xs md:text-sm text-blue-600">Zadania nocna</div>
        </div>
      </div>
    </div>
  );
}