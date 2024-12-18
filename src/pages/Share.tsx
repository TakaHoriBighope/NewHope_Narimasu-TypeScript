import React from "react";
import Topbar from "../components/home/Topbar";
import ShareTimeLine from "../components/share/ShareTimeLine";
import { Box } from "@mui/material";
import { mediaQuery, useMediaQuery } from "../utiles/useMediaQuery";

const Share = () => {
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
          <ShareTimeLine />
        </Box>
      </>
    );
  }
};
export default Share;
