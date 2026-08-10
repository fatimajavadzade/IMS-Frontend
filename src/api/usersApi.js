import api from "./axios";

export const getUsers = () => api.get("/users");

export const getManagers = () => api.get("/users/managers");