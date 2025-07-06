export const weatherService = {
  // Mock weather data for Warsaw
  getCurrentWeather: async () => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock data - in real app would call OpenWeatherMap API
    return {
      temperature: Math.round(15 + Math.random() * 10), // 15-25°C
      humidity: Math.round(45 + Math.random() * 30), // 45-75%
      pressure: Math.round(1010 + Math.random() * 20), // 1010-1030 hPa
      windSpeed: Math.round(5 + Math.random() * 10), // 5-15 km/h
      description: getRandomWeatherDescription(),
      icon: getRandomWeatherIcon(),
      city: "Warszawa",
      country: "PL"
    };
  }
};

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