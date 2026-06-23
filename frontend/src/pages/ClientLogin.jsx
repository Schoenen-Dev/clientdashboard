import { useState } from 'react';
import { clientApi } from '../api.js';

export default function ClientLogin({ onLoggedIn }) {
  const [userid, setUserid]     = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!userid || !password) {
      setError('Enter your user ID and password.');
      return;
    }
    setLoading(true);
    try {
      await clientApi.login(userid.trim(), password);
      onLoggedIn();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-screen">
      <form className="login-card" onSubmit={handleSubmit}>
        <div className="login-mark" style={{ background: 'var(--teal)' }}>CP</div>
        <h1>Client Portal</h1>
        <p className="sub">Sign in to view your portal access.</p>

        {error && <div className="error-text">{error}</div>}

        <div className="field">
          <label htmlFor="userid">User ID</label>
          <input
            id="userid"
            autoFocus
            value={userid}
            onChange={(e) => setUserid(e.target.value)}
            autoComplete="username"
            placeholder="e.g. sunrise01"
          />
        </div>

        <div className="field">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </div>

        <button className="btn btn-primary" type="submit" disabled={loading}
          style={{ background: 'var(--teal)' }}>
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}