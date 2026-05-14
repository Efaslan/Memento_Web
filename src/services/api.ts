import axios from 'axios';
import { toast } from 'react-toastify';

// translates backend error codes
const backendResponseDictionary: Record<string, string> = {
  "EMAIL_ALREADY_EXISTS": "Bu e-posta adresi zaten kullanımda. Lütfen giriş yapmayı deneyin.",
  "REGISTRATION_SUCCESS_CHECK_EMAIL": "Kayıt başarılı! Lütfen hesabınızı etkinleştirmek için e-postanızı kontrol edin.",
  "EMAIL_NOT_VERIFIED": "Hesabınız henüz etkinleştirilmedi. Lütfen e-postanızı kontrol edin ve hesabınızı etkinleştirin.",
  "BAD_CREDENTIALS": "E-posta adresiniz veya şifreniz hatalı.",
  "USER_NOT_FOUND": "Bu e-posta adresiyle kayıtlı bir hesap bulunamadı.",
  "PASSWORD_MUST_BE_MIN_8_MAX_30_CHARACTERS": "Şifreniz çok kısa, lütfen en az 8 karakter kullanın.",
  "Your password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character.": "Şifreniz büyük harf, küçük harf, rakam ve özel karakter içermelidir.",



};

// axios instance
const api = axios.create({
  baseURL: 'https://emir-memento.me/api/v1', // Spring Boot api url
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

    if (typeof backendMessage === 'string' && backendResponseDictionary[backendMessage]) {
      // Sözlükte bu başarı/bilgi mesajı varsa direkt göster
      toast.success(backendResponseDictionary[backendMessage]);
    }

    // Unauthorized
    if (status === 401) {
      toast.error("Oturumunuz sonlanmış. Lütfen giriş yapın.");

      localStorage.removeItem('memento_jwt_token');
      localStorage.removeItem('memento_refresh_token');
      localStorage.removeItem('memento_device_id');
      localStorage.removeItem('user');
      
      window.location.href = '/login'; 
    }
    else if (status === 400 || status === 403 || status === 404 || status === 409) {
      const userFriendlyMessage = backendResponseDictionary[backendMessage] || backendMessage;
      toast.error(userFriendlyMessage);
    }
    else if (status === 429) {
      toast.error("Çok fazla deneme yaptınız. Lütfen daha sonra tekrar deneyin.");
    }
    else if (status === 500) {
      toast.error("Sunucu tarafında bir hata oluştu. Lütfen daha sonra tekrar deneyin.");
    }

    return Promise.reject(error);
  }
);

export default api;