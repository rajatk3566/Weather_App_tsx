import { useState } from "react";
import axios from "axios";
import { WiHumidity, WiRain, WiStrongWind } from "react-icons/wi";
import { WeatherData } from "@src/types/type";
import bgImage from "@src/assets/background.jpeg";

const WeatherApp = () => {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState(""); 
  const API_URL = import.meta.env.VITE_API_URL;
  const API_KEY = import.meta.env.VITE_API_KEY;

  const fetchWeather = async () => {
    if (!city.trim()) {
      setError("⚠️ Please enter the city name first.");
      return;
    }

    setError(""); 
    try {
      const response = await axios.get<WeatherData>(
        `${API_URL}?q=${city}&appid=${API_KEY}&units=metric`
      );
      console.log(response.data)
      setWeather(response.data);
    } catch (error) {
      console.error("Error fetching weather data", error);
      setWeather(null);
      setError("⚠️ City not found. Please enter a valid city.");
    }
  };

  const calculateRainChance = (cloudCoverage: number) => {
    return Math.min(cloudCoverage * 0.8, 100).toFixed(0);
  };

  return (
    <div
      className="flex flex-col items-center min-h-screen bg-cover bg-center p-4"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="w-full max-w-md text-center mt-8 mb-8">
        <h1 className="text-3xl font-bold mb-6 text-white">Weather App</h1>
        <div className="flex flex-col items-center">
          <input
            type="text"
            placeholder="Enter city name"
            value={city}
            onChange={(e) => {
              setCity(e.target.value);
              setError(""); 
            }}
            className="p-3 border rounded-md w-full mb-2 bg-white"
            onKeyPress={(e) => e.key === "Enter" && fetchWeather()}
          />
          {error && <p className="text-black font-bold text-sm mb-2">{error}</p>} 
          <button
            onClick={fetchWeather}
            className="p-2 w-full bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Get Weather
          </button>
        </div>
      </div>
      {weather && weather.sys && (
        <div className="w-full max-w-md bg-white/30 backdrop-blur-lg rounded-lg shadow-lg overflow-hidden">
          <div className="p-4 bg-blue-100/30">
            <h2 className="text-2xl font-bold text-center text-black">
              {weather.name}, {weather.sys.country}
            </h2>
          </div>
          <div className="p-6 ">
            <div className="flex justify-center items-center mb-4">
              {weather.weather[0].icon && (
                <img
                  src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                  alt={weather.weather[0].description}
                  className="mr-2"
                />
              )}
              <div className="text-5xl font-bold text-white">
                {Math.round(weather.main.temp)}°C
              </div>
            </div>
            <p className="text-center text-xl mb-6 text-white">
              {weather.weather[0].description}
            </p>
            <div className="grid grid-cols-3  gap-4">
              <div className="bg-gray-100/30 p-3 rounded-md flex items-center">
                <WiHumidity size={32} className="text-blue-500 mr-2" />
                <div>
                  <h3 className="text-sm text-gray-200">HUMIDITY</h3>
                  <p className="text-lg font-semibold text-white">
                    {weather.main.humidity}%
                  </p>
                </div>
              </div>
              <div className="bg-gray-100/30 p-3 rounded-md flex items-center">
                <WiRain size={32} className="text-blue-400 mr-2" />
                <div>
                  <h3 className="text-sm text-gray-200">CHANCE OF RAIN</h3>
                  <p className="text-lg font-semibold text-white">
                    {calculateRainChance(weather.clouds.all)}%
                  </p>
                </div>
              </div>
              <div className="bg-gray-100/30 p-3 rounded-md flex items-center">
                <WiStrongWind size={32} className="text-gray-300 mr-2" />
                <div>
                  <h3 className="text-sm text-gray-200">WIND SPEED</h3>
                  <p className="text-lg font-semibold text-white">
                    {weather.wind.speed} m/s
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherApp;
