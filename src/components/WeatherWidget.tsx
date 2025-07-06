import { useWeather } from "../hooks/useWeather";

export default function WeatherWidget() {
  const { weather, loading, error } = useWeather();

  if (loading) return (
    <div className="glass-card-light p-6">
      <p className="text-slate-400">Ładowanie pogody...</p>
    </div>
  );

  if (error) return (
    <div className="glass-card-light p-6">
      <p className="text-red-400">{error}</p>
    </div>
  );

  if (!weather.length) return (
    <div className="glass-card-light p-6">
      <p className="text-slate-400">Brak danych pogodowych.</p>
    </div>
  );

  const now = weather[0];
  const nowHour = new Date(now.time).getHours();

  return (
    <div className="glass-card-light p-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <div className="text-white font-semibold">Warszawa</div>
          <div className="text-slate-400 text-sm">Aktualna pogoda</div>
        </div>
        <div className="text-3xl">{now.temperature}°C</div>
      </div>
      <div className="grid grid-cols-3 gap-4 text-sm text-slate-300">
        <div>
          <div>Wilgotność</div>
          <div className="font-semibold text-white">{now.humidity}%</div>
        </div>
        <div>
          <div>Opady</div>
          <div className="font-semibold text-white">{now.precipitation} mm</div>
        </div>
        <div>
          <div>Godzina</div>
          <div className="font-semibold text-white">{nowHour}:00</div>
        </div>
      </div>
    </div>
  );
}
