// Offline storage utilities using localStorage

const DIAGNOSIS_CACHE_KEY = 'crop_doctor_diagnosis_cache';
const CALENDAR_CACHE_KEY = 'crop_doctor_calendar_cache';
const WEATHER_CACHE_KEY = 'crop_doctor_weather_cache';

export interface CachedDiagnosis {
  id: string;
  crop_name: string;
  diagnosis: string;
  image_url: string | null;
  created_at: string;
  language: string;
}

// Diagnosis history caching
export const cacheDiagnosisHistory = (data: CachedDiagnosis[]) => {
  try {
    localStorage.setItem(DIAGNOSIS_CACHE_KEY, JSON.stringify({
      data,
      timestamp: Date.now(),
    }));
  } catch (e) {
    console.warn('Failed to cache diagnosis history:', e);
  }
};

export const getCachedDiagnosisHistory = (): CachedDiagnosis[] | null => {
  try {
    const raw = localStorage.getItem(DIAGNOSIS_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    // Cache valid for 7 days
    if (Date.now() - parsed.timestamp > 7 * 24 * 60 * 60 * 1000) return null;
    return parsed.data;
  } catch {
    return null;
  }
};

// Calendar data caching
export const cacheCalendarData = (cropId: string, data: any) => {
  try {
    const existing = JSON.parse(localStorage.getItem(CALENDAR_CACHE_KEY) || '{}');
    existing[cropId] = { data, timestamp: Date.now() };
    localStorage.setItem(CALENDAR_CACHE_KEY, JSON.stringify(existing));
  } catch (e) {
    console.warn('Failed to cache calendar data:', e);
  }
};

export const getCachedCalendarData = (cropId: string): any | null => {
  try {
    const raw = localStorage.getItem(CALENDAR_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    const entry = parsed[cropId];
    if (!entry || Date.now() - entry.timestamp > 7 * 24 * 60 * 60 * 1000) return null;
    return entry.data;
  } catch {
    return null;
  }
};

// Weather data caching
export const cacheWeatherData = (region: string, data: any) => {
  try {
    const existing = JSON.parse(localStorage.getItem(WEATHER_CACHE_KEY) || '{}');
    existing[region] = { data, timestamp: Date.now() };
    localStorage.setItem(WEATHER_CACHE_KEY, JSON.stringify(existing));
  } catch (e) {
    console.warn('Failed to cache weather data:', e);
  }
};

export const getCachedWeatherData = (region: string): any | null => {
  try {
    const raw = localStorage.getItem(WEATHER_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    const entry = parsed[region];
    // Weather cache valid for 3 hours
    if (!entry || Date.now() - entry.timestamp > 3 * 60 * 60 * 1000) return null;
    return entry.data;
  } catch {
    return null;
  }
};

// Check if user is online
export const isOnline = (): boolean => navigator.onLine;

// Listen for online/offline events
export const onConnectivityChange = (callback: (online: boolean) => void) => {
  const onlineHandler = () => callback(true);
  const offlineHandler = () => callback(false);
  window.addEventListener('online', onlineHandler);
  window.addEventListener('offline', offlineHandler);
  return () => {
    window.removeEventListener('online', onlineHandler);
    window.removeEventListener('offline', offlineHandler);
  };
};
