import React, { useEffect } from "react";
import {
  Box,
  IconButton,
  List,
  ListItemButton,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import { Person } from "@mui/icons-material";
import SpeakerNotesIcon from "@mui/icons-material/SpeakerNotes";
import SettingsAccessibilityIcon from "@mui/icons-material/SettingsAccessibility";
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
            {/* <ListItemButton>
              <Link
                // to={`/profile/${currentUser.username}`}
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
                    <SpeakerNotesIcon />
                  </IconButton>
                  <Typography variant="body1" fontWeight="700">
                    プロファイルの個人的な売り込み文
                  </Typography>
                </Box>
              </Link>
            </ListItemButton> */}
            {/* <ListItemButton>
              <Link
                // to={`/profile/${currentUser.username}`}
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
                    <SettingsAccessibilityIcon />
                  </IconButton>
                  <Typography variant="body1" fontWeight="700">
                    出身地など個人的な情報
                  </Typography>
                </Box>
              </Link>
            </ListItemButton> */}
          </List>
        </Box>
      </Box>
    </>
  );
};

export default PersonalSettings;
