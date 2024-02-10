import authApi from "../api/authApi";

const authUtils = {
  //JWTチェック
  isAuthenticated: async () => {
    const token = localStorage.getItem("token");
    // console.log(`authUtils + ${token}`);
    if (!token) return false;

    try {
      const res = await authApi.verifyToken();
      // console.log(`veruifyToken + ${res.token}`);
      return res.user;
    } catch (error) {
      // console.log(error.data);
      return false;
    }
  },
};
export default authUtils;
