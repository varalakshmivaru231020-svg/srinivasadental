import axios from 'axios';

const base = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '');

const adminApi = axios.create({
  baseURL: `${base}/admin`,
  timeout: 20000,
  withCredentials: true,
  headers: { 'X-Requested-With': 'SDC-Admin' },
});

// When the session expires, tell the app so it can show the login screen.
adminApi.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && !err.config.url.endsWith('/login')) {
      window.dispatchEvent(new Event('sdc-admin-unauthorized'));
    }
    return Promise.reject(err);
  },
);

const data = (p) => p.then((r) => r.data);

export const login = (username, password) => data(adminApi.post('/login', { username, password }));
export const logout = () => data(adminApi.post('/logout'));
export const me = () => data(adminApi.get('/me'));
export const changePassword = (body) => data(adminApi.put('/password', body));

export const getDashboard = () => data(adminApi.get('/dashboard'));

export const getAppointments = (params) => data(adminApi.get('/appointments', { params }));
export const setAppointmentStatus = (id, status) => data(adminApi.patch(`/appointments/${id}`, { status }));
export const deleteAppointment = (id) => data(adminApi.delete(`/appointments/${id}`));

export const getServices = () => data(adminApi.get('/services'));
export const getService = (id) => data(adminApi.get(`/services/${id}`));
export const createService = (body) => data(adminApi.post('/services', body));
export const updateService = (id, body) => data(adminApi.put(`/services/${id}`, body));
export const deleteService = (id) => data(adminApi.delete(`/services/${id}`));

export const getTestimonials = () => data(adminApi.get('/testimonials'));
export const createTestimonial = (body) => data(adminApi.post('/testimonials', body));
export const updateTestimonial = (id, body) => data(adminApi.put(`/testimonials/${id}`, body));
export const deleteTestimonial = (id) => data(adminApi.delete(`/testimonials/${id}`));

export const getDoctors = () => data(adminApi.get('/doctors'));
export const getDoctor = (id) => data(adminApi.get(`/doctors/${id}`));
export const createDoctor = (body) => data(adminApi.post('/doctors', body));
export const updateDoctor = (id, body) => data(adminApi.put(`/doctors/${id}`, body));
export const deleteDoctor = (id) => data(adminApi.delete(`/doctors/${id}`));

export const getGallery = () => data(adminApi.get('/gallery'));
export const getGalleryPhoto = (id) => data(adminApi.get(`/gallery/${id}`));
export const createGalleryPhoto = (body) => data(adminApi.post('/gallery', body));
export const updateGalleryPhoto = (id, body) => data(adminApi.put(`/gallery/${id}`, body));
export const deleteGalleryPhoto = (id) => data(adminApi.delete(`/gallery/${id}`));

export const getBanners = () => data(adminApi.get('/banners'));
export const saveBanner = (key, body) => data(adminApi.put(`/banners/${key}`, body));
export const resetBanner = (key) => data(adminApi.delete(`/banners/${key}`));

export const getSettings = () => data(adminApi.get('/settings'));
export const saveSettings = (body) => data(adminApi.put('/settings', body));

export const uploadImage = (file) => {
  const form = new FormData();
  form.append('file', file);
  return data(adminApi.post('/upload', form));
};

/** Turns an API error into { message, fields } for display. */
export function readError(err, fallback = 'Something went wrong. Please try again.') {
  const res = err?.response?.data;
  const fields = {};
  (res?.errors || []).forEach((e) => { if (!fields[e.path]) fields[e.path] = e.msg; });
  if (!err?.response) return { message: 'Cannot reach the server. Is the website running?', fields };
  return { message: res?.message || fallback, fields };
}
