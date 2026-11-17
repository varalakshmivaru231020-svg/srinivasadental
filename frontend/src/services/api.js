import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

export const submitAppointment = (data) => api.post('/appointments', data).then((r) => r.data);
export const fetchSite = () => api.get('/site').then((r) => r.data);
export const fetchServices = () => api.get('/services').then((r) => r.data);
export const fetchContact = () => api.get('/contact').then((r) => r.data);

export default api;
