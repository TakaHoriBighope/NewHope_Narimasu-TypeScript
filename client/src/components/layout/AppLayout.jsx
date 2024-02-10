import { Box } from "@mui/material";
import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import authUtils from "../../utils/authUtils";
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/features/userSlice";

const AppLayout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    //JWTを持っているのか確認する
    const checkAuth = async () => {
      //ページ切り替える度に認証チェック(トークン持ってるかどうか確認)
      const user = await authUtils.isAuthenticated();
      // console.log(user);
      if (!user) {
        navigate("/login");
      } else {
        //ユーザーを保存する
        dispatch(setUser(user));
      }
    };
    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  return (
    <div>
      <Box sx={{ display: "flex" }}>
        <Box sx={{ flexGrow: 1, p: 1, width: "max-content" }}>
          <Outlet />
        </Box>
      </Box>
    </div>
  );
};

export default AppLayout;
