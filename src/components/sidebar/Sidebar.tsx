import { Home, Settings } from "@mui/icons-material";
import InfoIcon from "@mui/icons-material/Info";
import assets from "../../assets";
import {
  Box,
  Divider,
  IconButton,
  List,
  ListItemButton,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DisplayAllUsers from "./DispalyAllUsers";
// import i18n from "i18next";
import { useTranslation } from "react-i18next";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";
import { useAppSelector } from "../../redux/hooks";
import ChatIcon from "@mui/icons-material/Chat";
import StarIcon from "@mui/icons-material/Star";
import { type User } from "../../types/user";

const Sidebar = () => {
  // const UID1 = process.env.REACT_APP_UID1;
  const UID2 = process.env.REACT_APP_UID2;
  console.log(UID2);

  const [currentUserData, setCurrentUserData] = useState<User>();
  console.log(currentUserData?.uid);

  const lang = useAppSelector((state) => state.lang);
  const [t, i18n] = useTranslation();

  useEffect(() => {
    i18n.changeLanguage(lang.lang);
    // dispatch(setLanguage(lang));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Link, lang, i18n]);

  useEffect(() => {
    const fetchUser = () => {
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          const uid = user.uid;
          const docRef = doc(db, "users", uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setCurrentUserData({
              uid: docSnap.data().uid,
              coverPicture: docSnap.data().coverPicture,
              profilePicture: docSnap.data().profilePicture,
              createdAt: docSnap.data().createdAt,
              updatedAt: docSnap.data().updatedAt,
              followers: docSnap.data().followers,
              followings: docSnap.data().followings,
              salesTalk: docSnap.data().salesTalk,
              username: docSnap.data().username,
              email: docSnap.data().email,
            });
          } else {
            console.log("No such document!11");
          }
        } else {
          console.log("No such document!22");
        }
      });
    };
    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box>
      <List
        sx={{
          flex: 2.5,
          maxWidth: 412,
          height: "100vh",
          padding: "10px",
          backgroundColor: assets.colors.secondary,
        }}
      >
        <ListItemButton>
          <Link to="/" style={{ textDecoration: "none", color: "black" }}>
            <Box
              sx={{
                width: "100%",
                display: "flex",
                alignItems: "center",
              }}
            >
              <IconButton>
                <Home />
              </IconButton>
              <Typography variant="body1" fontWeight="700">
                {t("ホーム")}
              </Typography>
            </Box>
          </Link>
        </ListItemButton>
        <ListItemButton>
          <Link to={"/talk"} style={{ textDecoration: "none", color: "black" }}>
            <Box
              sx={{
                width: "100%",
                display: "flex",
                alignItems: "center",
              }}
            >
              <IconButton>
                <ChatIcon />
              </IconButton>
              <Typography variant="body1" fontWeight="700">
                {t("グループトーク")}
              </Typography>
            </Box>
          </Link>
        </ListItemButton>

        {currentUserData?.uid === UID2 ? (
          <ListItemButton>
            <Link
              to={"/information"}
              style={{ textDecoration: "none", color: "black" }}
            >
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <IconButton>
                  <InfoIcon />
                </IconButton>
                <Typography variant="body1" fontWeight="700">
                  {t("教会からお知らせ")}
                </Typography>
                {/* <PositionedMenuAdomin /> */}
              </Box>
            </Link>
          </ListItemButton>
        ) : (
          ""
        )}

        <ListItemButton>
          <Box>
            <Link
              to={"/pSettings"}
              style={{ textDecoration: "none", color: "black" }}
            >
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <IconButton>
                  <Settings />
                </IconButton>
                {/* <PositionedMenuSetting /> */}
                <Typography variant="body1" fontWeight="700">
                  {t("設定")}
                </Typography>
              </Box>
            </Link>
          </Box>
        </ListItemButton>

        <Divider sx={{ margin: " 5px " }} />
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
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
        <DisplayAllUsers />
      </List>
    </Box>
  );
};
export default Sidebar;
