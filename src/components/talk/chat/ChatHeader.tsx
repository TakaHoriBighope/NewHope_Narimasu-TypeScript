import { Box, IconButton, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { openModal } from "../../../redux/features/modalSlice";
import DisplayAllmembers from "../groupChannel/DisplayAllmembers";
import { mediaQuery, useMediaQuery } from "../../../utiles/useMediaQuery";
import StarIcon from "@mui/icons-material/Star";
import { db } from "../../../firebase";
import { getDoc, doc } from "firebase/firestore";

type Props = {
  channelName: string | null;
  channelProp: string | null;
};

const ChatHeader = (props: Props) => {
  const { channelName, channelProp } = props;
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.modal);
  console.log(isOpen);
  const isSp = useMediaQuery(mediaQuery.sp);

  const loginUser = useAppSelector((state) => state.user.user);
  // const channelProp = useAppSelector((state) => state.channel.channelProp);
  const [propName, setPropName] = useState<string>("");

  const docRef = doc(db, "users", String(channelProp));
  useEffect(() => {
    const getUsername = async () => {
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setPropName(docSnap.data().username);
      }
    };
    getUsername();
  });

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
          <StarIcon
            sx={{
              fontSize: "20px",
              color: "blueviolet",
            }}
          />
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
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography
            sx={{ paddingLeft: "17px", fontSize: "1.2rem", color: "#393b52" }}
          >
            <IconButton>
              <StarIcon
                sx={{
                  fontSize: "20px",
                  color: "blueviolet",
                }}
              />
            </IconButton>
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
          <Typography
            sx={{ color: "#7b7c85", marginLeft: "10px", fontSize: "14px" }}
          >
            {propName}
          </Typography>
        </Box>
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
