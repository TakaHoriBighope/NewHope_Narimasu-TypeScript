import React from "react";
import { Box, Typography } from "@mui/material";

import { useAppSelector } from "../../redux/hooks";
import { AccountDeletion } from "./AccountDeletion";
import { CreateTalkGroup } from "./CreateTalkGroup";
import ImageUploader from "./ImageUploader";

export const SettingsITem = () => {
  //ログインしているユーザー(uid, email address, username(displayName))
  const loginUser = useAppSelector((state) => state.user.user);

  return (
    <Box
      sx={{
        flex: "4",
        maxWidth: "790",
        height: "100vh",
        overflowY: "scroll",
      }}
    >
      <Box
        sx={{
          textAlign: "center",
          // margin: "15px",
        }}
      >
        <Typography
          sx={{
            marginTop: "20px",
            marginLeft: "5px",
            fontSize: "18px",
            fontWeight: "800",
            lineHeight: "24px",
          }}
        >
          User: {loginUser?.displayName}
        </Typography>
        <Typography
          sx={{ marginLeft: "5px", fontSize: "14px", lineHeight: "20px" }}
        >
          {loginUser?.email}
        </Typography>
        <Box>
          <CreateTalkGroup />
        </Box>
        <Box>
          <AccountDeletion />
        </Box>
        <Box sx={{ marginTop: "20px" }}>
          <ImageUploader />
        </Box>
      </Box>
    </Box>
  );
};
