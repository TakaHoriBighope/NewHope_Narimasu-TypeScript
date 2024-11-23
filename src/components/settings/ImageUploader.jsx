import { Avatar, Box, Button, IconButton, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db, storage } from "../../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { onAuthStateChanged } from "firebase/auth";
import { setDisplayName } from "../../redux/features/displayNameSlice";
import { useTranslation } from "react-i18next";

import { login } from "../../redux/features/userSlice";
import StarIcon from "@mui/icons-material/Star";

const ImageUploader = () => {
  const [loading, setLoading] = useState(false);
  const [isUpLoaded, setUpLoaded] = useState(false);
  const loginUser = useAppSelector((state) => state.user.user);

  const [currentUserData, setCurrentUserData] = useState({});
  const dispatch = useAppDispatch();
  const lang = useAppSelector((state) => state.lang.value);

  const [t, i18n] = useTranslation();

  useEffect(() => {
    i18n.changeLanguage(lang);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang, i18n]);

  useEffect(() => {
    const fetchUser = () => {
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          const uid = user.uid;
          const docRef = doc(db, "users", uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setCurrentUserData(docSnap.data());
            dispatch(setDisplayName(currentUserData.username));
          } else {
            console.log("No such document!33");
          }
        } else {
          console.log("User is signed out");
        }
      });
    };
    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const OnFileUploadtoFirebase = (e) => {
    const file = e.target.files[0];
    const storageRef = ref(storage, "profile/" + Date.now() + file.name);
    const uploadImage = uploadBytesResumable(storageRef, file);
    uploadImage.on(
      "state_changed",
      (snapshot) => {
        setLoading(true);
      },
      (err) => {
        console.log(err);
      },
      () => {
        setLoading(false);
        setUpLoaded(true);
        // Upload completed successfully, now we can get the download URL
        getDownloadURL(uploadImage.snapshot.ref).then((downloadURL) => {
          console.log("File available at", downloadURL);
          const imageRef = doc(db, "users", currentUserData.uid);
          setDoc(imageRef, { profilePicture: downloadURL }, { merge: true });
          dispatch(
            login({
              uid: loginUser.uid,
              email: loginUser.email,
              profilePicture: downloadURL,
              displayName: loginUser.displayName,
            })
          );
        });
      }
    );
  };
  return (
    <>
      <Box sx={{ flex: 4.0, maxWidth: 790 }}>
        <Box sx={{ display: "flex", alignItems: "center", marginTop: "15px" }}>
          <IconButton>
            <StarIcon sx={{ fontSize: "25px", color: "blueviolet" }} />
          </IconButton>
          <Typography
            sx={{
              fontSize: "20px",
              fontWeight: "600",
              color: "#483c3c",
            }}
          >
            {t("プロフィアル画像を登録する。")}
          </Typography>
        </Box>
        {loading ? (
          <h2>{t("登録中...")}</h2>
        ) : (
          <>
            {isUpLoaded ? (
              <h2>{t("登録完了！")}</h2>
            ) : (
              <Box
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  border: "none",
                  color: "gray",
                  marginLeft: "10px",
                }}
              >
                <Box sx={{ width: "350px" }}>
                  <Typography style={{ fontWeight: "600" }}>
                    {t("画像アップローダー")}
                  </Typography>
                  <Typography>{t("jpegかpngの画像ファイルを")}</Typography>
                  <Typography style={{ marginBottom: 0 }}>
                    {t("ここにドラッグ＆ドロップして下さい")}
                  </Typography>
                </Box>
                <Box
                  style={{
                    marginTop: "10px",
                    border: "2px dashed #800",
                    width: "230px",
                    height: "230px",
                    padding: "35px 60px",
                    position: "relative",
                    borderRadius: "115px",
                    marginBottom: "10px",
                  }}
                >
                  <Box>
                    <Avatar
                      src={loginUser?.profilePicture}
                      sx={{
                        width: "230px",
                        height: "230px",
                        top: "-37px",
                        left: "-62px",
                        // padding: "35px",
                        position: "relative",
                      }}
                    />
                    {/* <PersonOutlineIcon
                      sx={{
                        width: "80px",
                        height: "80px",
                        color: "lightgray",
                      }}
                    /> */}
                  </Box>
                  <input
                    style={{
                      opacity: 0,
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      cursor: "pointer",
                    }}
                    multiple
                    name="imageURL"
                    type="file"
                    accept=".png, .jpeg, .jpg"
                    onChange={OnFileUploadtoFirebase}
                  />
                </Box>
                <p>{t("または")}</p>
                <Button variant="contained" sx={{ backgroundColor: "#800" }}>
                  {t("ファイルを選択")}
                  <input
                    style={{
                      opacity: 0,
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      cursor: "pointer",
                    }}
                    type="file"
                    accept=".png, .jpeg, .jpg"
                    onChange={OnFileUploadtoFirebase}
                  />
                </Button>
              </Box>
            )}
          </>
        )}
      </Box>
    </>
  );
};

export default ImageUploader;
