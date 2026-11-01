export default function StatusMessage({ type, message, onRetry }) {
  if (type === 'loading') {
    return (
      <div className="state" role="status">
        <div className="portal" />
        <p>Abriendo portal…</p>
      </div>
    );
  }
  if (type === 'error') {
    return (
      <div className="state error" role="alert">
        <p>💥 {message}</p>
        <button type="button" onClick={onRetry}>Reintentar</button>
      </div>
    );
  }
  return (
    <div className="state">
      <p>🛸 {message}</p>
    </div>
  );
}
