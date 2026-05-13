import axios from 'axios';

// Strip trailing slash for consistency
// VITE_API_URL should be set to your full backend URL e.g. https://your-backend.onrender.com
const BASE = (import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5000' : 'https://pranjul-singh-portfolio-1.onrender.com')).replace(/\/$/, '');

const api = axios.create({
  baseURL: `${BASE}/api`,
  timeout: 10000,
});

export const getProjects = () => api.get('/admin/projects');
export const getSkills = () => api.get('/admin/skills');
export const getHomeData = () => api.get('/admin/home');
export const getAboutData = () => api.get('/admin/about');
export const sendContactMessage = (data) => api.post('/contact', data);

export default api;
