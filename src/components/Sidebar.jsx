export default function Sidebar() {
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
