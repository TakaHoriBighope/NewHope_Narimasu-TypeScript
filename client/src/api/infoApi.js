import axiosClient from "./axiosClient";

const infoApi = {
  create: () => axiosClient.post("inform"),
  getAll: () => axiosClient.get("inform"),
  getOne: (id) => axiosClient.get(`inform/${id}`),
  update: (id, params) => axiosClient.put(`inform/${id}`, params),
  delete: (id) => axiosClient.delete(`inform/${id}`),
};

export default infoApi;
