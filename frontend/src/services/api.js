import axios from 'axios';

const API_BASE_URL = 'https://swapnext.onrender.com';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  withCredentials: true,
});

export { API_BASE_URL };

export const authAPI = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
  register: async (userData) => {
    const response = await api.post('/users', userData);
    return response.data;
  }
};

export const productAPI = {
  getAllProducts: async () => {
    const response = await api.get('/products');
    return response.data;
  },
  getProductById: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },
  searchByTitle: async (keyword) => {
    const response = await api.get(`/products/search/title`, { params: { keyword } });
    return response.data;
  },
  searchByCategory: async (category) => {
    const response = await api.get(`/products/search/category`, { params: { category } });
    return response.data;
  },
  uploadProduct: async (userId, formData) => {
    const response = await api.post(`/products/upload/user/${userId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },
  getProductsByUser: async (userId) => {
    const response = await api.get(`/products/user/${userId}`);
    return response.data;
  }
};

export const messageAPI = {
  getHistory: async (u1, u2) => {
    const response = await api.get('/messages/history', { params: { user1Id: u1, user2Id: u2 } });
    return response.data;
  },
  getContacts: async (userId) => {
    const response = await api.get(`/messages/contacts/${userId}`);
    return response.data;
  },
  sendMessage: async (senderId, receiverId, productId, content) => {
    const response = await api.post('/messages/send', content, {
      params: { senderId, receiverId, productId },
      headers: { 'Content-Type': 'text/plain' }
    });
    return response.data;
  }
};

export default api;
