import api from "./axios";

export const getReportOverview = (params) => api.get("/reports/overview", { params });

export const exportReport = (params) => api.get("/reports/export", { params, responseType: "blob" });