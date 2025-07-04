export default function TicketsTable() {
  const tickets = [
    { 
      id: 1, 
      title: "Awaria oświetlenia LED w hali głównej", 
      status: "Nowe", 
      tech: "Jan Nowak", 
      date: "2025-01-15",
      priority: "Wysoki",
      location: "Hala A, Sektor 3"
    },
    { 
      id: 2, 
      title: "Uszkodzona brama wjazdowa - czujnik", 
      status: "W trakcie", 
      tech: "Alicja Kowalska", 
      date: "2025-01-14",
      priority: "Średni",
      location: "Wjazd główny"
    },
    { 
      id: 3, 
      title: "Kalibracja czujników systemu alarmowego", 
      status: "Zamknięte", 
      tech: "Piotr Zieliński", 
      date: "2025-01-13",
      priority: "Niski",
      location: "Biuro administracyjne"
    },
    { 
      id: 4, 
      title: "Wymiana filtrów w systemie wentylacji", 
      status: "Nowe", 
      tech: "Maria Nowacka", 
      date: "2025-01-15",
      priority: "Średni",
      location: "Dach budynku B"
    },
  ];

  const getStatusBadge = (status) => {
    const styles = {
      "Nowe": "bg-blue-100 text-blue-800 border-blue-200",
      "W trakcie": "bg-amber-100 text-amber-800 border-amber-200", 
      "Zamknięte": "bg-emerald-100 text-emerald-800 border-emerald-200"
    };
    return styles[status] || styles["Nowe"];
  };

  const getPriorityBadge = (priority) => {
    const styles = {
      "Wysoki": "bg-red-100 text-red-800 border-red-200",
      "Średni": "bg-yellow-100 text-yellow-800 border-yellow-200",
      "Niski": "bg-gray-100 text-gray-800 border-gray-200"
    };
    return styles[priority] || styles["Średni"];
  };

  return (
    <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl shadow-xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-50 to-blue-50 px-8 py-6 border-b border-slate-200/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-white text-xl">🎫</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                Zgłoszenia serwisowe
              </h2>
              <p className="text-slate-500 font-medium">
                Zarządzaj wszystkimi zgłoszeniami w systemie
              </p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200">
              + Nowe zgłoszenie
            </button>
            <button className="px-6 py-3 bg-slate-100 text-slate-700 rounded-2xl font-semibold hover:bg-slate-200 transition-all duration-200">
              Filtry
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-200/50">
              <th className="py-4 px-6 text-left font-semibold text-slate-700">Zgłoszenie</th>
              <th className="py-4 px-6 text-left font-semibold text-slate-700">Status</th>
              <th className="py-4 px-6 text-left font-semibold text-slate-700">Priorytet</th>
              <th className="py-4 px-6 text-left font-semibold text-slate-700">Technik</th>
              <th className="py-4 px-6 text-left font-semibold text-slate-700">Lokalizacja</th>
              <th className="py-4 px-6 text-left font-semibold text-slate-700">Data</th>
              <th className="py-4 px-6 text-left font-semibold text-slate-700">Akcje</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket, index) => (
              <tr 
                key={ticket.id} 
                className="border-b border-slate-100 hover:bg-slate-50/50 transition-all duration-200 group"
              >
                <td className="py-6 px-6">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 group-hover:scale-125 transition-transform duration-200"></div>
                    <div>
                      <div className="font-semibold text-slate-800 group-hover:text-blue-600 transition-colors duration-200">
                        {ticket.title}
                      </div>
                      <div className="text-sm text-slate-500 mt-1">
                        ID: #{ticket.id.toString().padStart(4, '0')}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="py-6 px-6">
                  <span className={`px-3 py-2 rounded-xl text-sm font-semibold border ${getStatusBadge(ticket.status)}`}>
                    {ticket.status}
                  </span>
                </td>
                <td className="py-6 px-6">
                  <span className={`px-3 py-2 rounded-xl text-sm font-semibold border ${getPriorityBadge(ticket.priority)}`}>
                    {ticket.priority}
                  </span>
                </td>
                <td className="py-6 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {ticket.tech.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="font-medium text-slate-700">
                      {ticket.tech}
                    </div>
                  </div>
                </td>
                <td className="py-6 px-6">
                  <div className="flex items-center gap-2 text-slate-600">
                    <span className="text-sm">📍</span>
                    <span className="font-medium">{ticket.location}</span>
                  </div>
                </td>
                <td className="py-6 px-6">
                  <div className="text-slate-600 font-medium">
                    {new Date(ticket.date).toLocaleDateString('pl-PL')}
                  </div>
                </td>
                <td className="py-6 px-6">
                  <div className="flex gap-2">
                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 hover:scale-110">
                      👁️
                    </button>
                    <button className="p-2 text-slate-600 hover:bg-slate-50 rounded-xl transition-all duration-200 hover:scale-110">
                      ✏️
                    </button>
                    <button className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 hover:scale-110">
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="bg-slate-50/50 px-8 py-4 border-t border-slate-200/50">
        <div className="flex items-center justify-between text-sm text-slate-600">
          <div className="font-medium">
            Wyświetlono {tickets.length} z {tickets.length} zgłoszeń
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all duration-200 font-medium">
              Poprzednia
            </button>
            <button className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all duration-200 font-medium">
              1
            </button>
            <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all duration-200 font-medium">
              Następna
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}