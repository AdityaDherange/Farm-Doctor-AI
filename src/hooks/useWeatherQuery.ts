import { useQuery } from "@tanstack/react-query";

type WeatherProvider = "open-meteo" | "openweathermap";

const OPENWEATHER_KEY = (import.meta as any).env?.VITE_OPENWEATHERMAP_API_KEY as string | undefined;

async function fetchOpenMeteo(lat: number, lon: number) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Open-Meteo fetch failed");
  return res.json();
}

async function fetchOpenWeatherMap(lat: number, lon: number) {
  if (!OPENWEATHER_KEY) throw new Error("OpenWeatherMap API key missing");
  const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely&units=metric&appid=${OPENWEATHER_KEY}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("OpenWeatherMap fetch failed");
  return res.json();
}

export function useWeatherQuery(lat?: number | null, lon?: number | null) {
  const provider: WeatherProvider = OPENWEATHER_KEY ? "openweathermap" : "open-meteo";

  return useQuery(
    ["weather", provider, lat, lon],
    async () => {
      if (lat == null || lon == null) throw new Error("Missing coordinates");
      if (provider === "openweathermap") {
        const data = await fetchOpenWeatherMap(lat, lon);
        return { provider, data };
      }
      const data = await fetchOpenMeteo(lat, lon);
      return { provider, data };
    },
    {
      enabled: lat != null && lon != null,
      retry: 2,
      staleTime: 1000 * 60 * 10, // 10 minutes
      cacheTime: 1000 * 60 * 30, // 30 minutes
    }
  );
}
