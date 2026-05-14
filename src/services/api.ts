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

interface FailedRequest {
  resolve: (value: string | null) => void;
  reject: (reason?: unknown) => void;
}

// --- variables for refresh token logic ---
let isRefreshing = false;
// we're making a queue of failed requests while we're refreshing the token, so that we can retry them once we get a new token
let failedQueue: FailedRequest[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// intercepts responses from the backend to frontend. E.g. automatically send user to login page on 401 error
api.interceptors.response.use(
  (response) => response,
  async (error) => {

    if (!error.response) {
      toast.error("Sunucuya ulaşılamıyor. Lütfen bağlantınızı kontrol edin.");
      return Promise.reject(error);
    }

    const originalRequest = error.config;
    const status = error.response.status;
    const backendMessage = error.response.data?.message || error.response.data;

    if (typeof backendMessage === 'string' && backendResponseDictionary[backendMessage]) {
      // look up from the dictionary and show user-friendly message if exists
      toast.success(backendResponseDictionary[backendMessage]);
    }

    // Unauthorized
    // If 401, and the message says token has expired and this request hasn't been retried before, then try to refresh the token
      if (status === 401 && typeof backendMessage === 'string' && backendMessage.includes("Token has expired") && !originalRequest._retry) {
        
        // If already attempting a refresh, add the new requests to the queue
        if (isRefreshing) {
          return new Promise(function(resolve, reject) {
            failedQueue.push({ resolve, reject });
          }).then(token => {
            originalRequest.headers['Authorization'] = 'Bearer ' + token;
            return api(originalRequest); // retry with new token
          }).catch(err => {
            return Promise.reject(err);
          });
        }

        // if a refresh is not already in progress, start one
        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const refreshToken = localStorage.getItem('memento_refresh_token');
          if (!refreshToken) throw new Error("Refresh token bulunamadı.");

          const { data } = await axios.post('https://emir-memento.me/api/v1/auth/refresh', { refreshToken });
          
          const newJwt = data.accessJwtToken;

          // save new jwt to local storage
          localStorage.setItem('memento_jwt_token', newJwt);

          // distribute the new token to all pending requests in the queue
          processQueue(null, newJwt);

          // retry the original request with the new token
          originalRequest.headers['Authorization'] = 'Bearer ' + newJwt;
          return api(originalRequest);

        } catch (refreshError) {
          // if refresh also fails (e.g. refresh token is expired), then we need to log the user out and send them to login page
          processQueue(refreshError, null);
          
          // clear local storage and redirect to login
          localStorage.removeItem('memento_jwt_token');
          localStorage.removeItem('memento_refresh_token');
          localStorage.removeItem('memento_device_id');
          localStorage.removeItem('user');
          
          toast.error("Oturum süreniz tamamen doldu. Lütfen tekrar giriş yapın.");
          window.location.href = '/login';
          
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
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