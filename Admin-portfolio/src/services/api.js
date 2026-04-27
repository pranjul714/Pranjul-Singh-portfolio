import axios from 'axios';

const getBaseURL = () => {
  const url = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/admin';
  return url.endsWith('/api/admin') ? url : `${url.replace(/\/$/, '')}/api/admin`;
};

const api = axios.create({
  baseURL: getBaseURL(),
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const login = (credentials) => api.post('/login', credentials);
export const getContacts = () => api.get('/contacts');
export const getProjects = () => api.get('/projects');
export const createProject = (data) => api.post('/projects', data);
export const updateProject = (id, data) => api.put(`/projects/${id}`, data);
export const deleteProject = (id) => api.delete(`/projects/${id}`);
export const getSkills = () => api.get('/skills');
export const createSkill = (data) => api.post('/skills', data);
export const deleteSkill = (id) => api.delete(`/skills/${id}`);
export const getHome = () => api.get('/home');
export const updateHome = (data) => api.post('/home', data);
export const getAbout = () => api.get('/about');
export const updateAbout = (data) => api.post('/about', data);

export default api;
