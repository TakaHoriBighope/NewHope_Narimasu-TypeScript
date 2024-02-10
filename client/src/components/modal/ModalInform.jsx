import { Image } from "@mui/icons-material";
import {
  Box,
  Button,
  Divider,
  List,
  ListItemButton,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { closeModal } from "../../redux/features/modalSlice";
import DoDisturbIcon from "@mui/icons-material/DoDisturb";
import UploadFileIcon from "@mui/icons-material/UploadFile";
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

const ModalInform = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value);
  const [file, setFile] = useState(null);
  const lang = useSelector((state) => state.lang.value);

  const [t, i18n] = useTranslation();

  useEffect(() => {
    i18n.changeLanguage(lang);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang, i18n]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dataShare = new FormData(e.target);
    const desc = dataShare.get("desc");
    const newInform = {
      userId: user._id,
      desc: desc,
    };
    if (file) {
      const data = new FormData();
      const fileName = Date.now() + file.name;
      data.append("name", fileName);
      data.append("file", file);
      newInform.img = fileName;
      try {
        //画像ＡＰＩを叩く
        await axios.post("/upload", data);
      } catch (error) {
        console.log(error);
      }
    }
    try {
      const res = await axios.post("/inform", newInform);
      // const totalInfo = [res, ...infos];
      // dispatch(setInfo(totalInfo));
      console.log(res);
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
    e.data = "";
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
          onSubmit={(e) => handleSubmit(e)}
          sx={{ display: "flex", width: "100%", alignItems: "center" }}
        >
          <Box sx={{ width: "500px" }}>
            <TextField
              id="desc"
              type="text"
              name="desc"
              placeholder={t("お知らせを入力して下さい")}
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
                  >
                    <label htmlFor="file" style={{ display: "flex" }}>
                      <Image htmlColor="#03a9f4" />
                      <Typography
                        variant="body1"
                        fontSize="small"
                        fontWeight="550"
                        sx={{ mt: 0.3, ml: 1 }}
                      >
                        写真
                      </Typography>
                      <input
                        type="file"
                        id="file"
                        accept=".png, .jpeg, .jpg, .pdf"
                        style={{ display: "none" }}
                        onChange={(e) => setFile(e.target.files[0])}
                      />
                    </label>
                  </Box>
                </ListItemButton>
              </List>
              <Box>
                <Button sx={{ color: "blue" }} type="submit">
                  <UploadFileIcon />
                </Button>
                <Button
                  sx={{ color: "red" }}
                  onClick={() => {
                    dispatch(closeModal());
                  }}
                >
                  <DoDisturbIcon />
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </aside>
  );
};

export default ModalInform;
