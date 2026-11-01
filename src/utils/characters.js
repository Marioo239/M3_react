// Utilidades puras: construir la URL y transformar datos. Sin React ni red.
const BASE_URL = 'https://rickandmortyapi.com/api/character';

export const STATUS_ES = { Alive: 'Vivo', Dead: 'Muerto', unknown: 'Desconocido' };

export function buildUrl({ name = '', status = '', page = 1 }) {
  const params = new URLSearchParams({ page });
  if (name.trim()) params.set('name', name.trim());
  if (status) params.set('status', status);
  return `${BASE_URL}?${params}`;
}

export const normalizeCharacter = (c) => ({
  id: c.id,
  name: c.name ?? 'Desconocido',
  status: c.status ?? 'unknown',
  species: c.species ?? '—',
  origin: c.origin?.name ?? 'unknown',
  image: c.image ?? '',
  episodes: Array.isArray(c.episode) ? c.episode.length : 0,
});

export const prepareCharacters = (results = []) =>
  results
    .filter((c) => c && c.id)
    .map(normalizeCharacter)
    .sort((a, b) => b.episodes - a.episodes);

export const countByStatus = (chars) =>
  chars.reduce((acc, c) => ({ ...acc, [c.status]: (acc[c.status] ?? 0) + 1 }), {});

export const totalEpisodes = (chars) => chars.reduce((sum, c) => sum + c.episodes, 0);
