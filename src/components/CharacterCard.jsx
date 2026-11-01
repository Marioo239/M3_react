import { STATUS_ES } from '../utils/characters.js';

export default function CharacterCard({ character, isFavorite, onToggleFavorite }) {
  const { name, status, species, origin, image, episodes } = character;
  return (
    <article className={`card ${status.toLowerCase()}`}>
      <button
        type="button"
        className={`fav-btn ${isFavorite ? 'active' : ''}`}
        aria-pressed={isFavorite}
        aria-label={isFavorite ? `Quitar a ${name} de favoritos` : `Añadir a ${name} a favoritos`}
        onClick={() => onToggleFavorite(character)}
      >
        {isFavorite ? '★' : '☆'}
      </button>
      <img src={image} alt={name} loading="lazy" />
      <div className="info">
        <h2>{name}</h2>
        <span className={`badge ${status.toLowerCase()}`}>{STATUS_ES[status] ?? status}</span>
        <p>{species} · {origin}</p>
        <p className="eps">📺 {episodes} episodios</p>
      </div>
    </article>
  );
}
