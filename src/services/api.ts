import axios from 'axios';
import { toast } from 'react-toastify'; // Toast kütüphanesini ekledik

// translates backend error codes
const errorDictionary: Record<string, string> = {
  "Email is already in use": "Bu e-posta adresi zaten kullanımda. Lütfen giriş yapmayı deneyin.",
  "Bad credentials": "E-posta adresiniz veya şifreniz hatalı.",
  "User not found": "Bu e-posta adresiyle kayıtlı bir hesap bulunamadı.",
  "Password is too short": "Şifreniz çok kısa, lütfen en az 8 karakter kullanın.",
  "Validation failed": "Lütfen girdiğiniz bilgileri kontrol edin.",
};

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

    if (!error.response) {
      toast.error("Sunucuya ulaşılamıyor. Lütfen bağlantınızı kontrol edin.");
      return Promise.reject(error);
    }

    const status = error.response.status;
    const backendMessage = error.response.data?.message;

    // Unauthorized
    if (status === 401) {
      toast.error("Oturumunuz sonlanmış. Lütfen giriş yapın.");

      localStorage.removeItem('memento_jwt_token');
      localStorage.removeItem('user');
      window.location.href = '/login'; 
    }
    else if (status === 400 || status === 403 || status === 404 || status === 409) {
      const userFriendlyMessage = errorDictionary[backendMessage] || backendMessage;
      toast.error(userFriendlyMessage);
    }
    else if (status === 500) {
      toast.error("Sunucu tarafında bir hata oluştu. Lütfen daha sonra tekrar deneyin.");
    }

    return Promise.reject(error);
  }
);

export default api;