import { useEffect, useState } from 'react';

// Como useState, pero el valor persiste en localStorage.
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : initialValue;
    } catch {
      return initialValue; // JSON corrupto o storage no disponible
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* cuota llena o modo privado: la app sigue funcionando */
    }
  }, [key, value]);

  return [value, setValue];
}
