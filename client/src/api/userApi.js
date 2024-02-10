import axiosClient from "./axiosClient";

const userApi = {
  create: () => axiosClient.post("users"),
  getAll: () => axiosClient.get("users"),
  getOne: (id) => axiosClient.get(`users/${id}`),
  update: (id, params) => axiosClient.put(`users/${id}`, params),
  delete: (id) => axiosClient.delete(`users/${id}`),
};

export default userApi;
