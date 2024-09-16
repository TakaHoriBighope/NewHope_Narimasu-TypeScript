import { Avatar, Box, Typography } from "@mui/material";
import { Timestamp } from "firebase/firestore";
import React from "react";

type Props = {
  timestamp: Timestamp;
  message: string;
  user: {
    uid: string;
    profilePicture: string;
    email: string;
    displayName: string;
  };
};

const ChatMessage = (props: Props) => {
  const { message, timestamp, user } = props;
  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          paddingLeft: "5px",
          color: "black",
        }}
      >
        <Avatar src={user?.profilePicture} />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            padding: "10px 20px 5px 10px",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography>{user?.displayName}</Typography>
            <Typography sx={{ paddingLeft: "15px", color: "#7b7c85" }}>
              {new Date(timestamp?.toDate()).toLocaleString()}
            </Typography>
          </Box>
          <Typography sx={{ fontWeight: "510" }}>{message}</Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default ChatMessage;
