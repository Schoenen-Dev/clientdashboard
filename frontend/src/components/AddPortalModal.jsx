import { useState } from 'react';
import Modal from './Modal.jsx';
import { api } from '../api.js';

export default function AddPortalModal({ client, onClose, onCreated }) {
  const [portalName, setPortalName] = useState('');
  const [portalUrl, setPortalUrl]   = useState('');
  const [error, setError]           = useState('');
  const [saving, setSaving]         = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!portalName.trim()) { setError('Portal name is required.'); return; }
    if (!portalUrl.trim())  { setError('Portal URL is required.'); return; }

    setSaving(true);
    try {
      await api.addPortal({
        client_id:   client.id,
        portal_name: portalName.trim(),
        portal_url:  portalUrl.trim(),
      });
      onCreated();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal
      title="Add a portal"
      subtitle={`Give ${client.client_name} access to another portal.`}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit}>
        {error && <div className="error-text">{error}</div>}

        <div className="field">
          <label htmlFor="portal_name">Portal name</label>
          <input
            id="portal_name"
            autoFocus
            value={portalName}
            onChange={(e) => setPortalName(e.target.value)}
            placeholder="e.g. Billing Portal"
          />
        </div>

        <div className="field">
          <label htmlFor="portal_url">Portal URL</label>
          <input
            id="portal_url"
            type="url"
            value={portalUrl}
            onChange={(e) => setPortalUrl(e.target.value)}
            placeholder="https://websocket.seithithuli.com/index.php"
          />
        </div>

        <div className="modal-actions">
          <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={saving} style={{ width: 'auto' }}>
            {saving ? 'Adding…' : 'Add portal'}
          </button>
        </div>
      </form>
    </Modal>
  );
}