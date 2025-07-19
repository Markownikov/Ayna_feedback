import axios from 'axios';

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? process.env.REACT_APP_API_URL || '/api'
  : 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
};

// Forms API
export const formsAPI = {
  // Admin routes
  createForm: (formData) => api.post('/forms', formData),
  getForms: () => api.get('/forms'),
  getForm: (id) => api.get(`/forms/${id}`),
  updateForm: (id, formData) => api.put(`/forms/${id}`, formData),
  deleteForm: (id) => api.delete(`/forms/${id}`),
  getResponses: (id) => api.get(`/forms/${id}/responses`),
  exportResponses: (id) => api.get(`/forms/${id}/export`, { responseType: 'blob' }),
  
  // Public routes
  getPublicForm: (publicUrl) => api.get(`/forms/public/${publicUrl}`),
  submitResponse: (publicUrl, responseData) => api.post(`/forms/public/${publicUrl}/submit`, responseData),
};

export default api;
