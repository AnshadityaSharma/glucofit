// src/utils/storage.ts

// Save any data to localStorage
export function saveData(key: string, data: any): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving data to localStorage for key "${key}"`, error);
  }
}

// Load data from localStorage with a default fallback
export function loadData<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : defaultValue;
  } catch (error) {
    console.error(`Error loading data from localStorage for key "${key}"`, error);
    return defaultValue;
  }
}

// Remove a specific key from localStorage
export function clearData(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error clearing data from localStorage for key "${key}"`, error);
  }
}

// Clear all localStorage data (⚠️ use carefully)
export function clearAll(): void {
  try {
    localStorage.clear();
  } catch (error) {
    console.error("Error clearing all localStorage data", error);
  }
}
