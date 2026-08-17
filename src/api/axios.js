import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Token helpers
export const getToken = () => localStorage.getItem("ims-token");

export const getRefreshToken = () => localStorage.getItem("ims-refresh-token");

export const setTokens = ({ token, refreshToken }) => {
  localStorage.setItem("ims-token", token);
  localStorage.setItem("ims-refresh-token", refreshToken);
};

export const clearTokens = () => {
  localStorage.removeItem("ims-token");
  localStorage.removeItem("ims-refresh-token");
};

// Hər request-ə access token əlavə et
api.interceptors.request.use((config) => {
  const token = getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // FormData göndəriləndə Content-Type-ı browser özü təyin etsin
  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  }

  return config;
});

//! 401 olduqda refresh token ilə yeni access token al
api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      originalRequest._retry
    ) {
      return Promise.reject(error);
    }

    const refreshToken = getRefreshToken();

    if (!refreshToken) {
      clearTokens();
      window.location.href = "/login";

      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/refresh`,
        { refreshToken },
      );

      const newToken = data.token;
      const newRefreshToken = data.refreshToken;

      setTokens({
        token: newToken,
        refreshToken: newRefreshToken,
      });

      originalRequest.headers.Authorization = `Bearer ${newToken}`;

      return api(originalRequest);
    } catch (refreshError) {
      clearTokens();
      window.location.href = "/login";

      return Promise.reject(refreshError);
    }
  },
);

export default api;