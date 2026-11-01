export default function Pagination({ page, pages, onChange }) {
  return (
    <nav className="pagination">
      <button type="button" disabled={page <= 1} onClick={() => onChange(page - 1)}>← Anterior</button>
      <span>Página {page} de {pages}</span>
      <button type="button" disabled={page >= pages} onClick={() => onChange(page + 1)}>Siguiente →</button>
    </nav>
  );
}
