import React from "react";
import Topbar from "../components/home/Topbar";
import Sidebar from "../components/sidebar/Sidebar";
import Rightbar from "../components/home/Rightbar";
import { Box } from "@mui/material";
// import ImageUploader from "../components/settings/ImageUploader";
import { SettingsItem } from "../components/settings/SettingsItem";
import { mediaQuery, useMediaQuery } from "../utiles/useMediaQuery";

const MSettings = () => {
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
          <SettingsItem />
        </Box>
      </>
    );
  }

  return (
    <>
      <Topbar />
      <Box sx={{ display: "flex", width: "100%", backgroundColor: "#f8fcff" }}>
        <Sidebar />
        {/* <ImageUploader /> */}
        <SettingsItem />
        <Rightbar />
      </Box>
    </>
  );
};
export default MSettings;
