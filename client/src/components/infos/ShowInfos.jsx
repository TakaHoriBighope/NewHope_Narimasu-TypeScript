import { Box, Divider, IconButton, Typography } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { format } from "timeago.js";
import MarkChatReadIcon from "@mui/icons-material/MarkChatRead";
import GTranslateIcon from "@mui/icons-material/GTranslate";

const ShowInfos = ({ info }) => {
  const PUBLIC_FOLDER = process.env.REACT_APP_PUBLIC_FOLDER;

  const [like, setLike] = useState(info.likes.length);
  const [isLiked, setIsLiked] = useState(false);

  const currentUser = useSelector((state) => state.user.value); //グローバルuser
  const [user, setUser] = useState({}); //infoの一時的user

  useEffect(() => {
    if (!info.userId) {
      return;
    }
    const fetchUser = async () => {
      const response = await axios.get(`/users?userId=${info.userId}`); //クエリの方を使う
      // const response = await axios.get(`/users/${info.userId}`);
      // console.log(response.data);
      setUser(response.data);
    };
    fetchUser();
  }, [info.userId]);

  const handleLike = async () => {
    try {
      //いいねのAPIを叩いていく
      await axios.put(`/inform/${info._id}/like`, { userId: currentUser._id });
    } catch (error) {
      console.log(error);
    }
    setLike(isLiked ? like - 1 : like + 1);
    setIsLiked(!isLiked);
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography sx={{ fontSize: "0.9rem", fontWeight: "550", pr: "35px" }}>
          {user.username}
        </Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <Typography sx={{ fontSize: "0.8rem", fontWeight: "550" }}>
            {format(info.createdAt)}
          </Typography>
        </Box>
      </Box>
      <Typography
        sx={{
          fontSize: "small",
        }}
      >
        {info.desc}
      </Typography>
      <img
        src={PUBLIC_FOLDER + info.img}
        alt=""
        style={{
          marginTop: "5px",
          width: "100%",
          maxHeight: "150px",
          objectFit: "contain",
          borderRadius: "20px",
          margin: "0 auto",
        }}
      />
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex" }}>
          <IconButton onClick={() => handleLike()}>
            <MarkChatReadIcon htmlColor="red" sx={{ fontSize: "small" }} />
          </IconButton>
          <Typography>{like}</Typography>
        </Box>
        <IconButton sx={{ fontSize: "small", mr: 2 }}>
          <GTranslateIcon />
        </IconButton>
      </Box>
      <Divider sx={{ margin: "15px" }} />
    </>
  );
};

export default ShowInfos;
