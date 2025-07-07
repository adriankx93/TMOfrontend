import { useEffect, useState } from "react";

// Przykładowa struktura jednego technika – zmień według swoich danych
type Technician = {
  id: string | number;
  name: string;
  skills?: string[];     // Jeśli masz tablicę
  position?: string;     // Jeśli masz tekst
  [key: string]: any;    // Dla bezpieczeństwa
};

export default function TechniciansFromSheets() {
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState<string>("");

  useEffect(() => {
    setLoading(true);
    fetch("/api/technicians") // Zmień na swój endpoint!
      .then((res) => {
        if (!res.ok) throw new Error("Błąd pobierania danych");
        return res.json();
      })
      .then((data) => {
        setTechnicians(Array.isArray(data) ? data : []);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  // Bezpieczne filtrowanie (możesz dopasować do swoich potrzeb!)
  const filtered = technicians.filter((t) => {
    // Przykład: filtruje po imieniu i/lub po skills, bezpiecznie!
    const nameMatch = (t.name || "").toLowerCase().includes(search.toLowerCase());
    const skillsMatch = Array.isArray(t.skills)
      ? t.skills.some(skill =>
          (skill || "").toLowerCase().includes(search.toLowerCase())
        )
      : false;
    return nameMatch || skillsMatch;
  });

  if (loading) return <div>Ładowanie...</div>;
  if (error) return <div className="text-red-500">Błąd: {error}</div>;
  if (!technicians.length) return <div>Brak techników.</div>;

  return (
    <div>
      <div className="mb-4">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Szukaj technika lub umiejętności..."
          className="input input-bordered w-full max-w-xs"
        />
      </div>
      <div className="grid gap-4">
        {filtered.map((tech) => (
          <div key={tech.id} className="p-4 rounded-xl bg-white/10">
            <div className="font-bold">{tech.name}</div>
            {Array.isArray(tech.skills) && tech.skills.length > 0 && (
              <div className="text-sm text-slate-400">
                {tech.skills.join(", ")}
              </div>
            )}
            {tech.position && (
              <div className="text-sm text-slate-400">{tech.position}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
