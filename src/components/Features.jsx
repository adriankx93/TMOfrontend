const features = [
  {
    title: "Bezpieczeństwo",
    desc: "Zaawansowane szyfrowanie danych i kontrola dostępu.",
    icon: "🔒"
  },
  {
    title: "Łatwość obsługi",
    desc: "Intuicyjny panel użytkownika, szybka nauka obsługi.",
    icon: "⚡"
  },
  {
    title: "Dostępność 24/7",
    desc: "Zarządzaj z dowolnego miejsca na świecie.",
    icon: "🌐"
  }
];

export default function Features() {
  return (
    <section className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8 -mt-16 z-10 relative">
      {features.map(f => (
        <div key={f.title} className="bg-white/90 rounded-2xl shadow-xl p-8 flex flex-col items-center hover:scale-105 transition">
          <div className="text-4xl mb-3">{f.icon}</div>
          <div className="text-xl font-bold text-blue-900 mb-2">{f.title}</div>
          <div className="text-gray-700 text-center">{f.desc}</div>
        </div>
      ))}
    </section>
  );
}
