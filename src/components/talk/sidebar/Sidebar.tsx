import React, { useEffect, useState } from "react";
import { Avatar, Box, Fab, IconButton, List, Typography } from "@mui/material";
import { ExpandMoreOutlined } from "@mui/icons-material";
import ChannelOnSidebar from "./ChannelOnSidebar";
import { db } from "../../../firebase";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import {
  DocumentData,
  Query,
  collection,
  onSnapshot,
  query,
} from "firebase/firestore";
import assets from "../../../assets";
import { useTranslation } from "react-i18next";
import { closeModal } from "../../../redux/features/modalSlice";
import { mediaQuery, useMediaQuery } from "../../../utiles/useMediaQuery";
import CloseFullscreenIcon from "@mui/icons-material/CloseFullscreen";
import { closeGroupModal } from "../../../redux/features/groupModalSlice";

interface Channels {
  id: string;
  channel: DocumentData;
}

const Sidebar = () => {
  const loginUser = useAppSelector((state) => state.user.user);
  const isSp = useMediaQuery(mediaQuery.sp);
  const dispatch = useAppDispatch();

  const lang = useAppSelector((state) => state.lang);
  console.log(lang);
  const [t, i18n] = useTranslation();
  useEffect(() => {
    i18n.changeLanguage(lang.lang);
  }, [lang, i18n]);

  const [channels, setChannels] = useState<Channels[]>([]);
  const collectionRef: Query<DocumentData> = query(collection(db, "channels"));
  useEffect(() => {
    onSnapshot(collectionRef, (querySnapshot) => {
      const channelsResults: Channels[] = [];
      querySnapshot.forEach((doc) => {
        channelsResults.push({
          id: doc.id,
          channel: doc.data(),
        });
      });
      setChannels(channelsResults);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [closeModal]);

  if (isSp) {
    return (
      <aside
        style={{
          position: "fixed",
          top: 38,
          left: 0,
          width: "100%",
          height: "95%",
          background: "rgba(136, 129, 129, 0.5)",
          zIndex: 50,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            position: "fixed",
            top: 38,
            left: 0,
            display: "flex",
            width: "65%",
            backgroundColor: "gray",
            fontWeight: "600",
          }}
        >
          <Box
            sx={{
              // backgroundColor: "#e5e9f4",
              backgroundColor: assets.colors.secondary,
              width: "250px",
              position: "relative",
              flexGrow: 1,
            }}
          >
            <Box>
              <Box
                sx={{
                  display: "flex",
                  color: "#686a6e",
                  justifyContent: "space-between",
                  marginTop: "20px",
                  marginRight: "15px",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <ExpandMoreOutlined />
                  <Typography
                    sx={{
                      fontWeight: "600",
                      fontSize: "15px",
                      padding: "-10px",
                    }}
                  >
                    {t("グループCH.")}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ height: "100vh", overflowY: "scroll" }}>
                <List>
                  {channels.map((channel) => (
                    <ChannelOnSidebar
                      channel={channel}
                      id={channel.id}
                      key={channel.id}
                    />
                  ))}
                </List>
              </Box>
            </Box>
          </Box>
          <Fab
            size="small"
            aria-label="edit"
            sx={{ color: "#2c517c", position: "fixed", top: 50, left: 160 }}
            onClick={() => dispatch(closeGroupModal())}
          >
            <CloseFullscreenIcon />
          </Fab>
        </Box>
      </aside>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flex: "2.5",
        maxWidth: "412",
        backgroundColor: "gray",
        fontWeight: "600",
        height: "95vh",
      }}
    >
      <Box
        sx={{
          // backgroundColor: "#e5e9f4",
          backgroundColor: assets.colors.secondary,
          width: "250px",
          position: "relative",
          flexGrow: 1,
        }}
      >
        <Box>
          <Box
            sx={{
              display: "flex",
              color: "#686a6e",
              justifyContent: "space-between",
              marginTop: "20px",
              marginRight: "15px",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <ExpandMoreOutlined />
              <Typography sx={{ fontWeight: "600", fontSize: "20px" }}>
                {t("グループチャンネル")}
              </Typography>
            </Box>
          </Box>
          <List>
            {channels.map((channel) => (
              <ChannelOnSidebar
                channel={channel}
                id={channel.id}
                key={channel.id}
              />
            ))}
          </List>
        </Box>
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              // paddingBottom: "10px",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <IconButton>
                <Link to="/" style={{ textDecoration: "none", color: "black" }}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column*",
                      alignItems: "center",
                      paddingBottom: "10px",
                      justifyContent: "center",
                      paddingTop: "10px",
                    }}
                  >
                    <Avatar
                      src={loginUser?.profilePicture}
                      sx={{ marginLeft: "5px" }}
                    />
                    <Typography
                      sx={{
                        color: "#686a6e",
                        fontWeight: "900",
                        marginLeft: "5px",
                        fontSize: "18px",
                      }}
                    >
                      {t("ホームへ")}
                    </Typography>
                  </Box>
                </Link>
              </IconButton>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Sidebar;
