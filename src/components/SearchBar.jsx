export default function SearchBar({ search, status, onSearchChange, onStatusChange }) {
  return (
    <form className="filters" autoComplete="off" onSubmit={(e) => e.preventDefault()}>
      <input
        type="search"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Buscar por nombre (Rick, Morty, Summer…)"
        aria-label="Buscar personaje"
      />
      <select value={status} onChange={(e) => onStatusChange(e.target.value)} aria-label="Filtrar por estado">
        <option value="">Todos los estados</option>
        <option value="alive">Vivos</option>
        <option value="dead">Muertos</option>
        <option value="unknown">Desconocidos</option>
      </select>
    </form>
  );
}
