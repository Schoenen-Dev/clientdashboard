import { useState } from 'react';
import Modal from './Modal.jsx';
import { api } from '../api.js';

export default function AddClientModal({ onClose, onCreated }) {
  const [clientName, setClientName] = useState('');
  const [userid, setUserid] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!clientName.trim() || !userid.trim() || !password) {
      setError('All fields are required.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setSaving(true);
    try {
      await api.addClient({
        client_name: clientName.trim(),
        userid: userid.trim(),
        password,
      });
      onCreated();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal title="Add a client" subtitle="Create the login you'll hand off to this client." onClose={onClose}>
      <form onSubmit={handleSubmit}>
        {error && <div className="error-text">{error}</div>}

        <div className="field">
          <label htmlFor="client_name">Client name</label>
          <input id="client_name" autoFocus value={clientName} onChange={(e) => setClientName(e.target.value)} placeholder="e.g. Sunrise Traders" />
        </div>

        <div className="field">
          <label htmlFor="userid">User ID</label>
          <input id="userid" value={userid} onChange={(e) => setUserid(e.target.value)} placeholder="e.g. sunrise01" />
        </div>

        <div className="field">
          <label htmlFor="client_password">Password</label>
          <input id="client_password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 6 characters" />
        </div>

        <div className="modal-actions">
          <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={saving} style={{ width: 'auto' }}>
            {saving ? 'Adding…' : 'Add client'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
