import { STATUS_ES, countByStatus, totalEpisodes } from '../utils/characters.js';

export default function Stats({ characters }) {
  const counts = countByStatus(characters); // derivado en cada render, no guardado en estado
  return (
    <div className="stats">
      {Object.entries(counts).map(([status, n]) => (
        <span key={status} className={`chip ${status.toLowerCase()}`}>
          {STATUS_ES[status] ?? status}: {n}
        </span>
      ))}
      <span className="chip">Episodios totales: {totalEpisodes(characters)}</span>
    </div>
  );
}
