import { useState, useEffect } from "react";
import { weatherService } from "../services/weatherService";

export default function WeatherWidget() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWeather();
    // Update weather every 10 minutes
    const interval = setInterval(fetchWeather, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchWeather = async () => {
    try {
      setLoading(true);
      const data = await weatherService.getCurrentWeather();
      setWeather(data);
    } catch (error) {
      console.error('Error fetching weather:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white/20 backdrop-blur-xl rounded-2xl p-4 animate-pulse">
        <div className="h-4 bg-white/30 rounded mb-2"></div>
        <div className="h-8 bg-white/30 rounded"></div>
      </div>
    );
  }

  if (!weather) {
    return (
      <div className="bg-white/20 backdrop-blur-xl rounded-2xl p-4">
        <div className="text-white/80 text-sm">Brak danych pogodowych</div>
      </div>
    );
  }

  return (
    <div className="bg-white/20 backdrop-blur-xl rounded-2xl p-4 text-white">
      <div className="flex items-center gap-3 mb-2">
        <span className="text-2xl">{weather.icon}</span>
        <div>
          <div className="font-semibold">{weather.city}</div>
          <div className="text-sm text-white/80">{weather.description}</div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <div className="text-3xl font-bold">{weather.temperature}°C</div>
          <div className="text-white/80">Temperatura</div>
        </div>
        <div>
          <div className="text-xl font-bold">{weather.humidity}%</div>
          <div className="text-white/80">Wilgotność</div>
        </div>
      </div>
      
      <div className="mt-3 pt-3 border-t border-white/20 grid grid-cols-2 gap-4 text-xs">
        <div>
          <span className="text-white/80">Ciśnienie: </span>
          <span className="font-semibold">{weather.pressure} hPa</span>
        </div>
        <div>
          <span className="text-white/80">Wiatr: </span>
          <span className="font-semibold">{weather.windSpeed} km/h</span>
        </div>
      </div>
    </div>
  );
}