import axios from 'axios';

// axios instance
const api = axios.create({
  baseURL: 'http://localhost:8080/api/v1', // Spring Boot api url
  headers: {
    'Content-Type': 'application/json',
  },
});

// intercepts all request from the frontend to backend
api.interceptors.request.use(
  (config) => {

    const token = localStorage.getItem('memento_jwt_token');

    // add JWT to all requests
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// intercepts responses from the backend to frontend. E.g. automatically send user to login page on 401 error
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // global error handling with toast messages
    return Promise.reject(error);
  }
);

export default api;