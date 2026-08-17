import axios from "axios";
//! bax
const TOKEN_KEY = "ims-token";
const REFRESH_TOKEN_KEY = "ims-refresh-token";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ---- Token helper-ləri (localStorage üzərindən vahid mənbə) ----

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const getRefreshToken = () => localStorage.getItem(REFRESH_TOKEN_KEY);

export const setTokens = ({ token, refreshToken } = {}) => {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  if (refreshToken) localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
};

export const clearTokens = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

// AuthContext bu hadisəni dinləyib sessiyanı təmizləyir və istifadəçini
// /login səhifəsinə yönləndirir (refresh token da etibarsız olduqda).
const emitForceLogout = () => {
  window.dispatchEvent(new CustomEvent("auth:force-logout"));
};

api.interceptors.request.use((config) => {
  const token = getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // FormData (məs. şəkil yükləmə) göndərilirkən "Content-Type" başlığını
  // silirik ki, brauzer özü multipart boundary ilə birlikdə düzgün təyin etsin.
  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  }

  return config;
});

// Eyni anda bir neçə sorğu 401 alarsa, yalnız BİR refresh sorğusu göndərilir,
// digərləri nəticəni gözləyib sonra öz orijinal sorğularını təkrarlayır.
let isRefreshing = false;
let pendingQueue = [];

const resolveQueue = (error, token = null) => {
  pendingQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token);
  });

  pendingQueue = [];
};

// Bu endpoint-lərə edilən sorğularda 401 alınsa belə refresh cəhdi edilmir
// (əks halda sonsuz dövrəyə düşərik).
const AUTH_EXEMPT_URLS = ["/auth/login", "/auth/register", "/auth/refresh"];

const isAuthExempt = (url = "") =>
  AUTH_EXEMPT_URLS.some((path) => url.includes(path));

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      !error.response ||
      error.response.status !== 401 ||
      !originalRequest ||
      isAuthExempt(originalRequest.url) ||
      originalRequest._retry
    ) {
      return Promise.reject(error);
    }

    const refreshTokenValue = getRefreshToken();

    if (!refreshTokenValue) {
      clearTokens();
      emitForceLogout();
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        pendingQueue.push({ resolve, reject });
      }).then((newToken) => {
        originalRequest._retry = true;
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      // Diqqət: burada `api` yox, təmiz `axios` istifadə olunur ki,
      // interceptor-lar bu sorğuya təsir etməsin (sonsuz dövrənin qarşısı alınır).
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/refresh`,
        { refreshToken: refreshTokenValue },
      );

      const newToken = data?.token ?? data?.accessToken;
      const newRefreshToken = data?.refreshToken ?? refreshTokenValue;

      if (!newToken) {
        throw new Error("Refresh cavabında token tapılmadı.");
      }

      setTokens({ token: newToken, refreshToken: newRefreshToken });

      resolveQueue(null, newToken);

      originalRequest.headers.Authorization = `Bearer ${newToken}`;
      return api(originalRequest);
    } catch (refreshError) {
      resolveQueue(refreshError, null);
      clearTokens();
      emitForceLogout();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

export default api;