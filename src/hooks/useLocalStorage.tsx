import { useState, useEffect } from "react";

type StorageValue<T> = T | null;

function getStorageValue<T>(key: string, defaultValue: T): StorageValue<T> {
  if (typeof window === "undefined") {
    return defaultValue;
  }
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : defaultValue;
  } catch (error) {
    console.error(`Error reading localStorage key "${key}":`, error);
    return defaultValue;
  }
}

export function useLocalStorage<T>(
  key: string,
  defaultValue: T
): [StorageValue<T>, React.Dispatch<React.SetStateAction<StorageValue<T>>>] {
  const [value, setValue] = useState<StorageValue<T>>(() => {
    return getStorageValue(key, defaultValue);
  });

  useEffect(() => {
    if (value === null) {
      localStorage.removeItem(key);
    } else {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
      }
    }
  }, [key, value]);

  return [value, setValue];
}
