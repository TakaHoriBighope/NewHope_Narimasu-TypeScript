import React, { useEffect } from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { setLanguage } from "../../redux/features/langSlice";
import { useNavigate } from "react-router-dom";

import i18n from "i18next";
import { useTranslation } from "react-i18next";
import { initReactI18next } from "react-i18next";
import jaJson from "../locales/ja.json";
import enJson from "../locales/en.json";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: enJson },
    ja: { translation: jaJson },
  },
});

const PositionedMenu = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const currentUser = useSelector((state) => state.user.value);

  const lang = useSelector((state) => state.lang.value);
  console.log(`at Sidebar language:${lang}`);
  const [t, i18n] = useTranslation();

  useEffect(() => {
    i18n.changeLanguage(lang);
    dispatch(setLanguage(lang));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Link, lang, i18n]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMakeInform = () => {
    navigate(`/information/${currentUser.username}`);
  };

  const handleMakeGroup = () => {
    navigate(`/msettings/${currentUser.username}`);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        id="demo-positioned-button"
        aria-controls={open ? "demo-positioned-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        <Typography
          variant="body1"
          fontWeight="700"
          style={{ textDecoration: "none", color: "black" }}
        >
          {t("運営管理")}
        </Typography>
      </Button>
      <Menu
        id="demo-positioned-menu"
        aria-labelledby="demo-positioned-button"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <MenuItem onClick={handleMakeInform}>{t("教会からお知らせ")}</MenuItem>
        <MenuItem onClick={handleMakeGroup}>{t("グループを作る")}</MenuItem>
        <MenuItem onClick={handleClose}>Logout</MenuItem>
      </Menu>
    </div>
  );
};
export default PositionedMenu;
