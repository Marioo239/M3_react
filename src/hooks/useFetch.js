import { useCallback, useEffect, useState } from 'react';

// Hook reutilizable: pide una URL (o nada si es null) y devuelve { data, loading, error, retry }.
// Un 404 se considera "sin resultados" (data = null), no un error.
export function useFetch(url) {
  const [state, setState] = useState({ data: null, loading: Boolean(url), error: null });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!url) {
      setState({ data: null, loading: false, error: null });
      return;
    }
    const controller = new AbortController();
    setState((prev) => ({ ...prev, loading: true, error: null }));

    (async () => {
      try {
        const response = await fetch(url, { signal: controller.signal });
        if (response.status === 404) {
          setState({ data: null, loading: false, error: null });
          return;
        }
        if (!response.ok) throw new Error(`El servidor respondió con error ${response.status}.`);
        const data = await response.json();
        setState({ data, loading: false, error: null });
      } catch (err) {
        if (err.name === 'AbortError') return; // petición cancelada por el cleanup
        const message = err instanceof TypeError ? 'No se pudo conectar con la API. Revisa tu conexión.' : err.message;
        setState({ data: null, loading: false, error: message });
      }
    })();

    return () => controller.abort();
  }, [url, attempt]);

  const retry = useCallback(() => setAttempt((n) => n + 1), []);
  return { ...state, retry };
}
