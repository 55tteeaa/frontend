export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export async function apiFetch(endpoint, options = {}) {
  const token = localStorage.getItem('campus_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'A apărut o eroare de rețea.');
  }
  return data;
}