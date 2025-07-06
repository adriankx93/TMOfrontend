import { useState, useEffect } from "react";

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
      
      // Mock weather data - w rzeczywistej aplikacji można użyć API pogodowego
      const mockWeather = {
        temperature: Math.round(15 + Math.random() * 10), // 15-25°C
        humidity: Math.round(45 + Math.random() * 30), // 45-75%
        pressure: Math.round(1010 + Math.random() * 20), // 1010-1030 hPa
        windSpeed: Math.round(5 + Math.random() * 10), // 5-15 km/h
        description: getRandomWeatherDescription(),
        icon: getRandomWeatherIcon(),
        city: "Warszawa",
        country: "PL",
        visibility: Math.round(8 + Math.random() * 7), // 8-15 km
        uvIndex: Math.round(Math.random() * 10), // 0-10
        feelsLike: Math.round(15 + Math.random() * 10 + (Math.random() - 0.5) * 4)
      };
      
      setWeather(mockWeather);
    } catch (error) {
      console.error('Error fetching weather:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRandomWeatherDescription = () => {
    const descriptions = [
      "Słonecznie",
      "Częściowo pochmurno", 
      "Pochmurno",
      "Lekki deszcz",
      "Mgła",
      "Bezchmurnie",
      "Przelotne opady",
      "Zachmurzenie zmienne"
    ];
    return descriptions[Math.floor(Math.random() * descriptions.length)];
  };

  const getRandomWeatherIcon = () => {
    const icons = ["☀️", "⛅", "☁️", "🌧️", "🌫️", "🌤️", "🌦️", "⛈️"];
    return icons[Math.floor(Math.random() * icons.length)];
  };

  if (loading) {
    return (
      <div className="glass-card-light p-6 min-w-[300px] animate-pulse">
        <div className="h-4 bg-slate-600 rounded mb-2"></div>
        <div className="h-8 bg-slate-600 rounded mb-4"></div>
        <div className="grid grid-cols-2 gap-4">
          <div className="h-4 bg-slate-600 rounded"></div>
          <div className="h-4 bg-slate-600 rounded"></div>
        </div>
      </div>
    );
  }

  if (!weather) {
    return (
      <div className="glass-card-light p-6 min-w-[300px]">
        <div className="text-slate-400 text-sm text-center">
          <span className="text-2xl mb-2 block">🌡️</span>
          Brak danych pogodowych
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card-light p-6 min-w-[300px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-4xl">{weather.icon}</span>
          <div>
            <div className="font-bold text-white text-lg">{weather.city}</div>
            <div className="text-sm text-slate-400">{weather.description}</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-white">{weather.temperature}°C</div>
          <div className="text-sm text-slate-400">Odczuwalna {weather.feelsLike}°C</div>
        </div>
      </div>
      
      {/* Main metrics */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center p-3 glass-card-light rounded-xl">
          <div className="text-slate-400 text-xs mb-1">Wilgotność</div>
          <div className="font-bold text-white">{weather.humidity}%</div>
        </div>
        <div className="text-center p-3 glass-card-light rounded-xl">
          <div className="text-slate-400 text-xs mb-1">Wiatr</div>
          <div className="font-bold text-white">{weather.windSpeed} km/h</div>
        </div>
      </div>

      {/* Additional metrics */}
      <div className="grid grid-cols-3 gap-2 mb-4 text-xs">
        <div className="text-center">
          <div className="text-slate-400">Ciśnienie</div>
          <div className="font-semibold text-white">{weather.pressure} hPa</div>
        </div>
        <div className="text-center">
          <div className="text-slate-400">Widoczność</div>
          <div className="font-semibold text-white">{weather.visibility} km</div>
        </div>
        <div className="text-center">
          <div className="text-slate-400">UV Index</div>
          <div className="font-semibold text-white">{weather.uvIndex}</div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="pt-4 border-t border-slate-600">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>Ostatnia aktualizacja</span>
          <span>{new Date().toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      </div>
    </div>
  );
}

function getRandomWeatherDescription() {
  const descriptions = [
    "Słonecznie",
    "Częściowo pochmurno",
    "Pochmurno", 
    "Lekki deszcz",
    "Mgła",
    "Bezchmurnie"
  ];
  return descriptions[Math.floor(Math.random() * descriptions.length)];
}

function getRandomWeatherIcon() {
  const icons = ["☀️", "⛅", "☁️", "🌧️", "🌫️", "🌤️"];
  return icons[Math.floor(Math.random() * icons.length)];
}