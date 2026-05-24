import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
  headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
});

// Auto attach token from localStorage
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auto redirect on 401
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;

// ── Auth ──
export const login    = (d)  => api.post('/login', d);
export const register = (d)  => api.post('/register', d);
export const logout   = ()   => api.post('/logout');
export const getMe    = ()   => api.get('/me');
export const updateMe = (d)  => api.put('/me', d);

// ── Fabrics ──
export const getFabrics = () => api.get('/fabrics');

// ── Measurements ──
export const getMeasurements    = ()     => api.get('/measurements');
export const saveMeasurement    = (d)    => api.post('/measurements', d);
export const updateMeasurement  = (id,d) => api.put(`/measurements/${id}`, d);

// ── Orders ──
export const getOrders    = ()     => api.get('/orders');
export const createOrder  = (d)    => api.post('/orders', d);
export const getOrder     = (id)   => api.get(`/orders/${id}`);
export const trackOrder   = (num)  => api.get(`/orders/track/${num}`);

// ── Payment ──
export const initiateSSL     = (d) => api.post('/payment/initiate', d);
export const createBkash     = (d) => api.post('/payment/bkash/create', d);
export const executeBkash    = (d) => api.post('/payment/bkash/execute', d);
