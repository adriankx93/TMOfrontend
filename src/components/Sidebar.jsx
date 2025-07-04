export default function Sidebar() {
  return (
    <aside className="h-full w-56 bg-gradient-to-b from-blue-900 to-blue-700 text-white flex flex-col p-6 gap-6 shadow-2xl rounded-2xl mr-8">
      <div className="font-extrabold text-2xl mb-6">TMO</div>
      <a href="#panel" className="py-2 px-4 rounded-xl hover:bg-blue-800 transition">Panel</a>
      <a href="#users" className="py-2 px-4 rounded-xl hover:bg-blue-800 transition">Użytkownicy</a>
      <a href="#settings" className="py-2 px-4 rounded-xl hover:bg-blue-800 transition">Ustawienia</a>
    </aside>
  );
}
