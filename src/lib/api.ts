const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api';

export const API = {
  auth: {
    login: `${API_BASE_URL}/auth/login`,
    register: `${API_BASE_URL}/auth/register`
  },
  events: {
    list: `${API_BASE_URL}/events`,
    detail: (eventId: number) => `${API_BASE_URL}/events/${eventId}`
  },
  // Add more modules here later
};
