import React from "react";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useWeatherQuery } from "@/hooks/useWeatherQuery";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";

function formatDate(ts: number) {
  return new Date(ts * 1000).toLocaleDateString();
}

const WeatherPage: React.FC = () => {
  const { latitude, longitude, loading: geoLoading, error: geoError, requestLocation } = useGeolocation();
  const { data, isLoading, error, refetch } = useWeatherQuery(latitude, longitude) as any;

  return (
    <div className="min-h-screen bg-background pb-24">
      <Header />

      <main className="px-4 py-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">Weather & Alerts</h1>
          <div className="flex gap-2">
            <Button onClick={() => requestLocation()}>Locate</Button>
            <Button onClick={() => refetch()}>Refresh</Button>
          </div>
        </div>

        {geoLoading && <div>Getting location...</div>}
        {geoError && <div className="text-red-500">{geoError}</div>}

        {!latitude || !longitude ? (
          <div className="card-agricultural p-4">Please allow or set your location to view forecasts.</div>
        ) : isLoading ? (
          <div className="card-agricultural p-4">Loading weather…</div>
        ) : error ? (
          <div className="card-agricultural p-4 text-red-500">{String(error)}</div>
        ) : data ? (
          <div className="space-y-4">
            {/* Current */}
            <div className="card-agricultural p-4 flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground">Current</div>
                {data.provider === "openweathermap" ? (
                  <>
                    <div className="text-2xl font-bold">{Math.round(data.data.current.temp)}°C</div>
                    <div className="text-xs text-muted-foreground">{data.data.current.weather[0].description}</div>
                  </>
                ) : (
                  <>
                    <div className="text-2xl font-bold">{Math.round(data.data.current_weather.temperature)}°C</div>
                    <div className="text-xs text-muted-foreground">Code {data.data.current_weather.weathercode}</div>
                  </>
                )}
              </div>
              <div className="text-xs text-muted-foreground">
                <div>Lat: {latitude?.toFixed(3)}</div>
                <div>Lon: {longitude?.toFixed(3)}</div>
              </div>
            </div>

            {/* Alerts */}
            <div className="card-agricultural p-4">
              <div className="text-sm font-medium">Alerts</div>
              <div className="mt-2">
                {data.provider === "openweathermap" && data.data.alerts?.length ? (
                  data.data.alerts.map((a: any, i: number) => (
                    <div key={i} className="mb-2">
                      <div className="font-semibold">{a.event}</div>
                      <div className="text-xs text-muted-foreground">{a.description}</div>
                      <div className="text-xs mt-1">From {new Date(a.start * 1000).toLocaleString()} to {new Date(a.end * 1000).toLocaleString()}</div>
                    </div>
                  ))
                ) : (
                  <div className="text-xs text-muted-foreground">No active alerts</div>
                )}
              </div>
            </div>

            {/* 7-day forecast */}
            <div className="card-agricultural p-4">
              <div className="text-sm font-medium">7-day Forecast</div>
              <div className="mt-3 grid grid-cols-2 gap-3">
                {data.provider === "openweathermap"
                  ? data.data.daily.slice(0, 7).map((d: any, idx: number) => (
                      <div key={idx} className="p-3 bg-background/30 rounded">
                        <div className="font-semibold">{formatDate(d.dt)}</div>
                        <div className="text-xs">{d.weather[0].description}</div>
                        <div className="text-sm">High {Math.round(d.temp.max)}°C • Low {Math.round(d.temp.min)}°C</div>
                      </div>
                    ))
                  : data.data.daily.time.map((t: string, idx: number) => (
                      <div key={idx} className="p-3 bg-background/30 rounded">
                        <div className="font-semibold">{t}</div>
                        <div className="text-xs">Code {data.data.daily.weathercode[idx]}</div>
                        <div className="text-sm">High {Math.round(data.data.daily.temperature_2m_max[idx])}°C • Low {Math.round(data.data.daily.temperature_2m_min[idx])}°C</div>
                      </div>
                    ))}
              </div>
            </div>
          </div>
        ) : null}
      </main>

      <BottomNav />
    </div>
  );
};

export default WeatherPage;
