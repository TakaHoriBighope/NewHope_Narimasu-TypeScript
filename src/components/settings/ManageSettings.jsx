import React from "react";
import { Box, Typography } from "@mui/material";

const ManageSettings = () => {
  return (
    <>
      <Box sx={{ flex: 5.5, maxWidth: 990 }}>
        <Box sx={{ margin: "15px" }}>
          <Typography>ユーザーのリクエストでグループを作る</Typography>
        </Box>
      </Box>
    </>
  );
};

export default ManageSettings;
