import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://192.168.1.100:5000/api'; // Change IP to your backend

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth APIs
export const register = (username, email, password, fullName) =>
  api.post('/auth/register', { username, email, password, fullName });

export const login = (email, password) =>
  api.post('/auth/login', { email, password });

export const getCurrentUser = () => api.get('/auth/me');

// Post APIs
export const uploadPost = (formData) =>
  api.post('/posts/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const getFeed = () => api.get('/posts/feed');

export const likePost = (postId) => api.put(`/posts/${postId}/like`);

export const addComment = (postId, text) =>
  api.post(`/posts/${postId}/comment`, { text });

export const deletePost = (postId) => api.delete(`/posts/${postId}`);

// User APIs
export const getUserProfile = (userId) => api.get(`/users/${userId}`);

export const followUser = (userId) => api.put(`/users/${userId}/follow`);

export const updateProfile = (bio, fullName) =>
  api.put('/users/profile/update', { bio, fullName });

export const getUserEarnings = () => api.get('/users/earnings/my-earnings');

// Payment APIs
export const requestWithdrawal = (amount) =>
  api.post('/payment/withdrawal/request', { amount });

export const getWalletBalance = () => api.get('/payment/wallet/balance');

export const getTransactionHistory = () => api.get('/payment/transactions/history');

// Message APIs
export const sendMessage = (receiverId, text) =>
  api.post('/messages/send', { receiverId, text });

export const getConversation = (userId) => api.get(`/messages/conversation/${userId}`);

export default api;
