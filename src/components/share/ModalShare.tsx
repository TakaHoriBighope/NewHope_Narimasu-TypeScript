import React, { useEffect, useState } from "react";
import { closeModal } from "../../redux/features/modalSlice";
import {
  Box,
  Button,
  Divider,
  List,
  ListItemButton,
  TextField,
  Typography,
} from "@mui/material";
import { Image } from "@mui/icons-material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db, storage } from "../../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { useTranslation } from "react-i18next";
import imageCompression from "browser-image-compression";
import CloseFullscreenIcon from "@mui/icons-material/CloseFullscreen";

type Props = {
  mode: string;
};

const ModalShare = (props: Props) => {
  const { mode } = props;

  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.user);
  // const postLists = useAppSelector((state) => state.post);

  // const [loading, setLoading] = useState(false);
  // const [upLoading, setIsUpLoaded] = useState(false);

  const [file, setFile] = useState<File | null>(null);
  const [inputText, setInputText] = useState<string>("");
  // const [lang, setLang] = useState("ja");
  const lang = useAppSelector((state) => state.lang);
  const [t, i18n] = useTranslation();

  // const [t] = useTranslation();
  console.log(mode);
  let text = "";
  if (mode === "posts") {
    text = "恵を感謝し、シェアします...";
  } else {
    text = "お知らせを入力して下さい";
  }

  useEffect(() => {
    i18n.changeLanguage(lang.lang);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang, i18n]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const dataShare = new FormData();
    dataShare.append("desc", inputText);

    if (file) {
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 800,
      };
      const compressedFile = await imageCompression(file, options);
      dataShare.append("file", compressedFile);

      const storageRef = ref(
        storage,
        "image/" + Date.now() + compressedFile.name
      );
      const uploadImage = uploadBytesResumable(storageRef, compressedFile);
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
            console.log("File available at", downloadURL);
            addDoc(collection(db, mode), {
              desc: inputText,
              imgURL: downloadURL,
              likes: [],
              createdAt: serverTimestamp(),
              uid: user?.uid,
            }).then(function (docRef) {
              // const newPosts = [docRef, ...postLists];
              // dispatch(setPostList(newPosts));
              // console.log(postLists);
            });
          });
        }
      );
    } else {
      addDoc(collection(db, mode), {
        desc: inputText,
        imgURL: "",
        likes: [],
        createdAt: serverTimestamp(),
        uid: user?.uid,
      }).then(function (docRef) {
        // const newPosts = [docRef, ...postLists];
        // dispatch(setPostList(newPosts));
        // console.log(postLists);
      });
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
              placeholder={t(text)}
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
                  >
                    <label htmlFor="file" style={{ display: "flex" }}>
                      <Image htmlColor="#03a9f4" />
                      <Typography
                        variant="body1"
                        fontSize="small"
                        fontWeight="550"
                        sx={{ mt: 0.3, ml: 1 }}
                      >
                        {/* 写真 */}
                        {t("写真")}
                      </Typography>
                      <input
                        type="file"
                        id="file"
                        accept=".png, .jpeg, .jpg, .pdf"
                        style={{ display: "none" }}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          const files = e.target.files;
                          if (files && files[0]) {
                            setFile(files[0]);
                          }
                          // setFile(e.target.files[0])
                        }}
                      />
                      <div>
                        {file ? (
                          <img
                            src="./taka_horimoto.png"
                            // src={file}
                            alt=""
                            style={{
                              width: "20%",
                              maxHeight: "25px",
                              // marginTop: "10px",
                              objectFit: "contain",
                            }}
                          />
                        ) : (
                          ""
                        )}
                      </div>
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

export default ModalShare;
