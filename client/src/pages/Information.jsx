import React from "react";
import Topbar from "../components/home/Topbar";
import Sidebar from "../components/sidebar/Sidebar";
import InfoTimeLine from "../components/infos/InfoTimeLine";
import Rightbar from "../components/home/Rightbar";
import { Box } from "@mui/material";

const Information = () => {
  return (
    <>
      <Topbar />
      <Box sx={{ display: "flex", width: "100%", backgroundColor: "#f8fcff" }}>
        <Sidebar />
        <InfoTimeLine />
        <Rightbar />
      </Box>
    </>
  );
};
export default Information;
