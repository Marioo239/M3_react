import { useState } from 'react';
import { useFetch } from './hooks/useFetch.js';
import { useDebounce } from './hooks/useDebounce.js';
import { useLocalStorage } from './hooks/useLocalStorage.js';
import { buildUrl, prepareCharacters } from './utils/characters.js';
import SearchBar from './components/SearchBar.jsx';
import Tabs from './components/Tabs.jsx';
import Stats from './components/Stats.jsx';
import CharacterList from './components/CharacterList.jsx';
import Pagination from './components/Pagination.jsx';
import StatusMessage from './components/StatusMessage.jsx';

export default function App() {
  // Estado mínimo: lo demás se deriva en cada render.
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [view, setView] = useState('all');
  const [favorites, setFavorites] = useLocalStorage('rm-favorites', []);

  const debouncedSearch = useDebounce(search, 400);
  const url = view === 'all' ? buildUrl({ name: debouncedSearch, status, page }) : null;
  const { data, loading, error, retry } = useFetch(url);

  // Valores derivados
  const characters = view === 'all'
    ? prepareCharacters(Array.isArray(data?.results) ? data.results : [])
    : favorites;
  const pages = data?.info?.pages ?? 0;
  const favoriteIds = new Set(favorites.map((f) => f.id));
  const ready = !loading && !error;
  const emptyText = view === 'all'
    ? `Ningún personaje encontrado${debouncedSearch ? ` para "${debouncedSearch}"` : ''}.`
    : 'Aún no tienes favoritos. Pulsa ☆ en un personaje para guardarlo en tu expediente.';

  const handleSearch = (value) => { setSearch(value); setPage(1); };
  const handleStatus = (value) => { setStatus(value); setPage(1); };
  const handlePage = (next) => { setPage(next); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const toggleFavorite = (character) =>
    setFavorites((prev) =>
      prev.some((f) => f.id === character.id)
        ? prev.filter((f) => f.id !== character.id)
        : [...prev, character]
    );

  return (
    <>
      <header className="hero">
        <h1>Multiverse <span>Dossier</span></h1>
        <p>Archivo clasificado de habitantes del multiverso</p>
        {view === 'all' && (
          <SearchBar search={search} status={status} onSearchChange={handleSearch} onStatusChange={handleStatus} />
        )}
      </header>
      <main>
        <Tabs view={view} favCount={favorites.length} onChange={setView} />
        {loading && <StatusMessage type="loading" />}
        {error && <StatusMessage type="error" message={error} onRetry={retry} />}
        {ready && characters.length === 0 && <StatusMessage type="empty" message={emptyText} />}
        {ready && characters.length > 0 && (
          <>
            <Stats characters={characters} />
            <CharacterList characters={characters} favoriteIds={favoriteIds} onToggleFavorite={toggleFavorite} />
          </>
        )}
        {view === 'all' && ready && pages > 0 && <Pagination page={page} pages={pages} onChange={handlePage} />}
      </main>
      <footer>
        Datos de <a href="https://rickandmortyapi.com" target="_blank" rel="noopener">The Rick and Morty API</a>
      </footer>
    </>
  );
}
