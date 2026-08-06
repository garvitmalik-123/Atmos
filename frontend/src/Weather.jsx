import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Droplets, Wind, Gauge, Eye, RotateCcw, CloudOff, Sunrise, Sunset } from "lucide-react";

const Weather = () => {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [hourly, setHourly] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [city, setCity] = useState("London");

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
  const CURRENT_URL = `${BACKEND_URL}/api/weather`;
  const FORECAST_URL = `${BACKEND_URL}/api/forecast`;

  const fetchCurrentWeather = async (cityName) => {
    const response = await fetch(`${CURRENT_URL}?city=${cityName}`);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Failed to fetch weather for ${cityName}`);
    }
    setCurrentWeather(await response.json());
  };

  const fetchForecast = async (cityName) => {
    const response = await fetch(`${FORECAST_URL}?city=${cityName}`);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Failed to fetch forecast for ${cityName}`);
    }
    const data = await response.json();
    setForecast(processForecastData(data.list));
    setHourly((data.list || []).slice(0, 6));
  };

  const processForecastData = (forecastList) => {
    const dailyData = {};
    forecastList.forEach((item) => {
      const date = new Date(item.dt * 1000).toDateString();
      if (!dailyData[date]) dailyData[date] = [];
      if (dailyData[date].length < 8) dailyData[date].push(item);
    });

    return Object.keys(dailyData)
      .slice(0, 5)
      .map((date) => {
        const dayData = dailyData[date];
        const temps = dayData.map((item) => item.main.temp);
        const conditions = dayData.map((item) => item.weather[0]);
        const weatherCounts = {};
        conditions.forEach((c) => (weatherCounts[c.main] = (weatherCounts[c.main] || 0) + 1));
        const mostCommon = Object.keys(weatherCounts).reduce((a, b) => (weatherCounts[a] > weatherCounts[b] ? a : b));
        const mainCondition = conditions.find((c) => c.main === mostCommon);
        const pop = Math.round(Math.max(...dayData.map((item) => (item.pop || 0) * 100)));

        return {
          date: new Date(date),
          avgTemp: Math.round(temps.reduce((a, b) => a + b, 0) / temps.length),
          maxTemp: Math.round(Math.max(...temps)),
          minTemp: Math.round(Math.min(...temps)),
          condition: mostCommon,
          description: mainCondition.description,
          icon: mainCondition.icon,
          pop,
        };
      });
  };

  const getWeatherIcon = (iconCode) => `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

  const formatDate = (date) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === tomorrow.toDateString()) return "Tomorrow";
    return date.toLocaleDateString("en-US", { weekday: "short" });
  };

  const handleCityChange = (e) => {
    if (e.key === "Enter") {
      const newCity = e.target.value.trim();
      if (newCity) {
        setCity(newCity);
        e.target.value = "";
      }
    }
  };

  useEffect(() => {
    const fetchWeatherData = async () => {
      setLoading(true);
      setError(null);
      if (!BACKEND_URL) {
        setError("Backend URL not configured. Please check your .env file.");
        setLoading(false);
        return;
      }
      try {
        await Promise.all([fetchCurrentWeather(city), fetchForecast(city)]);
      } catch (err) {
        setError(err.message || "Failed to fetch weather data");
      } finally {
        setLoading(false);
      }
    };
    fetchWeatherData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [city]);

  if (loading) {
    return (
      <div className="glass p-6 flex flex-col gap-5">
        <div className="skeleton h-9 w-full rounded-full" />
        <div className="skeleton h-28 w-full" />
        <div className="grid grid-cols-2 gap-3">
          {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-14" />)}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass flex flex-col items-center justify-center gap-3 py-14 px-6 text-center">
        <CloudOff size={30} className="text-ink-700" />
        <h3 className="text-ink-100 font-semibold">Weather Unavailable</h3>
        <p className="text-sm text-ink-500">{error}</p>
        <button onClick={() => window.location.reload()} className="btn-ghost flex items-center gap-1.5 mt-1">
          <RotateCcw size={13} /> Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="glass overflow-hidden">
      {/* Search */}
      <div className="flex items-center gap-2.5 px-5 pt-5">
        <div className="flex items-center gap-2.5 w-full bg-white/[0.03] border border-line rounded-full px-4 py-2.5 focus-within:border-brand-purple/50 transition-colors">
          <Search size={14} className="text-ink-700 shrink-0" />
          <input
            type="text"
            placeholder="Search a city, press enter"
            onKeyDown={handleCityChange}
            className="bg-transparent outline-none text-sm text-ink-100 placeholder:text-ink-700 w-full"
          />
        </div>
      </div>

      {currentWeather && (
        <div className="px-6 pt-5">
          <div className="flex items-baseline justify-between">
            <h2 className="font-display text-lg font-semibold text-ink-100">
              {currentWeather.name}, {currentWeather.sys?.country}
            </h2>
            <p className="font-mono text-[11px] text-ink-700">
              {new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
            </p>
          </div>

          <div className="flex items-center gap-4 mt-4">
            <img
              src={getWeatherIcon(currentWeather.weather[0].icon)}
              alt={currentWeather.weather[0].description}
              className="w-24 h-24 -ml-3 drop-shadow-[0_0_25px_rgba(168,85,247,0.25)]"
            />
            <div>
              <div className="font-display text-5xl font-bold text-ink-100 leading-none">
                {Math.round(currentWeather.main.temp)}
                <span className="text-2xl align-top text-ink-500">&deg;C</span>
              </div>
              <p className="text-sm text-ink-500 capitalize mt-1.5">{currentWeather.weather[0].description}</p>
              <p className="text-xs text-ink-700 mt-0.5">
                Feels like {Math.round(currentWeather.main.feels_like)}&deg;C
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-6">
            <DetailCard icon={<Droplets size={14} />} label="Humidity" value={`${currentWeather.main.humidity}%`} />
            <DetailCard icon={<Wind size={14} />} label="Wind" value={`${currentWeather.wind.speed} m/s`} />
            <DetailCard icon={<Gauge size={14} />} label="Pressure" value={`${currentWeather.main.pressure} hPa`} />
            <DetailCard icon={<Eye size={14} />} label="Visibility" value={`${(currentWeather.visibility / 1000).toFixed(1)} km`} />
          </div>

          {/* gradient progress bars */}
          <div className="flex flex-col gap-3 mt-4">
            <ProgressBar label="Humidity" value={currentWeather.main.humidity} suffix="%" />
            <ProgressBar
              label="Pressure"
              value={Math.min(100, Math.round(((currentWeather.main.pressure - 950) / 100) * 100))}
              display={`${currentWeather.main.pressure} hPa`}
            />
          </div>

          {/* sunrise / sunset */}
          {currentWeather.sys?.sunrise && currentWeather.sys?.sunset && (
            <div className="grid grid-cols-2 gap-3 mt-3">
              <DetailCard
                icon={<Sunrise size={14} className="text-amber-400" />}
                label="Sunrise"
                value={new Date(currentWeather.sys.sunrise * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              />
              <DetailCard
                icon={<Sunset size={14} className="text-orange-400" />}
                label="Sunset"
                value={new Date(currentWeather.sys.sunset * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              />
            </div>
          )}
        </div>
      )}

      {/* Hourly forecast */}
      {hourly.length > 0 && (
        <div className="mt-6 border-t border-line px-6 py-5">
          <p className="eyebrow mb-3.5">Hourly Forecast</p>
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-1">
            {hourly.map((h, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex flex-col items-center gap-1.5 shrink-0"
              >
                <span className="text-[10.5px] font-mono text-ink-700">
                  {new Date(h.dt * 1000).toLocaleTimeString([], { hour: "numeric" })}
                </span>
                <img src={getWeatherIcon(h.weather[0].icon)} alt={h.weather[0].description} className="w-8 h-8" />
                <span className="text-[12px] font-semibold text-ink-100">{Math.round(h.main.temp)}&deg;</span>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* 5-day forecast */}
      {forecast.length > 0 && (
        <div className="mt-0 border-t border-line px-6 py-5">
          <p className="eyebrow mb-3.5">7-Day Forecast</p>
          <div className="grid grid-cols-5 gap-2">
            {forecast.map((day, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="flex flex-col items-center gap-1 p-2 rounded-2xl hover:bg-white/[0.04] transition-colors"
              >
                <span className="text-[11px] font-mono text-ink-500">{formatDate(day.date)}</span>
                <img src={getWeatherIcon(day.icon)} alt={day.description} className="w-9 h-9" />
                <span className="text-[12px] font-semibold text-ink-100">{day.maxTemp}&deg;</span>
                <span className="text-[10px] text-ink-700">{day.minTemp}&deg;</span>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const ProgressBar = ({ label, value, suffix = "", display }) => (
  <div>
    <div className="flex items-center justify-between mb-1.5">
      <span className="text-[11px] text-ink-500">{label}</span>
      <span className="text-[11px] font-mono text-ink-300">{display || `${value}${suffix}`}</span>
    </div>
    <div className="h-1.5 w-full rounded-full bg-white/[0.06] overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        className="h-full rounded-full bg-brand-gradient"
      />
    </div>
  </div>
);

const DetailCard = ({ icon, label, value }) => (
  <div className="flex items-center justify-between px-3.5 py-2.5 rounded-2xl bg-white/[0.02] border border-line">
    <span className="flex items-center gap-1.5 text-[11px] text-ink-500">
      {icon} {label}
    </span>
    <span className="text-[12.5px] font-semibold text-ink-100">{value}</span>
  </div>
);

export default Weather;
