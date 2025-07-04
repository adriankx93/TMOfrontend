export default function Hero() {
  return (
    <section className="bg-gradient-to-br from-blue-700 via-blue-400 to-slate-300 pt-20 pb-28 px-4 text-center shadow-xl relative">
      <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4 drop-shadow-lg">TMO – Zarządzaj technologią</h1>
      <p className="text-lg md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto drop-shadow-sm">
        Nowoczesny system do zarządzania techniką obiektów. Szybko, wygodnie, bezpiecznie.
      </p>
      <button className="bg-blue-900 hover:bg-blue-800 transition text-white font-semibold py-4 px-12 rounded-2xl shadow-xl text-lg">
        Wypróbuj za darmo
      </button>
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] blur-3xl opacity-40 bg-gradient-to-r from-blue-500 via-blue-400 to-slate-200 rounded-full -z-10" />
    </section>
  );
}
