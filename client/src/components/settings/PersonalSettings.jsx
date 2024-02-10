import React from "react";
import { Box, Typography } from "@mui/material";

const PersonalSettings = () => {
  return (
    <>
      <Box sx={{ flex: 5.5, maxWidth: 990 }}>
        <Box sx={{ margin: "15px" }}>
          <Typography>ユーザーのアバター設定</Typography>
          <Typography>プロファイルのバック画像設定</Typography>
          <Typography>プロファイルの個人的な売り込み文</Typography>
          <Typography>フォローしている友達</Typography>
          <Typography>出身地など個人的な情報</Typography>
        </Box>
      </Box>
    </>
  );
};

export default PersonalSettings;
