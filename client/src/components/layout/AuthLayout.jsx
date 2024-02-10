import { Box, Container, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import authUtils from "../../utils/authUtils";
import i18n from "i18next";
import { useTranslation } from "react-i18next";
import { initReactI18next } from "react-i18next";
import jaJson from "../locales/ja.json";
import enJson from "../locales/en.json";
import { useSelector } from "react-redux";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: enJson },
    ja: { translation: jaJson },
  },
});

const AuthLayout = () => {
  const navigate = useNavigate();

  const lang = useSelector((state) => state.lang.value);

  const [t, i18n] = useTranslation();

  useEffect(() => {
    i18n.changeLanguage(lang);
  }, [lang, i18n]);

  useEffect(() => {
    //JWTを持っているのか確認する
    const checkAuth = async () => {
      //ページ切り替える度に認証チェック(トークン持ってるかどうか確認)
      const isAuth = await authUtils.isAuthenticated();
      console.log(`JWTを持っているのか確認する ${isAuth}`);
      if (isAuth) {
        navigate("/");
      }
    };
    checkAuth();
  }, [navigate]);

  return (
    <div>
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginRight: 10,
            marginTop: 5,
          }}
        >
          <Typography
            sx={{
              fontSize: "40px",
              fontWeight: 800,
              color: "#41428b",
              marginBottom: "10px",
            }}
          >
            {t("ニューホープ")}
          </Typography>
          <Typography
            sx={{
              fontSize: "35px",
              fontWeight: 800,
              color: "#41428b",
              marginBottom: "10px",
              marginTop: "-15px",
            }}
          >
            {t("成増")}
          </Typography>
          <Typography sx={{ fontSize: "24px", color: "gray", fontWeight: 650 }}>
            {t("チームでする教会")}
          </Typography>
          <Outlet />
        </Box>
      </Container>
    </div>
  );
};

export default AuthLayout;
