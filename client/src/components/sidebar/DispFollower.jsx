import React, { useEffect } from "react";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import { Box, IconButton } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { setPost } from "../../redux/features/postSlice";

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import jaJson from "../locales/ja.json";
import enJson from "../locales/en.json";
import { setLanguage } from "../../redux/features/langSlice";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: enJson },
    ja: { translation: jaJson },
  },
});

const DispFollower = ({ user }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate;
  const currentUser = useSelector((state) => state.user.value); //グローバルuser
  console.log(`DispFollower's currentUser:${currentUser.username}`);

  const lang = useSelector((state) => state.lang.value);
  console.log(`DispFollower's language:${lang}`);

  useEffect(() => {
    const getPosts = async () => {
      if (!currentUser.userid) {
        return;
      }
      const res = await axios.get(`/posts/timeline/${currentUser._id}`);
      if (!res) {
        navigate("/");
      } else {
        dispatch(setPost(res));
      }
    };
    getPosts();
    dispatch(setLanguage(lang));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, navigate, currentUser._id, user._id]);

  const handleChangeDisplayIn = async () => {
    if (currentUser._id === user._id) {
      return;
    }
    try {
      //followのAPIを叩いていく
      await axios.put(`/users/${user._id}/follow`, {
        userId: currentUser._id,
      });
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  const handleChangeDisplayOut = async () => {
    try {
      //followのAPIを叩いていく
      await axios.put(`/users/${user._id}/unfollow`, {
        userId: currentUser._id,
      });
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box>
      {currentUser.followings?.includes(user._id) ? (
        <div
          style={{
            width: "150px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: "0.8rem",
            marginBottom: "-10px",
          }}
        >
          {currentUser._id === user._id ? (
            <p style={{ fontWeight: "650" }}>{user.username}</p>
          ) : (
            <p>{user.username}</p>
          )}
          <IconButton onClick={() => handleChangeDisplayOut()}>
            <LoginIcon htmlColor="black" sx={{ fontSize: "1rem" }} />
          </IconButton>
        </div>
      ) : (
        <div
          style={{
            width: "150px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: "0.8rem",
            marginBottom: "-10px",
          }}
        >
          {currentUser._id === user._id ? (
            <p style={{ fontWeight: "650" }}>{user.username}</p>
          ) : (
            <p>{user.username}</p>
          )}
          <IconButton onClick={() => handleChangeDisplayIn()}>
            <LogoutIcon htmlColor="gray" sx={{ fontSize: "1rem" }} />
          </IconButton>
        </div>
      )}
    </Box>
  );
};

export default DispFollower;
