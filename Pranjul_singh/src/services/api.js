import axios from 'axios';

const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/$/, '');

// Ensure the URL ends with /api
const finalBaseURL = API_BASE_URL.endsWith('/api') ? API_BASE_URL : `${API_BASE_URL}/api`;

const api = axios.create({
  baseURL: finalBaseURL,
});

export const getProjects = () => api.get('/admin/projects');
export const getSkills = () => api.get('/admin/skills');
export const getHomeData = () => api.get('/admin/home');
export const getAboutData = () => api.get('/admin/about');
export const sendContactMessage = (data) => api.post('/contact', data);

export default api;
