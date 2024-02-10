import React from "react";
import Topbar from "../components/home/Topbar";
import Sidebar from "../components/sidebar/Sidebar";
import Rightbar from "../components/home/Rightbar";
import { Box } from "@mui/material";
import ManageSettings from "../components/settings/ManageSettings";

const MSettings = () => {
  return (
    <>
      <Topbar />
      <Box sx={{ display: "flex", width: "100%", backgroundColor: "#f8fcff" }}>
        <Sidebar />
        <ManageSettings />
        <Rightbar />
      </Box>
    </>
  );
};
export default MSettings;
