import React, { useState, useEffect } from "react";
import { Avatar, Box, Button, IconButton, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { useTranslation } from "react-i18next";
import enJson from "../locales/en.json";
import jaJson from "../locales/ja.json";
import { setLanguage } from "../../redux/features/langSlice";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: enJson },
    ja: { translation: jaJson },
  },
});

const Topbar = () => {
  const dispatch = useDispatch();
  const PUBLIC_FOLDER = process.env.REACT_APP_PUBLIC_FOLDER;
  const user = useSelector((state) => state.user.value);
  const navigate = useNavigate();
  const lang2 = useSelector((state) => state.lang.value);
  const [lang, setLang] = useState(lang2);

  const [t, i18n] = useTranslation();

  useEffect(() => {
    i18n.changeLanguage(lang);
    dispatch(setLanguage(lang));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang, i18n]);

  const HandleOnclick = () => {
    localStorage.removeItem("token");
    navigate("/login");
    // window.location.reload();
  };

  return (
    <Box
      sx={{
        height: "50px",
        width: "100%",
        backgroundColor: "#2c517c",
        display: "flex",
        alignItems: "center",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}
    >
      <Box sx={{ flex: 4 }}>
        <Typography
          fontSize="24px"
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
            src={PUBLIC_FOLDER + user.profilePicture}
            sx={{
              width: 35,
              height: 35,
              position: "fixed",
              top: "15px",
              right: "20px",
            }}
          />
        </IconButton>
        <Button
          onClick={() => setLang(lang === "en" ? "ja" : "en")}
          sx={{ position: "fixed", top: "15px", right: "70px" }}
        >
          {t("言語を切り替え")}
        </Button>
      </Box>
    </Box>
  );
};

export default Topbar;
