import { useEffect, useState } from 'react';
import { api } from '../api.js';
import AddClientModal from '../components/AddClientModal.jsx';
import ClientDetail from '../components/ClientDetail.jsx';

function formatDate(value) {
  try {
    return new Date(value.replace(' ', 'T')).toLocaleDateString(undefined, {
      year: 'numeric', month: 'short', day: 'numeric',
    });
  } catch {
    return value;
  }
}

export default function Dashboard({ username, onLogout }) {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddClient, setShowAddClient] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);

  async function loadClients() {
    setLoading(true);
    setError('');
    try {
      const data = await api.listClients();
      setClients(data.clients);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadClients();
  }, []);

  if (selectedClient) {
    return (
      <div className="app-shell">
        <Topbar username={username} onLogout={onLogout} />
        <div className="main">
          <ClientDetail
            client={selectedClient}
            onBack={() => {
              setSelectedClient(null);
              loadClients();
            }}
            onClientDeleted={() => {
              setSelectedClient(null);
              loadClients();
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <Topbar username={username} onLogout={onLogout} />

      <div className="main">
        <div className="main-head">
          <div>
            <h2>Clients</h2>
            <p>{clients.length} client{clients.length === 1 ? '' : 's'} with portal access</p>
          </div>
          <button className="btn btn-primary" style={{ width: 'auto' }} onClick={() => setShowAddClient(true)}>
            + Add client
          </button>
        </div>

        {error && <div className="error-text">{error}</div>}

        {loading ? (
          <p style={{ color: 'var(--ink-soft)' }}>Loading…</p>
        ) : clients.length === 0 ? (
          <div className="empty-state">
            <h3>No clients yet</h3>
            <p>Add your first client to start granting portal access.</p>
          </div>
        ) : (
          <div className="client-grid">
            {clients.map((c) => (
              <div className="client-card" key={c.id} onClick={() => setSelectedClient(c)}>
                <div className="client-card-top">
                  <div>
                    <p className="client-name">{c.client_name}</p>
                    <span className="client-userid">{c.userid}</span>
                  </div>
                  <span className="portal-count-pill">{c.portal_count} portal{c.portal_count === '1' ? '' : 's'}</span>
                </div>
                <div className="client-card-foot">
                  <span className="client-date">Added {formatDate(c.created_at)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showAddClient && (
        <AddClientModal
          onClose={() => setShowAddClient(false)}
          onCreated={() => {
            setShowAddClient(false);
            loadClients();
          }}
        />
      )}
    </div>
  );
}

function Topbar({ username, onLogout }) {
  return (
    <div className="topbar">
      <div className="topbar-brand">
        <div className="login-mark">AP</div>
        <h1>Admin Portal</h1>
      </div>
      <div className="topbar-user">
        <span>{username}</span>
        <button className="btn btn-secondary" onClick={onLogout}>Log out</button>
      </div>
    </div>
  );
}
