const API_URL = import.meta.env.VITE_API_URL || 'https://adminportal.seithithuli.com/backend/api';
const TOKEN_KEY    = 'adminportal_token';
const USERNAME_KEY = 'adminportal_username';

// Client-specific storage keys
const CLIENT_TOKEN_KEY = 'clientportal_token';
const CLIENT_NAME_KEY  = 'clientportal_name';

let unauthorizedHandler = null;
export function onUnauthorized(fn) {
  unauthorizedHandler = fn;
}

// ─── Admin session ────────────────────────────────────────────────────────────
export function getToken() { return localStorage.getItem(TOKEN_KEY); }
export function getStoredUsername() { return localStorage.getItem(USERNAME_KEY); }
function setSession(token, username) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USERNAME_KEY, username);
}
export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USERNAME_KEY);
}

// ─── Client session ───────────────────────────────────────────────────────────
export function getClientToken() { return localStorage.getItem(CLIENT_TOKEN_KEY); }
export function getStoredClientName() { return localStorage.getItem(CLIENT_NAME_KEY); }
function setClientSession(token, name) {
  localStorage.setItem(CLIENT_TOKEN_KEY, token);
  localStorage.setItem(CLIENT_NAME_KEY, name);
}
export function clearClientSession() {
  localStorage.removeItem(CLIENT_TOKEN_KEY);
  localStorage.removeItem(CLIENT_NAME_KEY);
}

// ─── Admin fetch wrapper ──────────────────────────────────────────────────────
async function request(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  let res;
  try {
    res = await fetch(`${API_URL}${path}`, { ...options, headers });
  } catch (err) {
    throw new Error('Could not reach the server. Check your connection or API URL.');
  }

  if (res.status === 401) {
    clearSession();
    if (unauthorizedHandler) unauthorizedHandler();
    throw new Error('Invalid credentials. Please log in again.');
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Something went wrong');
  return data;
}

// ─── Client fetch wrapper ─────────────────────────────────────────────────────
async function clientRequest(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  const token = getClientToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  let res;
  try {
    res = await fetch(`${API_URL}${path}`, { ...options, headers });
  } catch (err) {
    throw new Error('Could not reach the server. Check your connection or API URL.');
  }

  if (res.status === 401) {
    clearClientSession();
    throw new Error('Invalid credentials. Please log in again.');
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Something went wrong');
  return data;
}

// ─── Admin API ────────────────────────────────────────────────────────────────
export const api = {
  async login(username, password) {
    const data = await request('/login.php', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    setSession(data.token, data.username);
    return data;
  },
  async logout() {
    try { await request('/logout.php', { method: 'POST' }); } finally { clearSession(); }
  },
  listClients:  ()        => request('/clients/list.php'),
  addClient:    (payload) => request('/clients/add.php',    { method: 'POST', body: JSON.stringify(payload) }),
  deleteClient: (id)      => request('/clients/delete.php', { method: 'POST', body: JSON.stringify({ id }) }),
  listPortals:  (clientId)=> request(`/portals/list.php?client_id=${clientId}`),
  addPortal:    (payload) => request('/portals/add.php',    { method: 'POST', body: JSON.stringify(payload) }),
  deletePortal: (id)      => request('/portals/delete.php', { method: 'POST', body: JSON.stringify({ id }) }),
};

// ─── Client API ───────────────────────────────────────────────────────────────
export const clientApi = {
  async login(userid, password) {
    const data = await clientRequest('/client_login.php', {
      method: 'POST',
      body: JSON.stringify({ userid, password }),
    });
    setClientSession(data.token, data.client_name);
    return data;
  },
  async logout() {
    try { await clientRequest('/client_logout.php', { method: 'POST' }); } finally { clearClientSession(); }
  },
  getMe: () => clientRequest('/client_me.php'),
};