import React from "react";
import { Box } from "@mui/material";
import Sidebar from "../components/talk/sidebar/Sidebar";
import Chat from "../components/talk/chat/Chat";
import Rightbar from "../components/home/Rightbar";
import Topbar from "../components/home/Topbar";
import { mediaQuery, useMediaQuery } from "../utiles/useMediaQuery";

const Talk = () => {
  const isSp = useMediaQuery(mediaQuery.sp);

  if (isSp) {
    return (
      <>
        <Topbar />
        <Box sx={{ height: "100vh" }}>
          <Chat />
          {/* <Sidebar /> */}
        </Box>
      </>
    );
  }

  return (
    <>
      <Topbar />
      <Box sx={{ display: "flex", width: "100%", backgroundColor: "#f8fcff" }}>
        <Sidebar />
        <Chat />
        <Rightbar />
      </Box>
    </>
  );
};

export default Talk;
