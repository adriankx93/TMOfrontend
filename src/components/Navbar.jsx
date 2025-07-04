export default function Navbar() {
  return (
    <nav className="bg-gradient-to-r from-blue-900 to-blue-700 px-8 py-4 flex justify-between items-center shadow-lg">
      <span className="font-bold text-2xl text-white tracking-wider">TMO</span>
      <div className="flex gap-4">
        <a href="#panel" className="text-white font-semibold hover:text-blue-200 transition">Panel</a>
        <a href="#users" className="text-white font-semibold hover:text-blue-200 transition">Użytkownicy</a>
        <a href="#login" className="text-white font-semibold hover:text-blue-200 transition">Logowanie</a>
      </div>
    </nav>
  );
}
