import { getWeather, WeatherData } from './actions';

// ---------------------------------------------------------------------------
// WMO weather interpretation codes → human-readable label + emoji
// https://open-meteo.com/en/docs#weathervariables
// ---------------------------------------------------------------------------
function describeWeatherCode(code: number): { label: string; emoji: string } {
  if (code === 0) return { label: 'Clear sky', emoji: '☀️' };
  if (code === 1) return { label: 'Mainly clear', emoji: '🌤️' };
  if (code === 2) return { label: 'Partly cloudy', emoji: '⛅' };
  if (code === 3) return { label: 'Overcast', emoji: '☁️' };
  if (code >= 45 && code <= 48) return { label: 'Foggy', emoji: '🌫️' };
  if (code >= 51 && code <= 55) return { label: 'Drizzle', emoji: '🌦️' };
  if (code >= 56 && code <= 57) return { label: 'Freezing drizzle', emoji: '🌧️' };
  if (code >= 61 && code <= 65) return { label: 'Rain', emoji: '🌧️' };
  if (code >= 66 && code <= 67) return { label: 'Freezing rain', emoji: '🌨️' };
  if (code >= 71 && code <= 77) return { label: 'Snow', emoji: '❄️' };
  if (code >= 80 && code <= 82) return { label: 'Rain showers', emoji: '🌦️' };
  if (code >= 85 && code <= 86) return { label: 'Snow showers', emoji: '🌨️' };
  if (code >= 95 && code <= 99) return { label: 'Thunderstorm', emoji: '⛈️' };
  return { label: 'Unknown', emoji: '🌡️' };
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default async function WeatherWidget() {
  let weather: WeatherData | null = null;
  let error: string | null = null;

  try {
    weather = await getWeather();
  } catch {
    error = 'Weather data unavailable';
  }

  if (error || !weather) {
    return (
      <div className="rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-5 py-4 mb-8 text-sm text-zinc-400">
        {error ?? 'Loading weather…'}
      </div>
    );
  }

  const { label, emoji } = describeWeatherCode(weather.weathercode);

  return (
    <div className="rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-5 py-4 mb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
          Current Weather · London
        </span>
        <span className="text-xs text-zinc-400">
          {new Date(weather.time).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
      </div>

      {/* Main reading */}
      <div className="flex items-center gap-4">
        <span className="text-5xl" role="img" aria-label={label}>
          {emoji}
        </span>
        <div>
          <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
            {weather.temperature}°C
          </p>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">{label}</p>
        </div>
      </div>

      {/* Extra detail */}
      <div className="mt-3 flex gap-6 text-xs text-zinc-500 dark:text-zinc-400">
        <span>💨 Wind {weather.windspeed} km/h</span>
      </div>
    </div>
  );
}
