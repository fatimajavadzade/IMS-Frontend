import api from "./axios";

export const getWarehouses = () => api.get("/warehouses");

export const getWarehousesPage = (params) => api.get("/warehouses/page", { params });

export const getWarehouseById = (id) => api.get(`/warehouses/${id}`);

export const createWarehouse = (data) => api.post("/warehouses", data);

export const updateWarehouse = (id, data) => api.put(`/warehouses/${id}`, data);

export const deleteWarehouse = (id) => api.delete(`/warehouses/${id}`);

export const activateWarehouse = (id) => api.patch(`/warehouses/${id}/activate`);

export const deactivateWarehouse = (id) => api.patch(`/warehouses/${id}/deactivate`);