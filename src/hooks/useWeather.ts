import { useEffect, useState } from "react";

interface WeatherHour {
  time: string;
  temperature: number;
  humidity: number;
  precipitation: number;
}

export function useWeather() {
  const [weather, setWeather] = useState<WeatherHour[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadWeather = async () => {
      try {
        setLoading(true);
        setError(null);

        const url = `https://api.open-meteo.com/v1/forecast?latitude=52.2298&longitude=21.0118&hourly=temperature_2m,relative_humidity_2m,precipitation&forecast_days=1`;

        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        const times: string[] = data.hourly.time;
        const temperatures: number[] = data.hourly.temperature_2m;
        const humidities: number[] = data.hourly.relative_humidity_2m;
        const precipitations: number[] = data.hourly.precipitation;

        const parsed: WeatherHour[] = times.map((t, i) => ({
          time: t,
          temperature: temperatures[i],
          humidity: humidities[i],
          precipitation: precipitations[i],
        }));

        setWeather(parsed);
      } catch (err) {
        console.error("Błąd pobierania pogody:", err);
        setError("Nie udało się pobrać danych pogodowych.");
      } finally {
        setLoading(false);
      }
    };

    loadWeather();
  }, []);

  return { weather, loading, error };
}
