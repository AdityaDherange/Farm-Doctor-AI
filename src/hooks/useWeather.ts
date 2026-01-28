import { useState, useEffect, useCallback } from "react";

type WeatherResponse = any;

export function useWeather(latitude?: number | null, longitude?: number | null) {
  const [data, setData] = useState<WeatherResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = useCallback(async (lat?: number | null, lon?: number | null) => {
    if (lat == null || lon == null) return;
    setLoading(true);
    setError(null);
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch weather");
      const json = await res.json();
      setData(json);
    } catch (err: any) {
      setError(err?.message || "Unknown error");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (latitude != null && longitude != null) {
      fetchWeather(latitude, longitude);
    }
  }, [latitude, longitude, fetchWeather]);

  return {
    data,
    loading,
    error,
    refresh: () => fetchWeather(latitude, longitude),
  };
}
