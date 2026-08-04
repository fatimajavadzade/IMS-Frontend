import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("ims-token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // FormData (məs. şəkil yükləmə) göndərilirkən "Content-Type" başlığını
  // silirik ki, brauzer özü multipart boundary ilə birlikdə düzgün təyin etsin.
  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"]; //! deqiqlesdir
  }

  return config;
});

export default api;