import React, { useState, useEffect } from "react";
import { Avatar, Box, Button, IconButton, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { useTranslation } from "react-i18next";
import enJson from "../locales/en.json";
import jaJson from "../locales/ja.json";
import { logout } from "../../redux/features/userSlice";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { setLanguage } from "../../redux/features/langSlice";
import { mediaQuery, useMediaQuery } from "../../utiles/useMediaQuery";

import { ToggleButton } from "./burger/ToggleButton";
import { Navigation } from "./burger/Navigation";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: enJson },
    ja: { translation: jaJson },
  },
});

const Topbar = () => {
  const isSp = useMediaQuery(mediaQuery.sp);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [profileURL, setProfileURL] = useState("");
  const lang = useAppSelector((state) => state.lang.lang);

  const [t, i18n] = useTranslation();

  const [open, setOpen] = useState(false);

  useEffect(() => {
    i18n.changeLanguage(lang);
    dispatch(setLanguage(lang));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang, i18n]);

  useEffect(() => {
    const fetchUser = () => {
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          const uid = user.uid;
          const docRef = doc(db, "users", uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setProfileURL(docSnap.data().profilePicture);
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

  const HandleOnclick = () => {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        dispatch(logout());
        navigate("/login");
        // window.location.reload();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const toggleFunction = () => {
    setOpen((prevState) => !prevState);
  };

  if (isSp) {
    return (
      <Box
        sx={{
          height: "38px",
          width: "100%",
          // backgroundColor: "#2c517c",
          backgroundColor: "#800",
          display: "flex",
          alignItems: "center",
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <header className="header">
            <ToggleButton
              open={open}
              controls="navigation"
              label="メニューを開きます"
              onClick={toggleFunction}
            />
            <Navigation id="navigation" open={open} />
          </header>
          <Typography
            fontSize="22px"
            color="white"
            fontWeight="bold"
            margin="0 0 0 25px"
            textTransform="capitalize"
          >
            {t("ニューホープ成増")}
          </Typography>
        </Box>
        <Box
          sx={{
            flex: 3,
            display: "flex",
            alignItems: "center",
            position: "relative",
          }}
        >
          <IconButton onClick={() => HandleOnclick()}>
            <Avatar
              alt=""
              src={profileURL}
              sx={{
                width: 20,
                height: 20,
                position: "fixed",
                top: "8px",
                right: "20px",
              }}
            />
          </IconButton>
          <Button
            onClick={() => dispatch(setLanguage(lang === "en" ? "ja" : "en"))}
            sx={{ position: "fixed", top: "2px", right: "30px" }}
          >
            {t("言語")}
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        height: "50px",
        width: "100%",
        // backgroundColor: "#2c517c",
        backgroundColor: "#7f1a1a",
        display: "flex",
        alignItems: "center",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}
    >
      <Box>
        <Typography
          fontSize="26px"
          color="white"
          fontWeight="bold"
          margin="0 0 0 25px"
          textTransform="capitalize"
        >
          {t("ニューホープ成増")}
        </Typography>
      </Box>
      <Box
        sx={{
          flex: 3,
          display: "flex",
          alignItems: "center",
          position: "relative",
        }}
      >
        <IconButton onClick={() => HandleOnclick()}>
          <Avatar
            alt=""
            src={profileURL}
            sx={{
              width: 35,
              height: 35,
              position: "fixed",
              top: "8px",
              right: "20px",
            }}
          />
        </IconButton>
        <Button
          onClick={() => dispatch(setLanguage(lang === "en" ? "ja" : "en"))}
          sx={{ position: "fixed", top: "15px", right: "70px", color: "white" }}
        >
          {t("言語を切り替え")}
        </Button>
      </Box>
    </Box>
  );
};

export default Topbar;
