import { Home, MessageRounded, Person, Settings } from "@mui/icons-material";
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
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import DisplayAllUsers from "./DispalyAllUsers";
import i18n from "i18next";
import { useTranslation } from "react-i18next";
import { initReactI18next } from "react-i18next";
import jaJson from "../locales/ja.json";
import enJson from "../locales/en.json";
import { setLanguage } from "../../redux/features/langSlice";
import PositionedMenu from "./PositionedMenu";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: enJson },
    ja: { translation: jaJson },
  },
});

const Sidebar = () => {
  const PASS1 = process.env.REACT_APP_PASSWORD1;
  const PASS2 = process.env.REACT_APP_PASSWORD2;
  const dispatch = useDispatch();

  const currentUser = useSelector((state) => state.user.value);
  console.log(`Sidebar useSelector username:${currentUser.username}`);

  const lang = useSelector((state) => state.lang.value);
  console.log(`at Sidebar language:${lang}`);
  const [t, i18n] = useTranslation();

  useEffect(() => {
    i18n.changeLanguage(lang);
    dispatch(setLanguage(lang));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Link, lang, i18n]);

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
          <Box
            sx={{
              width: "100%",
              display: "flex",
              alignItems: "center",
            }}
          >
            <IconButton>
              <MessageRounded />
            </IconButton>
            <Typography variant="body1" fontWeight="700">
              {t("メッセージ")}
            </Typography>
          </Box>
        </ListItemButton>
        <ListItemButton>
          <Link
            to={`/profile/${currentUser.username}`}
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
                <Person />
              </IconButton>
              <Typography variant="body1" fontWeight="700">
                {t("プロファイル")}
              </Typography>
            </Box>
          </Link>
        </ListItemButton>

        {currentUser.password === PASS1 || currentUser.password === PASS2 ? (
          <ListItemButton>
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
              <PositionedMenu />
            </Box>
          </ListItemButton>
        ) : (
          ""
        )}

        <ListItemButton>
          <Box>
            <Link
              to={`/pSettings/${currentUser.username}`}
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
                <Typography variant="body1" fontWeight="700">
                  {t("設定")}
                </Typography>
              </Box>
            </Link>
          </Box>
        </ListItemButton>

        <Divider sx={{ margin: " 15px " }} />
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography
            sx={{ fontSize: "small", fontWeight: "550", marginTop: "5px" }}
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
