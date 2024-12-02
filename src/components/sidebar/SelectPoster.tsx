import assets from "../../assets";
import { Box, Fab, IconButton, List, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { db } from "../../firebase";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import DispFollower from "./DispFollower";
import {
  DocumentData,
  Query,
  collection,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { closeSelectPosterModal } from "../../redux/features/selectPosterModalSlice";
import CloseFullscreenIcon from "@mui/icons-material/CloseFullscreen";
import { type User } from "../../types/user";
import StarIcon from "@mui/icons-material/Star";

const SelectPoster = () => {
  const lang = useAppSelector((state) => state.lang);
  const [t, i18n] = useTranslation();
  const dispatch = useAppDispatch();

  useEffect(() => {
    i18n.changeLanguage(lang.lang);
    // dispatch(setLanguage(lang));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang, i18n]);

  const [users, setUsers] = useState<User[]>([]);
  const collectionRef: Query<DocumentData> = query(
    collection(db, "users"),
    orderBy("createdAt", "desc")
  );

  useEffect(() => {
    // リアルタイムでデータを取得する
    onSnapshot(collectionRef, (querySnapshot) => {
      const usersResults: User[] = [];
      querySnapshot.forEach((doc) => {
        usersResults.push({
          uid: doc.data().uid,
          email: doc.data().email,
          coverPicture: doc.data().coverPicture,
          profilePicture: doc.data().profilePicture,
          followers: doc.data().followers,
          followings: doc.data().followings,
          createdAt: doc.data().createdAt,
          updatedAt: doc.data().uodatedAt,
          salesTalk: doc.data().salesTalk,
          username: doc.data().username,
        });
      });
      setUsers(usersResults);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
          width: "45%",
          // backgroundColor: "gray",
          // fontWeight: "600",
          height: "100vh",
          // overflowY: "scroll",
        }}
      >
        <List
          sx={{
            maxWidth: 250,
            height: "100vh",
            padding: "10px",
            backgroundColor: assets.colors.secondary,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
            }}
          >
            <IconButton>
              <StarIcon
                sx={{
                  fontSize: "15px",
                  color: "blueviolet",
                }}
              />
            </IconButton>
            <Typography
              sx={{
                fontSize: "small",
                fontWeight: "550",
              }}
            >
              {t("投稿者選択")}
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography
              sx={{
                marginLeft: "10px",
                fontSize: "small",
                fontWeight: "550",
                marginTop: "5px",
              }}
            >
              {t("登録者メンバー")}
            </Typography>
            <Typography
              sx={{ fontSize: "small", fontWeight: "550", marginTop: "5px" }}
            >
              {t("表示")}
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginLeft: "20px",
            }}
          >
            {users.map((user) => (
              <DispFollower user={user} key={user.uid} />
            ))}
          </Box>
        </List>
        <Fab
          size="small"
          aria-label="edit"
          sx={{ color: "#2c517c", position: "fixed", bottom: 20, left: 20 }}
          onClick={() => dispatch(closeSelectPosterModal())}
        >
          <CloseFullscreenIcon />
        </Fab>
      </Box>
    </aside>
  );
};
export default SelectPoster;
