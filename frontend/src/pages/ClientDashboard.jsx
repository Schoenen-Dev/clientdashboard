import { useEffect, useState } from 'react';
import { clientApi } from '../api.js';

function formatDate(value) {
  try {
    return new Date(value.replace(' ', 'T')).toLocaleDateString(undefined, {
      year: 'numeric', month: 'short', day: 'numeric',
    });
  } catch {
    return value;
  }
}

export default function ClientDashboard({ onLogout }) {
  const [client, setClient]   = useState(null);
  const [portals, setPortals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  useEffect(() => {
    async function load() {
      try {
        const data = await clientApi.getMe();
        setClient(data.client);
        setPortals(data.portals);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function handleLogout() {
    try { await clientApi.logout(); } catch { /* ignore */ }
    onLogout();
  }

  if (loading) {
    return (
      <div className="app-shell">
        <ClientTopbar name="" onLogout={handleLogout} />
        <div className="main"><p style={{ color: 'var(--ink-soft)' }}>Loading…</p></div>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <ClientTopbar name={client?.client_name || ''} onLogout={handleLogout} />

      <div className="main">
        {error && <div className="error-text">{error}</div>}

        {/* Client info card */}
        {client && (
          <div className="client-info-card">
            <div className="client-info-row">
              <div className="client-info-avatar">
                {client.client_name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="client-name" style={{ fontSize: 20 }}>{client.client_name}</p>
                <span className="client-userid">{client.userid}</span>
              </div>
            </div>
            <p className="client-date" style={{ marginTop: 10 }}>
              Member since {formatDate(client.created_at)}
            </p>
          </div>
        )}

        {/* Portals section */}
        <div style={{ marginTop: 32 }}>
          <p className="section-label">Your Portals ({portals.length})</p>

          {portals.length === 0 ? (
            <div className="empty-state">
              <h3>No portals assigned</h3>
              <p>Contact your administrator to get access to a portal.</p>
            </div>
          ) : (
            <div className="portal-cards-grid">
              {portals.map((p) => (
                <div className="portal-card" key={p.id}>
                  <div className="portal-card-icon">🔗</div>
                  <div style={{ flex: 1 }}>
                    <p className="portal-card-name">{p.portal_name}</p>
                    <p className="portal-card-date">Added {formatDate(p.created_at)}</p>
                  </div>
                  {p.portal_url && (
                    <a
                      href={p.portal_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary portal-open-btn"
                    >
                      Open →
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ClientTopbar({ name, onLogout }) {
  return (
    <div className="topbar">
      <div className="topbar-brand">
        <div className="login-mark" style={{ background: 'var(--teal)', marginBottom: 0, width: 36, height: 36, fontSize: 15 }}>CP</div>
        <h1>Client Portal</h1>
      </div>
      <div className="topbar-user">
        {name && <span>{name}</span>}
        <button className="btn btn-secondary" onClick={onLogout}>Log out</button>
      </div>
    </div>
  );
}