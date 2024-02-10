import axiosClient from "./axiosClient";

const postApi = {
  create: () => axiosClient.post("post"),
  getAll: () => axiosClient.get("post"),
  getOne: (id) => axiosClient.get(`post/${id}`),
  update: (id, params) => axiosClient.put(`post/${id}`, params),
  delete: (id) => axiosClient.delete(`post/${id}`),
};

export default postApi;
