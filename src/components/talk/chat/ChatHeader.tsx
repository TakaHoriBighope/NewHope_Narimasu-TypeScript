import { Box, IconButton, Typography } from "@mui/material";
import React from "react";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { openModal } from "../../../redux/features/modalSlice";
import DisplayAllmembers from "../groupChannel/DisplayAllmembers";
import { mediaQuery, useMediaQuery } from "../../../utiles/useMediaQuery";

type Props = {
  channelName: string | null;
};

const ChatHeader = (props: Props) => {
  const { channelName } = props;
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.modal);
  console.log(isOpen);
  const isSp = useMediaQuery(mediaQuery.sp);

  const loginUser = useAppSelector((state) => state.user.user);
  const channelProp = useAppSelector((state) => state.channel.channelProp);

  if (isSp) {
    <Box
      sx={{
        display: "flex",
        width: "100%",
        alignItems: "center",
        justifyContent: "space-between",
        paddingTop: "10px",
      }}
    >
      {/* "chat-header_left" */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography
          sx={{ paddingLeft: "17px", fontSize: "1.2rem", color: "#393b52" }}
        >
          #
        </Typography>
        <Typography
          sx={{
            paddingLeft: "5px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            color: "#393b52",
            fontSize: "1.3rem",
            fontWeight: "550",
          }}
        >
          {channelName}
        </Typography>
      </Box>
      <Box sx={{ paddingRight: "25px" }}>
        {channelProp === loginUser?.uid ? (
          <IconButton sx={{ gap: "15px", color: "#7b7c85" }}>
            <PersonAddIcon
              onClick={() => dispatch(openModal())}
              sx={{ margin: "0 10px 0  10px" }}
            />
          </IconButton>
        ) : (
          <IconButton
            sx={{ gap: "15px", color: "#7b7c85", marginRight: "10px" }}
          >
            <HelpOutlineIcon />
          </IconButton>
        )}
        {channelProp === loginUser?.uid ? (
          <IconButton>
            <PersonRemoveIcon sx={{ margin: "0 10px 0  10px" }} />
          </IconButton>
        ) : (
          ""
        )}
      </Box>
      {isOpen.isOpen ? <DisplayAllmembers channelName={channelName} /> : null}
    </Box>;
  }

  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        alignItems: "center",
        justifyContent: "space-between",
        paddingTop: "10px",
      }}
    >
      {/* "chat-header_left" */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography
          sx={{ paddingLeft: "17px", fontSize: "1.2rem", color: "#393b52" }}
        >
          #
        </Typography>
        <Typography
          sx={{
            paddingLeft: "5px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            color: "#393b52",
            fontSize: "1.3rem",
            fontWeight: "550",
          }}
        >
          {channelName}
        </Typography>
      </Box>
      <Box sx={{ paddingRight: "25px" }}>
        {channelProp === loginUser?.uid ? (
          <IconButton sx={{ gap: "15px", color: "#7b7c85" }}>
            <PersonAddIcon
              onClick={() => dispatch(openModal())}
              sx={{ margin: "0 10px 0  10px" }}
            />
          </IconButton>
        ) : (
          <IconButton sx={{ gap: "15px", color: "#7b7c85" }}>
            <HelpOutlineIcon />
          </IconButton>
        )}
        {channelProp === loginUser?.uid ? (
          <IconButton>
            <PersonRemoveIcon sx={{ margin: "0 10px 0  10px" }} />
          </IconButton>
        ) : (
          ""
        )}
      </Box>
      {isOpen.isOpen ? <DisplayAllmembers channelName={channelName} /> : null}
    </Box>
  );
};

export default ChatHeader;
