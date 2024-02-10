import { Box } from "@mui/material";
import React from "react";
import Topbar from "../components/home/Topbar";
import Sidebar from "../components/sidebar/Sidebar";
import Rightbar from "../components/home/Rightbar";
import PersonalSettings from "../components/settings/PersonalSettings";

const PSettings = () => {
  return (
    <>
      <Topbar />
      <Box sx={{ display: "flex", width: "100%", backgroundColor: "#f8fcff" }}>
        <Sidebar />
        <PersonalSettings />
        <Rightbar />
      </Box>
    </>
  );
};

export default PSettings;
