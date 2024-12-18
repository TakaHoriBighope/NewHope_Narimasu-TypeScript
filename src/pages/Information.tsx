import React from "react";
import Topbar from "../components/home/Topbar";
import Sidebar from "../components/sidebar/Sidebar";
import InfoTimeLine from "../components/info/InfoTimeLine";
// import Rightbar from "../components/home/Rightbar";
import { Box } from "@mui/material";
import { mediaQuery, useMediaQuery } from "../utiles/useMediaQuery";
import ShareTimeLine from "../components/share/ShareTimeLine";

type Props = {
  mode: string;
};

const Information = (props: Props) => {
  const { mode } = props;
  const isSp = useMediaQuery(mediaQuery.sp);

  if (isSp) {
    return (
      <>
        <Topbar />
        <InfoTimeLine mode={mode} />
      </>
    );
  }

  return (
    <>
      <Topbar />
      <Box sx={{ display: "flex", width: "100%", backgroundColor: "#f8fcff" }}>
        <Sidebar />
        <ShareTimeLine />
        <InfoTimeLine mode={mode} />
        {/* <Rightbar /> */}
      </Box>
    </>
  );
};
export default Information;
