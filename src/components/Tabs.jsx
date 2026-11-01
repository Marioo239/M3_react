export default function Tabs({ view, favCount, onChange }) {
  const tabs = [
    { id: 'all', label: 'Todos' },
    { id: 'favs', label: `★ Favoritos (${favCount})` },
  ];
  return (
    <div className="tabs" role="tablist">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          role="tab"
          aria-selected={view === tab.id}
          className={view === tab.id ? 'active' : ''}
          onClick={() => onChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
