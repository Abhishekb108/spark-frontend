import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

export const signup = (data) => api.post('/auth/signup', data).catch(err => console.error('Signup error:', err.message));
export const login = (data) => api.post('/auth/login', data).catch(err => console.error('Login error:', err.message));
export const getProfile = () => api.get('/profile', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }).catch(err => console.error('Profile fetch error:', err.message));
export const updateProfile = (data) => api.post('/profile', data, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }).catch(err => console.error('Profile update error:', err.message));
export const getPublicProfile = (username) => api.get(`/profile/${username}`).catch(err => console.error('Public profile fetch error:', err.message));
export const getAnalytics = () => api.get('/analytics', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }).catch(err => console.error('Analytics fetch error:', err.message));
export const searchAnalytics = (params) => api.get('/analytics/search', { params, headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }).catch(err => console.error('Analytics search error:', err.message));
export const trackView = (linkId) => api.post(`/analytics/track/${linkId}`, {}, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }).catch(err => console.error('Track view error:', err.message));
export const trackClick = (linkId) => api.post(`/analytics/click/${linkId}`, {}, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }).catch(err => console.error('Track click error:', err.message));
export const searchProfiles = (params) => api.get('/profile/search', { params, headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }).catch(err => console.error('Profiles search error:', err.message));
export const updateUser = (data) => api.patch('/settings/update', data, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }).catch(err => console.error('User update error:', err.message));
export const deleteAccount = () => api.delete('/settings/delete', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }).catch(err => console.error('Account delete error:', err.message));

export default api;