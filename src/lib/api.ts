const API_BASE_URL = 'DNS name: CitySparkLoadBalancer-539527486.ap-southeast-1.elb.amazonaws.com/api';

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
