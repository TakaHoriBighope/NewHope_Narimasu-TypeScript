import { Box, IconButton, Typography } from "@mui/material";
import { DocumentData } from "firebase/firestore";
import React from "react";
import { useAppDispatch } from "../../../redux/hooks";
import { setChannelInfo } from "../../../redux/features/channelSlice";
// import { closeGroupModal } from "../../../redux/features/groupModalSlice";
import StarIcon from "@mui/icons-material/Star";

type Props = {
  id: string;
  channel: DocumentData;
};

const ChannelOnSidebar = (props: Props) => {
  const { id, channel } = props;
  const dispatch = useAppDispatch();
  // eslint-disable-next-line
  //const isGroupOpen = useAppSelector((state) => state.groupModal);

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
          // dispatch(closeGroupModal());
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography sx={{ fontWeight: "600" }}>
            <IconButton>
              <StarIcon
                sx={{
                  fontSize: "20px",
                  color: "blueviolet",
                }}
              />
            </IconButton>
            {channel.channel.channelName}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default ChannelOnSidebar;
