import CharacterCard from './CharacterCard.jsx';

export default function CharacterList({ characters, favoriteIds, onToggleFavorite }) {
  return (
    <section className="grid">
      {characters.map((character) => (
        <CharacterCard
          key={character.id}
          character={character}
          isFavorite={favoriteIds.has(character.id)}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </section>
  );
}
