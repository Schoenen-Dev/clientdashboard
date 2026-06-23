import { useEffect, useState } from 'react';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import ClientLogin from './pages/ClientLogin.jsx';
import ClientDashboard from './pages/ClientDashboard.jsx';
import {
  getToken, getStoredUsername, clearSession, onUnauthorized, api,
  getClientToken, clearClientSession,
} from './api.js';

// Detect which portal to show based on URL path
// /client  → client login/dashboard
// /        → admin login/dashboard
const isClientPortal = window.location.pathname.startsWith('/client');

export default function App() {
  // ── Admin state ──
  const [authed, setAuthed]       = useState(!!getToken());
  const [username, setUsername]   = useState(getStoredUsername() || '');

  // ── Client state ──
  const [clientAuthed, setClientAuthed] = useState(!!getClientToken());

  useEffect(() => {
    onUnauthorized(() => setAuthed(false));
  }, []);

  // ── Admin handlers ──
  function handleLoggedIn() {
    setUsername(getStoredUsername() || '');
    setAuthed(true);
  }
  async function handleLogout() {
    try { await api.logout(); } catch { clearSession(); }
    setAuthed(false);
  }

  // ── Client handlers ──
  function handleClientLoggedIn() { setClientAuthed(true); }
  function handleClientLogout() {
    clearClientSession();
    setClientAuthed(false);
  }

  // ── Render client portal ──
  if (isClientPortal) {
    if (!clientAuthed) return <ClientLogin onLoggedIn={handleClientLoggedIn} />;
    return <ClientDashboard onLogout={handleClientLogout} />;
  }

  // ── Render admin portal ──
  if (!authed) return <Login onLoggedIn={handleLoggedIn} />;
  return <Dashboard username={username} onLogout={handleLogout} />;
}