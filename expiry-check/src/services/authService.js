/**
 * Authentication Service
 * Handles all communication with the backend auth API.
 * In development: Vite proxy forwards /api/* to the backend automatically.
 * In production: set VITE_API_BASE_URL in .env.production
 */

const BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? '').trim();

const TOKEN_KEY = 'expiry_check_token';
const USER_KEY  = 'expiry_check_user';

// ── Token helpers ────────────────────────────────────────────────

export function getToken()   { return localStorage.getItem(TOKEN_KEY); }

export function getUser() {
  try { return JSON.parse(localStorage.getItem(USER_KEY) || 'null'); }
  catch { return null; }
}

export function isLoggedIn() { return !!getToken(); }

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

// ── API calls ────────────────────────────────────────────────────

/**
 * POST /api/auth/login
 */
export async function login(email, password) {
  const url  = `${BASE_URL}/api/auth/login`;
  const body = JSON.stringify({ email: email.trim(), password });

  let res;
  try {
    res = await fetch(url, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
    });
  } catch (networkErr) {
    console.error('[AuthService] Network error:', networkErr);
    throw new Error('Cannot connect to server. Make sure the API is running on ' + BASE_URL);
  }

  let data = {};
  try { data = await res.json(); } catch { /* empty body */ }

  if (!res.ok) {
    throw new Error(data.message ?? `Login failed (${res.status})`);
  }

  localStorage.setItem(TOKEN_KEY, data.token);
  localStorage.setItem(USER_KEY,  JSON.stringify(data.user));

  return data;
}

/**
 * POST /api/auth/register
 */
export async function register(payload) {
  const url = `${BASE_URL}/api/auth/register`;

  let res;
  try {
    res = await fetch(url, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(payload),
    });
  } catch {
    throw new Error('Cannot connect to server. Make sure the API is running on ' + BASE_URL);
  }

  let data = {};
  try { data = await res.json(); } catch { /* empty */ }

  if (!res.ok) {
    throw new Error(data.message ?? `Registration failed (${res.status})`);
  }

  localStorage.setItem(TOKEN_KEY, data.token);
  localStorage.setItem(USER_KEY,  JSON.stringify(data.user));

  return data;
}

/**
 * GET /api/auth/me
 */
export async function getMe() {
  const token = getToken();
  if (!token) throw new Error('No token found.');

  const res = await fetch(`${BASE_URL}/api/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    clearSession();
    throw new Error('Session expired. Please log in again.');
  }

  const data = await res.json();
  return data.user;
}


/**
 * Logout - clear session and optionally call backend logout endpoint
 */
export async function logout() {
  // In a real app, you might want to call a backend logout endpoint
  // to invalidate the token on the server side
  clearSession();
}