'use server';

import { revalidatePath } from 'next/cache';

const API_URL = process.env.API_URL || 'http://localhost:3001';

// ---------------------------------------------------------------------------
// Weather
// ---------------------------------------------------------------------------

export type WeatherData = {
  temperature: number;       // °C
  windspeed: number;         // km/h
  weathercode: number;       // WMO weather interpretation code
  time: string;              // ISO datetime of the observation
};

/**
 * Fetch current weather for the given coordinates using the Open-Meteo API.
 * Defaults to London (51.51°N, -0.13°E) when no coordinates are supplied.
 * Open-Meteo is free and requires no API key.
 */
export async function getWeather(
  latitude = 51.51,
  longitude = -0.13,
): Promise<WeatherData> {
  const url =
    `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${latitude}&longitude=${longitude}` +
    `&current_weather=true`;

  const res = await fetch(url, {
    // Revalidate every 10 minutes so the page stays reasonably fresh.
    next: { revalidate: 600 },
  });

  if (!res.ok) throw new Error('Failed to fetch weather data');

  const json = await res.json();
  const cw = json.current_weather as {
    temperature: number;
    windspeed: number;
    weathercode: number;
    time: string;
  };

  return {
    temperature: cw.temperature,
    windspeed: cw.windspeed,
    weathercode: cw.weathercode,
    time: cw.time,
  };
}

export type Task = {
  id: number;
  title: string;
  completed: boolean;
  created_at: string;
};

export async function getTasks(): Promise<Task[]> {
  const res = await fetch(`${API_URL}/tasks`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch tasks');
  return res.json();
}

export async function createTask(formData: FormData) {
  const title = formData.get('title') as string;
  await fetch(`${API_URL}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title }),
  });
  revalidatePath('/');
}

export async function toggleTask(id: number, completed: boolean) {
  await fetch(`${API_URL}/tasks/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ completed }),
  });
  revalidatePath('/');
}
