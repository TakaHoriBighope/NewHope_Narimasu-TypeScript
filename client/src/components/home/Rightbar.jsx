import React, { useEffect, useState } from "react";
import axios from "axios";
import ShowInfos from "../infos/ShowInfos";
import { Box, IconButton, Typography } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
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

const Rightbar = ({ user }) => {
  const HomeRightbar = () => {
    const [infos, setInfos] = useState([]);

    const lang = useSelector((state) => state.lang.value);
    const [t, i18n] = useTranslation();

    useEffect(() => {
      i18n.changeLanguage(lang);
    }, [lang, i18n]);

    useEffect(() => {
      const fetchInfos = async () => {
        await axios.get("/inform").then((response) => {
          setInfos(
            response.data.sort((info1, info2) => {
              return new Date(info2.createdAt) - new Date(info1.createdAt);
            })
          );
        }); //成増からのお知らせ
        // console.log(response.data);
      };
      fetchInfos();
    }, []);

    return (
      <Box sx={{ flex: 4, maxWidth: 500 }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton>
            <StarIcon sx={{ fontSize: "25px", color: "blueviolet" }} />
          </IconButton>
          <Typography sx={{ fontWeight: "700", fontSize: "15px" }}>
            {t("NH成増からのお知らせ")}
          </Typography>
        </Box>
        {infos.map((info) => (
          <ShowInfos info={info} key={info._id} />
        ))}
      </Box>
      // </Box>
    );
  };

  const ProfileRightbar = () => {
    const lang = useSelector((state) => state.lang.value);
    const [t, i18n] = useTranslation();

    useEffect(() => {
      i18n.changeLanguage(lang);
    }, [lang, i18n]);
    return (
      <>
        <Box>
          <Typography
            sx={{
              fontSize: "18px",
              fontWeight: "550",
              marginBottom: "10px",
              marginTop: "10px",
            }}
          >
            {t("ユーザー情報")}
          </Typography>
          <Box sx={{ display: "flex", fontWeight: "500", color: "#555" }}>
            <Typography>出身：</Typography>
            <Typography>静岡県浜松</Typography>
          </Box>
        </Box>
      </>
    );
  };

  return (
    <Box
      sx={{
        p: 2,
        flex: 4,
        maxWidth: 680,
      }}
    >
      {user ? <ProfileRightbar /> : <HomeRightbar />}
    </Box>
  );
};

export default Rightbar;
