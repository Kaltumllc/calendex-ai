const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

function getToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('calendex_token');
}

async function apiFetch(path, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });
  const data = await res.json();

  if (!res.ok) throw new Error(data.error || 'API error');
  return data;
}

export const api = {
  // Auth
  register: (body) => apiFetch('/api/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login: (body) => apiFetch('/api/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  me: () => apiFetch('/api/auth/me'),

  // Schedule
  createLink: (body) => apiFetch('/api/schedule/links', { method: 'POST', body: JSON.stringify(body) }),
  getLinks: () => apiFetch('/api/schedule/links'),
  getAvailability: (slug, date) => apiFetch(`/api/schedule/${slug}/availability?date=${date}`),
  setAvailability: (body) => apiFetch('/api/schedule/availability', { method: 'POST', body: JSON.stringify(body) }),

  // Bookings
  createBooking: (body) => apiFetch('/api/bookings', { method: 'POST', body: JSON.stringify(body) }),
  getBookings: (params = '') => apiFetch(`/api/bookings${params}`),
  cancelBooking: (id) => apiFetch(`/api/bookings/${id}/cancel`, { method: 'PATCH' }),
  rescheduleBooking: (id, body) => apiFetch(`/api/bookings/${id}/reschedule`, { method: 'PATCH', body: JSON.stringify(body) }),

  // AI
  aiChat: (body) => apiFetch('/api/ai/assistant', { method: 'POST', body: JSON.stringify(body) }),
  suggestReschedule: (body) => apiFetch('/api/ai/suggest-reschedule', { method: 'POST', body: JSON.stringify(body) }),
  summarizeMeeting: (body) => apiFetch('/api/ai/summarize', { method: 'POST', body: JSON.stringify(body) }),
};
