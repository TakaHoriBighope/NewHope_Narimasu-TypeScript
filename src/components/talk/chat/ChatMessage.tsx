import { Avatar, Box, Typography, Divider } from "@mui/material";
import React from "react";
import { type Message } from "../../../types/message";

type Props = {
  message: Message;
};

const ChatMessage = (props: Props) => {
  const { message } = props;
  const { talk, createdAt, profilePicture, username } = message;
  return (
    <Box sx={{ margin: "5px" }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "top",
          paddingLeft: "5px",
          color: "black",
        }}
      >
        <Avatar src={profilePicture} sx={{ marginTop: "15px" }} />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            padding: "10px 20px 5px 10px",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography>{username}</Typography>
            <Typography sx={{ paddingLeft: "15px", color: "#7b7c85" }}>
              {new Date(createdAt?.toDate()).toLocaleString()}
            </Typography>
          </Box>
          <Typography sx={{ fontWeight: "510" }}>{talk}</Typography>
        </Box>
      </Box>
      <Divider sx={{ marginLeft: "10px", marginRight: "10px" }} />
    </Box>
  );
};

export default ChatMessage;
