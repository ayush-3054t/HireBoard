import axios from 'axios';

export const API_BASE_URL = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 
// 'http://localhost:5000'
"https://hire-board-git-main-ayushs-projects-6fd09652.vercel.app/"
;

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://hire-board-git-main-ayushs-projects-6fd09652.vercel.app/api' 
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
