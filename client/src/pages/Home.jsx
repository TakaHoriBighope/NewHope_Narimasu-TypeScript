import React from "react";
import Topbar from "../components/home/Topbar";
import Sidebar from "../components/sidebar/Sidebar";
import TimeLine from "../components/home/TimeLine";
import Rightbar from "../components/home/Rightbar";
import { Box } from "@mui/material";

const Home = () => {
  return (
    <>
      <Topbar />
      <Box sx={{ display: "flex", width: "100%", backgroundColor: "#f8fcff" }}>
        <Sidebar />
        <TimeLine />
        <Rightbar />
      </Box>
    </>
  );
};
export default Home;
