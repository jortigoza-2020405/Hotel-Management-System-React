import { auth } from '../firebase.js';

export async function fetchWithAuth(url, options = {}) {
  const token = await auth.currentUser.getIdToken();
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'API error');
  }
  return res.json();
}
