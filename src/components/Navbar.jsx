export default function Navbar() {
  return (
    <nav className="bg-gradient-to-r from-blue-900 to-blue-600 px-8 py-4 flex justify-between items-center shadow-lg">
      <span className="font-bold text-2xl text-white tracking-wider">SINGU</span>
      <button className="px-5 py-2 bg-white/10 text-white rounded-2xl border border-white/20 hover:bg-blue-700 transition font-semibold shadow">
        Logowanie
      </button>
    </nav>
  );
}
