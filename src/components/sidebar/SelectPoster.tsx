import assets from "../../assets";
import { Box, Fab, List, Typography } from "@mui/material";
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

type Users = {
  uid: string;
  coverPicture: string;
  createdAt: string;
  followers: [];
  followings: [];
  profilePicture: string;
  salesTalk: string;
  updatedAt: string;
  username: string;
};

const SelectPoster = () => {
  const lang = useAppSelector((state) => state.lang);
  const [t, i18n] = useTranslation();
  const dispatch = useAppDispatch();

  useEffect(() => {
    i18n.changeLanguage(lang.lang);
    // dispatch(setLanguage(lang));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang, i18n]);

  const [users, setUsers] = useState<Users[]>([]);
  const collectionRef: Query<DocumentData> = query(
    collection(db, "users"),
    orderBy("createdAt", "desc")
  );

  useEffect(() => {
    // リアルタイムでデータを取得する
    onSnapshot(collectionRef, (querySnapshot) => {
      const usersResults: Users[] = [];
      querySnapshot.forEach((doc) => {
        usersResults.push({
          uid: doc.data().uid,
          coverPicture: doc.data().coverPicture,
          createdAt: doc.data().createdAt,
          followers: doc.data().followers,
          followings: doc.data().followings,
          profilePicture: doc.data().profilePicture,
          salesTalk: doc.data().salesTalk,
          updatedAt: doc.data().updatedAt,
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
