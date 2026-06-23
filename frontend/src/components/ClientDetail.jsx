import { useEffect, useState } from 'react';
import { api } from '../api.js';
import AddPortalModal from './AddPortalModal.jsx';

export default function ClientDetail({ client, onBack, onClientDeleted }) {
  const [portals, setPortals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddPortal, setShowAddPortal] = useState(false);

  async function loadPortals() {
    setLoading(true);
    setError('');
    try {
      const data = await api.listPortals(client.id);
      setPortals(data.portals);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPortals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client.id]);

  async function handleDeletePortal(id) {
    if (!confirm('Remove this portal?')) return;
    try {
      await api.deletePortal(id);
      setPortals((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleDeleteClient() {
    if (!confirm(`Remove ${client.client_name}? This also removes all of their portals.`)) return;
    try {
      await api.deleteClient(client.id);
      onClientDeleted();
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <div>
      <button className="detail-back" onClick={onBack}>← Back to clients</button>

      <div className="detail-header">
        <div>
          <h2>{client.client_name}</h2>
          <span className="client-userid">{client.userid}</span>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-secondary" onClick={() => setShowAddPortal(true)}>+ Add portal</button>
          <button className="btn btn-ghost" onClick={handleDeleteClient}>Remove client</button>
        </div>
      </div>

      <p className="section-label">Portals ({portals.length})</p>

      {error && <div className="error-text">{error}</div>}

      {loading ? (
        <p style={{ color: 'var(--ink-soft)' }}>Loading…</p>
      ) : portals.length === 0 ? (
        <div className="empty-state">
          <h3>No portals yet</h3>
          <p>Add the first portal this client should have access to.</p>
        </div>
      ) : (
        <div className="portal-list">
          {portals.map((p) => (
            <span className="portal-tag" key={p.id}>
              {p.portal_name}
              <button onClick={() => handleDeletePortal(p.id)} aria-label={`Remove ${p.portal_name}`}>×</button>
            </span>
          ))}
        </div>
      )}

      {showAddPortal && (
        <AddPortalModal
          client={client}
          onClose={() => setShowAddPortal(false)}
          onCreated={() => {
            setShowAddPortal(false);
            loadPortals();
          }}
        />
      )}
    </div>
  );
}
