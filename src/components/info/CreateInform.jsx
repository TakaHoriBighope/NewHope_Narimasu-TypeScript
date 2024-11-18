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
import { useDispatch, useSelector } from "react-redux";
import { closeModal } from "../../redux/features/modalSlice";
import CloseFullscreenIcon from "@mui/icons-material/CloseFullscreen";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import i18n from "i18next";
import { useTranslation } from "react-i18next";
import { initReactI18next } from "react-i18next";
import jaJson from "../locales/ja.json";
import enJson from "../locales/en.json";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../../firebase";
import {
  ref,
  getStorage,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: enJson },
    ja: { translation: jaJson },
  },
});

const CreateInform = () => {
  const dispatch = useDispatch();
  const storage = getStorage();
  const user = auth.currentUser;
  const lang = useSelector((state) => state.lang.value);
  // const [loading, setLoading] = useState(false);
  // const [isUploaded, setIsUpLoaded] = useState(false);
  const [file, setFile] = useState(null);

  const [t, i18n] = useTranslation();

  useEffect(() => {
    i18n.changeLanguage(lang);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang, i18n]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataShare = new FormData(e.target);
    const desc = dataShare.get("desc");
    if (file) {
      const storageRef = ref(storage, "image/" + Date.now() + file.name);
      const uploadImage = uploadBytesResumable(storageRef, file);
      uploadImage.on(
        "state_changed",
        (snapshot) => {
          // setLoading(true);
        },
        (err) => {
          console.log(err);
        },
        () => {
          // setLoading(false);
          // setIsUpLoaded(true);
          // Upload completed successfully, now we can get the download URL
          getDownloadURL(uploadImage.snapshot.ref).then((downloadURL) => {
            addDoc(collection(db, "infos"), {
              desc: desc,
              imgURL: downloadURL,
              likes: [],
              // createdAt: new Date(serverTimestamp() * 1000),
              createdAt: serverTimestamp(),
              uid: user.uid,
            }).then(function (docRef) {
              console.log(docRef.id);
            });
          });
        }
      );
    }
    dispatch(closeModal());
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
                        {t("写真")}
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
                  sx={{ color: "#2c517c" }}
                  onClick={() => {
                    dispatch(closeModal());
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

export default CreateInform;
