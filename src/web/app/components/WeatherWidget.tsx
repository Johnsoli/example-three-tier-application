'use client';

import { useEffect, useState } from 'react';

interface WeatherData {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  location: string;
  icon: string;
}

export default function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get user's location
        if (!navigator.geolocation) {
          throw new Error('Geolocation is not supported by your browser');
        }

        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;

            // Fetch weather data from Open-Meteo API (free, no API key required)
            const weatherResponse = await fetch(
              `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&temperature_unit=fahrenheit`
            );

            if (!weatherResponse.ok) {
              throw new Error('Failed to fetch weather data');
            }

            const data = await weatherResponse.json();
            const current = data.current;

            // Get location name from coordinates
            const geoResponse = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );

            let locationName = 'Your Location';
            if (geoResponse.ok) {
              const geoData = await geoResponse.json();
              locationName = geoData.address?.city || geoData.address?.town || 'Your Location';
            }

            // Map WMO weather codes to conditions
            const weatherConditions: { [key: number]: string } = {
              0: 'Clear',
              1: 'Mostly Clear',
              2: 'Partly Cloudy',
              3: 'Overcast',
              45: 'Foggy',
              48: 'Foggy',
              51: 'Light Drizzle',
              53: 'Moderate Drizzle',
              55: 'Heavy Drizzle',
              61: 'Slight Rain',
              63: 'Moderate Rain',
              65: 'Heavy Rain',
              71: 'Slight Snow',
              73: 'Moderate Snow',
              75: 'Heavy Snow',
              77: 'Snow Grains',
              80: 'Slight Rain Showers',
              81: 'Moderate Rain Showers',
              82: 'Violent Rain Showers',
              85: 'Slight Snow Showers',
              86: 'Heavy Snow Showers',
              95: 'Thunderstorm',
              96: 'Thunderstorm with Hail',
              99: 'Thunderstorm with Hail',
            };

            const weatherIcons: { [key: number]: string } = {
              0: '☀️',
              1: '🌤️',
              2: '⛅',
              3: '☁️',
              45: '🌫️',
              48: '🌫️',
              51: '🌦️',
              53: '🌦️',
              55: '🌧️',
              61: '🌦️',
              63: '🌧️',
              65: '⛈️',
              71: '🌨️',
              73: '🌨️',
              75: '❄️',
              77: '🌨️',
              80: '🌦️',
              81: '🌧️',
              82: '⛈️',
              85: '🌨️',
              86: '❄️',
              95: '⛈️',
              96: '⛈️',
              99: '⛈️',
            };

            setWeather({
              temperature: Math.round(current.temperature_2m),
              condition: weatherConditions[current.weather_code] || 'Unknown',
              humidity: current.relative_humidity_2m,
              windSpeed: Math.round(current.wind_speed_10m),
              location: locationName,
              icon: weatherIcons[current.weather_code] || '🌡️',
            });
          },
          (error) => {
            setError('Unable to access your location. Please enable location services.');
            console.error('Geolocation error:', error);
          }
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load weather');
        console.error('Weather fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, []);

  if (loading) {
    return (
      <div className="rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-4 mb-8">
        <div className="text-center text-zinc-500 dark:text-zinc-400">Loading weather...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-4 mb-8">
        <div className="text-center text-sm text-zinc-500 dark:text-zinc-400">{error}</div>
      </div>
    );
  }

  if (!weather) {
    return null;
  }

  return (
    <div className="rounded-lg border border-blue-200 dark:border-blue-700 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 p-4 mb-8">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
            Weather in {weather.location}
          </h2>
          <div className="flex items-center gap-3">
            <span className="text-4xl">{weather.icon}</span>
            <div>
              <div className="text-3xl font-bold text-blue-900 dark:text-blue-50">
                {weather.temperature}°F
              </div>
              <div className="text-sm text-blue-700 dark:text-blue-200">{weather.condition}</div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div className="rounded bg-white dark:bg-blue-700 px-3 py-2">
          <div className="text-xs text-zinc-500 dark:text-blue-200">Humidity</div>
          <div className="font-semibold text-zinc-900 dark:text-blue-50">{weather.humidity}%</div>
        </div>
        <div className="rounded bg-white dark:bg-blue-700 px-3 py-2">
          <div className="text-xs text-zinc-500 dark:text-blue-200">Wind Speed</div>
          <div className="font-semibold text-zinc-900 dark:text-blue-50">{weather.windSpeed} mph</div>
        </div>
      </div>
    </div>
  );
}
