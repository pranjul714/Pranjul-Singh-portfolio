import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const getProjects = () => api.get('/admin/projects');
export const getSkills = () => api.get('/admin/skills');
export const getHomeData = () => api.get('/admin/home');
export const getAboutData = () => api.get('/admin/about');
export const sendContactMessage = (data) => api.post('/contact', data);

export default api;
