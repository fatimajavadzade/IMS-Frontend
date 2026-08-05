import api from "./axios";

export const getTransfers = () => api.get("/transfers");

export const getTransfersPage = (params) => api.get("/transfers/page", { params });

export const getTransferById = (id) => api.get(`/transfers/${id}`);

export const createTransfer = (data) => api.post("/transfers", data);

export const updateTransferStatus = (id, data) => api.patch(`/transfers/${id}/status`, data);