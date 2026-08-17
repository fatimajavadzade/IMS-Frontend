import api from "./axios";

export const getOrders = () => api.get("/orders");

export const getOrdersPage = (params) => api.get("/orders/page", { params });

export const getOrderById = (id) => api.get(`/orders/${id}`);

export const createOrder = (data) => api.post("/orders", data);

export const updateOrderStatus = (id, status) => api.patch(`/orders/${id}/status`, null, { params: { status } });