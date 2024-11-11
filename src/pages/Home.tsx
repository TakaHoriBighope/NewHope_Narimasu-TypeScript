import React from "react";
import Topbar from "../components/home/Topbar";
import Sidebar from "../components/sidebar/Sidebar";
import ShareTimeLine from "../components/home/ShareTimeLine";
import Rightbar from "../components/home/Rightbar";
import { Box } from "@mui/material";
import { mediaQuery, useMediaQuery } from "../utiles/useMediaQuery";
import InfoTimeLine from "../components/infos/InfoTimeLine";

const Home = () => {
  const isSp = useMediaQuery(mediaQuery.sp);
  if (isSp) {
    return (
      <>
        <Topbar />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            backgroundColor: "#f8fcff",
          }}
        >
          <InfoTimeLine mode="sub" />
        </Box>
      </>
    );
  }
  return (
    <>
      <Topbar />
      <Box sx={{ display: "flex", width: "100%", backgroundColor: "#f8fcff" }}>
        <Sidebar />
        <ShareTimeLine />
        <Rightbar />
      </Box>
    </>
  );
};
export default Home;
