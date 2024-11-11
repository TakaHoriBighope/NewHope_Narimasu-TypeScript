import React, { useEffect } from "react";
import { Box, List, ListItemButton, Typography } from "@mui/material";
import { Person } from "@mui/icons-material";
import ImageUploader from "../settings/ImageUploader";
import { useAppSelector } from "../../redux/hooks";
import { useTranslation } from "react-i18next";

const PersonalSettings = () => {
  const lang = useAppSelector((state) => state.lang);
  const [t, i18n] = useTranslation();

  useEffect(() => {
    i18n.changeLanguage(lang.lang);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang, i18n]);

  return (
    <>
      <Box sx={{ flex: 5.5, maxWidth: 990 }}>
        <Box sx={{ margin: "15px" }}>
          <List>
            <ListItemButton>
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "15px",
                  }}
                >
                  <Person />
                  <Typography variant="body1" fontWeight="700">
                    {t("ユーザープロフィール画像、背景画像設定")}
                  </Typography>
                </Box>
                <ImageUploader />
              </Box>
            </ListItemButton>
          </List>
        </Box>
      </Box>
    </>
  );
};

export default PersonalSettings;
