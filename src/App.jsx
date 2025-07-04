import React from "react";

function Sidebar() {
  return (
    <aside className="hidden md:flex flex-col w-64 bg-gradient-to-br from-blue-900 to-blue-700 text-white min-h-screen py-10 px-6 gap-6 shadow-2xl">
      <div className="font-extrabold text-2xl mb-12 tracking-wide">TMO</div>
      <nav className="flex flex-col gap-2">
        <a href="#" className="py-3 px-4 rounded-xl bg-white/10 hover:bg-white/20 font-semibold transition">Dashboard</a>
        <a href="#" className="py-3 px-4 rounded-xl hover:bg-white/10 transition">Technicy</a>
        <a href="#" className="py-3 px-4 rounded-xl hover:bg-white/10 transition">Zgłoszenia</a>
        <a href="#" className="py-3 px-4 rounded-xl hover:bg-white/10 transition">Ustawienia</a>
      </nav>
      <div className="flex-1" />
      <div className="text-white/60 text-xs">© {new Date().getFullYear()} TMO</div>
    </aside>
  );
}

function Topbar() {
  return (
    <header className="flex justify-between items-center py-6 px-8 bg-white shadow rounded-2xl mb-8 ml-0 md:ml-8">
      <div className="text-2xl font-bold text-blue-900">Dashboard</div>
      <div className="flex gap-4 items-center">
        <input
          className="px-4 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-blue-400 transition"
          placeholder="Szukaj..."
        />
        <button className="rounded-full w-10 h-10 bg-blue-100 flex items-center justify-center font-bold text-blue-900">A</button>
      </div>
    </header>
  );
}

function StatCard({ icon, title, value }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-7 flex flex-col gap-2 items-start min-w-[180px] flex-1 hover:scale-[1.03] transition">
      <div className="text-3xl">{icon}</div>
      <div className="text-lg text-blue-900 font-bold">{value}</div>
      <div className="text-slate-500 font-medium">{title}</div>
    </div>
  );
}

function Stats() {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7 mb-10">
      <StatCard icon="👤" title="Użytkownicy" value="8" />
      <StatCard icon="🛠️" title="Zgłoszenia" value="17" />
      <StatCard icon="🚗" title="Technicy" value="4" />
      <StatCard icon="⭐" title="Ocena systemu" value="4.9/5" />
    </section>
  );
}

function TicketsTable() {
  // Przykładowe dane, zamień na API gdy chcesz
  const tickets = [
    { id: 1, title: "Awaria światła", status: "Nowe", tech: "Jan Nowak", date: "2025-07-01" },
    { id: 2, title: "Uszkodzona brama", status: "W trakcie", tech: "Alicja K.", date: "2025-07-02" },
    { id: 3, title: "Czujnik alarmu", status: "Zamknięte", tech: "Piotr Z.", date: "2025-07-03" },
  ];
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 mt-2">
      <div className="text-xl font-bold mb-4 text-blue-900">Zgłoszenia</div>
      <table className="min-w-full">
        <thead>
          <tr className="text-left bg-blue-50">
            <th className="py-3 px-6 rounded-l-xl">Temat</th>
            <th className="py-3 px-6">Status</th>
            <th className="py-3 px-6">Technik</th>
            <th className="py-3 px-6 rounded-r-xl">Data</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((t, i) => (
            <tr key={t.id} className="hover:bg-blue-50 transition">
              <td className="py-3 px-6 font-semibold">{t.title}</td>
              <td className="py-3 px-6">
                <span className={
                  t.status === "Nowe" ? "bg-blue-200 text-blue-800 px-3 py-1 rounded-full text-xs font-bold" :
                  t.status === "W trakcie" ? "bg-yellow-200 text-yellow-800 px-3 py-1 rounded-full text-xs font-bold" :
                  "bg-green-200 text-green-800 px-3 py-1 rounded-full text-xs font-bold"
                }>
                  {t.status}
                </span>
              </td>
              <td className="py-3 px-6">{t.tech}</td>
              <td className="py-3 px-6">{t.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function App() {
  return (
    <div className="bg-gradient-to-br from-blue-50 via-slate-100 to-blue-200 min-h-screen flex">
      <Sidebar />
      <main className="flex-1 px-2 md:px-8 py-6">
        <Topbar />
        <Stats />
        <TicketsTable />
      </main>
    </div>
  );
}
