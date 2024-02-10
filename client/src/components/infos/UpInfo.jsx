import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import { Box, IconButton, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { format } from "timeago.js";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setInfo } from "../../redux/features/infoSlice";
import axios from "axios";

const UpInfo = ({ info }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const PUBLIC_FOLDER = process.env.REACT_APP_PUBLIC_FOLDER;
  const currentUser = useSelector((state) => state.user.value); //グローバルuser
  const infos = useSelector((state) => state.info.value); //グローバルinfos

  useEffect(() => {
    const getAllInfos = async () => {
      const res = await axios.get("/inform/");
      if (!res) {
        navigate("/");
      } else {
        dispatch(setInfo(res));
      }
    };
    getAllInfos();
  }, [dispatch, navigate, info._id]);

  const deleteInfo = async () => {
    console.log(currentUser.username);
    console.log(info._id);
    console.log(infos);
    try {
      const deletedInfo = await axios.delete(`/inform/${info._id}`);
      console.log(deletedInfo);
      window.location.reload();
      // const newInfos = infos.filter((e) => e._id !== info._id); //削除
      // console.log(newInfos);

      // const totalInfos = [newInfos, ...infos];
      // dispatch(setInfo(totalInfos));
      // window.location.reload();
      // navigate("/information");
      // console.log(newInfos);

      // if (newInfos.length === 0) {
      //   navigate("/");
      // } else {
      //   navigate(`/inform/${newInfos[0]._id}`);
      // }
    } catch (error) {
      console.log(`お知らせを削除 + ${error}`);
    }
  };

  return (
    <Box
      sx={{
        p: 2,
        maxWidth: 560,
        borderRadius: "10px",
        margin: "1px 0 1px 5px",
        boxShadow: "0px 3px 10px 0px rgba(0, 0, 0, 0.2)",
      }}
    >
      <Box
        sx={{
          p: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {/* <Avatar src={PUBLIC_FOLDER + user.profilePicture} alt="" /> */}
          <Typography sx={{ pl: 2, fontWeight: "550" }}>
            {currentUser.username}
          </Typography>
          <Typography sx={{ pl: 5, fontSize: "small" }}>
            {format(info.createdAt)}
          </Typography>
        </Box>
        <IconButton
          variant="outlined"
          color="error"
          onClick={() => deleteInfo()}
        >
          <DeleteOutlinedIcon />
        </IconButton>
      </Box>
      <Box sx={{ p: 1 }}>
        <Typography sx={{ mb: 0.5, fontSize: "0.8rem" }}>
          {info.desc}
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <img
            src={PUBLIC_FOLDER + info.img}
            alt=""
            style={{
              width: "100%",
              maxHeight: "250px",
              marginTop: "10px",
              objectFit: "contain",
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default UpInfo;
