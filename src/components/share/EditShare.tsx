import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Divider,
  List,
  ListItemButton,
  TextField,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { useTranslation } from "react-i18next";
import CloseFullscreenIcon from "@mui/icons-material/CloseFullscreen";
import { closeEditModal } from "../../redux/features/editModalSlice";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";

const EditShare = (id: string) => {
  const [inputText, setInputText] = useState<string>("");
  const { t, i18n } = useTranslation();
  const lang = useAppSelector((state) => state.lang);
  const dispatch = useAppDispatch();
  // const user = useAppSelector((state) => state.user.user);

  useEffect(() => {
    i18n.changeLanguage(lang.lang);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang, i18n]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    dispatch(closeEditModal());
  };

  return (
    <aside
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "rgba(0, 0, 0, 0.5)",
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          background: "#fff",
          width: "80vw",
          maxWidth: "500px",
          borderRadius: "10px",
          padding: "2rem 1rem",
          textAlign: "center",
          zIndex: "100",
        }}
      >
        <Box
          component="form"
          onSubmit={(e: React.FormEvent<HTMLFormElement>) => handleSubmit(e)}
          sx={{
            display: "flex",
            width: "100%",
            alignItems: "center",
          }}
        >
          <Box sx={{ width: "500px" }}>
            <TextField
              id="desc"
              type="text"
              name="desc"
              placeholder=""
              variant="outlined"
              fullWidth
              multiline
              rows={10}
              sx={{
                ".MuiOutlinedInput-input": { padding: 0 },
                ".MuiOutlinedInput-notchedOutline": { border: "none" },
                ".MuiOutlinedInput-root": {
                  fontSize: "0.9rem",
                  fontWeight: "500",
                  marginTop: "-10px",
                },
              }}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setInputText(e.target.value)
              }
              value={inputText}
            />

            <Divider sx={{ margin: "0 15px ", marginTop: "3px" }} />
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <List sx={{ display: "flex" }}>
                <ListItemButton>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      marginright: "12px",
                      cursor: "pointer",
                    }}
                  ></Box>
                </ListItemButton>
              </List>
              <Box>
                <Button sx={{ color: "blue" }} type="submit">
                  <UploadFileIcon />
                </Button>
                <Button
                  sx={{ color: "#2c517c" }}
                  onClick={() => {
                    dispatch(closeEditModal());
                  }}
                >
                  <CloseFullscreenIcon />
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </aside>
  );
};

export default EditShare;
