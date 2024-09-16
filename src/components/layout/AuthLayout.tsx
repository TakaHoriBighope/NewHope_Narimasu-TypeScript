import { Box, Container, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import i18n from "i18next";
import { useTranslation } from "react-i18next";
import { initReactI18next } from "react-i18next";
import jaJson from "../locales/ja.json";
import enJson from "../locales/en.json";
import { auth } from "../../firebase";
import { useAppDispatch } from "../../redux/hooks";
import { login, logout } from "../../redux/features/userSlice";
import { mediaQuery, useMediaQuery } from "../../utiles/useMediaQuery";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: enJson },
    ja: { translation: jaJson },
  },
});

const AuthLayout = () => {
  const isSp = useMediaQuery(mediaQuery.sp);
  const dispatch = useAppDispatch();
  // const [user, setUser] = useState(null); // ログイン状態
  const navigate = useNavigate();
  const [t] = useTranslation();

  // ログイン状態の監視
  useEffect(() => {
    auth.onAuthStateChanged((loginUser) => {
      console.log(loginUser);
      if (loginUser) {
        dispatch(
          login({
            uid: loginUser.uid,
            email: loginUser.email,
          })
        );
        navigate("/");
      } else {
        dispatch(logout());
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  if (isSp) {
    return (
      <div>
        <Container component="main" maxWidth="xs">
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginRight: 1,
              marginTop: 1,
            }}
          >
            <Typography
              sx={{
                fontSize: "20px",
                fontWeight: 800,
                color: "#41428b",
                marginBottom: "10px",
              }}
            >
              {t("ニューホープ")}
            </Typography>
            <Typography
              sx={{
                fontSize: "20px",
                fontWeight: 800,
                color: "#41428b",
                marginBottom: "10px",
                marginTop: "-15px",
              }}
            >
              {t("成増")}
            </Typography>
            <Typography
              sx={{ fontSize: "15px", color: "gray", fontWeight: 650 }}
            >
              {t("チームでする教会")}
            </Typography>
            <Outlet />
          </Box>
        </Container>
      </div>
    );
  }
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
