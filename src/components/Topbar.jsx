export default function Topbar() {
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
