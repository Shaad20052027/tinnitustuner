import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('tt_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const registerUser  = (data) => api.post('/auth/register', data);
export const loginUser     = (data) => api.post('/auth/login', data);
export const analyzeSound  = (description) => api.post('/analyze', { description });
export const getProfiles   = () => api.get('/profiles');
export const saveProfile   = (data) => api.post('/profiles', data);
export const updateProfile = (id, data) => api.put(`/profiles/${id}`, data);
export const deleteProfile = (id) => api.delete(`/profiles/${id}`);
