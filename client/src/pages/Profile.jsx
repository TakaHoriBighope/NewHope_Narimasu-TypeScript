import React, { useEffect, useState } from "react";
import Topbar from "../components/home/Topbar";
import { Avatar, Box, Typography } from "@mui/material";
import Sidebar from "../components/sidebar/Sidebar";
import TimeLine from "../components/home/TimeLine";
import Rightbar from "../components/home/Rightbar";
import axios from "axios";
import { useParams } from "react-router-dom";
// import { useSelector } from "react-redux";

const Profile = () => {
  const PUBLIC_FOLDER = process.env.REACT_APP_PUBLIC_FOLDER;

  const [user, setUser] = useState({});
  const username = useParams().username;
  // const lang = useSelector((state) => state.lang.value);
  // console.log(lang);

  useEffect(() => {
    const fetchUser = async () => {
      const response = await axios.get(`/users?username=${username}`);
      console.log(response);
      setUser(response.data);
    };
    fetchUser();
  }, [username]);

  return (
    <>
      <Topbar />
      <Box sx={{ display: "flex", width: "100%", backgroundColor: "#f8fcff" }}>
        <Sidebar />
        <Box sx={{ flex: 9.5 }}>
          <Box sx={{ position: "relative" }}>
            <img
              src={
                PUBLIC_FOLDER + user.coverPicture ||
                PUBLIC_FOLDER + "/post/beach.jpg "
              }
              alt=""
              style={{
                width: "100%",
                height: "250px",
                objectFit: "cover",
                marginBottom: "60px",
              }}
            />
            <Avatar
              src={PUBLIC_FOLDER + user.profilePicture}
              alt=""
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                height: "60px",
                width: "60px",
                borderRadius: "50%",
                margin: "auto",
                top: "200px",
                border: "2px solid white",
              }}
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginTop: "-50px",
            }}
          >
            <Typography sx={{ fontWeight: 550 }}>{user.username}</Typography>
            <Typography sx={{ fontSize: "13px" }}>{user.desc}</Typography>
          </Box>
          <Box sx={{ display: "flex" }}>
            <TimeLine username={username} />
            <Rightbar user={user} />
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Profile;
