import React from "react";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useWeather } from "@/hooks/useWeather";

function weatherCodeToLabel(code: number) {
  // simplified mapping for common conditions
  if (code === 0) return "Clear";
  if (code === 1 || code === 2 || code === 3) return "Partly Cloudy";
  if (code >= 51 && code <= 67) return "Drizzle";
  if (code >= 80 && code <= 82) return "Rain";
  if (code >= 71 && code <= 77) return "Snow";
  if (code >= 95) return "Thunderstorm";
  return "Unknown";
}

export const Weather: React.FC = () => {
  const { latitude, longitude, loading: geoLoading, error: geoError, requestLocation } = useGeolocation();
  const { data, loading, error, refresh } = useWeather(latitude, longitude);

  return (
    <div className="card-agricultural p-4">
      <div className="flex justify-between items-start">
        <div>
          <div className="text-sm font-medium">Local Weather</div>
          {geoLoading ? (
            <div className="text-xs text-muted-foreground">Getting location…</div>
          ) : geoError ? (
            <div className="text-xs text-red-500">{geoError}</div>
          ) : latitude && longitude ? (
            <div className="mt-1">
              {loading ? (
                <div className="text-xs text-muted-foreground">Loading weather…</div>
              ) : error ? (
                <div className="text-xs text-red-500">{error}</div>
              ) : data ? (
                <div className="flex items-center gap-4">
                  <div>
                    <div className="text-2xl font-bold">
                      {Math.round(data.current_weather.temperature)}°C
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {weatherCodeToLabel(data.current_weather.weathercode)} • Wind {Math.round(data.current_weather.windspeed)} km/h
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    <div>High {Math.round(data.daily.temperature_2m_max[0])}°C</div>
                    <div>Low {Math.round(data.daily.temperature_2m_min[0])}°C</div>
                  </div>
                </div>
              ) : (
                <div className="text-xs text-muted-foreground">No data</div>
              )}
            </div>
          ) : (
            <div className="mt-1 text-xs text-muted-foreground">Location not set</div>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <button className="btn btn-ghost text-xs" onClick={() => requestLocation()}>
            Locate
          </button>
          <button className="btn btn-ghost text-xs" onClick={() => refresh()}>
            Refresh
          </button>
        </div>
      </div>
    </div>
  );
};

export default Weather;
