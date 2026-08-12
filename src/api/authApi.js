import api from "./axios";

export const register = (data) => api.post("/auth/register", data);

export const login = (data) => api.post("/auth/login", data);

// Qeyd: bu axios.js daxilindəki interceptor-da çağırılır.
export const refreshToken = (data) => api.post("/auth/refresh", data);

export const updatePassword = (data) => api.post("/auth/password-update", data);

export const logout = (data) => api.post("/auth/logout", data);