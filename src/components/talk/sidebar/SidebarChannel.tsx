import { Box, Typography } from "@mui/material";
import { DocumentData } from "firebase/firestore";
import React from "react";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { setChannelInfo } from "../../../redux/features/channelSlice";
import { closeGroupModal } from "../../../redux/features/groupModalSlice";

type Props = {
  id: string;
  channel: DocumentData;
};

const SidebarChannel = (props: Props) => {
  const { id, channel } = props;
  const dispatch = useAppDispatch();
  const isGroupOpen = useAppSelector((state) => state.groupModal);
  console.log(isGroupOpen);

  return (
    <Box sx={{ paddingLeft: "20px", marginTop: "15px" }}>
      <Box
        sx={{
          color: "#292c31",
          display: "flex",
          alignItems: "center",
          padding: "5px",
          fontSize: "1.1rem",
          cursor: "pointer",
          "&:hover": {
            color: "white",
            backgroundColor: "#b8c3d5",
            borderRadius: "7px",
            marginRight: "10px",
          },
        }}
        onClick={() => {
          dispatch(
            setChannelInfo({
              channelId: id,
              channelName: channel.channel.channelName,
              channelProp: channel.channel.channelProp,
              channelMember: channel.channel.channelMember,
            })
          );
          dispatch(closeGroupModal());
        }}
      >
        <Typography sx={{ fontWeight: "600" }}>
          <span
            style={{
              fontSize: "20px",
              paddingRight: "10px",
            }}
          >
            #
          </span>
          {channel.channel.channelName}
        </Typography>
      </Box>
    </Box>
  );
};

export default SidebarChannel;
