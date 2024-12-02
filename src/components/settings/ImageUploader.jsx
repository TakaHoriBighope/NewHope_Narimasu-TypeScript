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
import { mediaQuery, useMediaQuery } from "../../utiles/useMediaQuery";

const ImageUploader = () => {
  const [loading, setLoading] = useState(false);
  const [isUpLoaded, setUpLoaded] = useState(false);
  const loginUser = useAppSelector((state) => state.user.user);
  const isSp = useMediaQuery(mediaQuery.sp);

  const [currentUserData, setCurrentUserData] = useState({});
  const dispatch = useAppDispatch();

  const [t] = useTranslation();

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
  if (isSp) {
    return (
      <>
        <Box sx={{ flex: 4.0, maxWidth: 790, marginBottom: "50px" }}>
          <Box
            sx={{ display: "flex", alignItems: "center", marginTop: "15px" }}
          >
            <IconButton>
              <StarIcon sx={{ fontSize: "25px", color: "blueviolet" }} />
            </IconButton>
            <Typography
              sx={{
                fontSize: "16px",
                fontWeight: "600",
                color: "#483c3c",
              }}
            >
              {t("プロフィアル画像を登録する。")}
            </Typography>
          </Box>
          {loading ? (
            <Typography>{t("登録中...")}</Typography>
          ) : (
            <>
              {isUpLoaded ? (
                // <Typography>{t("登録完了！")}</Typography>
                <Box
                  style={{
                    marginTop: "10px",
                    border: "2px dashed #800",
                    width: "120px",
                    height: "120px",
                    top: "20px",
                    left: "150px",
                    position: "relative",
                    borderRadius: "60px",
                  }}
                >
                  <Avatar
                    src={loginUser?.profilePicture}
                    sx={{
                      width: "120px",
                      height: "120px",
                      position: "relative",
                    }}
                  />
                </Box>
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
                      width: "120px",
                      height: "120px",
                      padding: "35px 60px",
                      position: "relative",
                      borderRadius: "60px",
                      marginBottom: "10px",
                    }}
                  >
                    <Box>
                      <Avatar
                        src={loginUser?.profilePicture}
                        sx={{
                          width: "120px",
                          height: "120px",
                          top: "-37px",
                          left: "-60px",
                          // padding: "35px",
                          position: "relative",
                        }}
                      />
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
  }

  return (
    <>
      <Box sx={{ flex: 4.0, maxWidth: 790 }}>
        <Box sx={{ display: "flex", alignItems: "center", marginTop: "15px" }}>
          <IconButton>
            <StarIcon sx={{ fontSize: "25px", color: "blueviolet" }} />
          </IconButton>
          <Typography
            sx={{
              fontSize: "16px",
              fontWeight: "600",
              color: "#483c3c",
            }}
          >
            {t("プロフィアル画像を登録する。")}
          </Typography>
        </Box>
        {loading ? (
          <Typography>{t("登録中...")}</Typography>
        ) : (
          <>
            {isUpLoaded ? (
              // <Typography>{t("登録完了！")}</Typography>
              <Box
                style={{
                  marginTop: "10px",
                  border: "2px dashed #800",
                  width: "120px",
                  height: "120px",
                  top: "20px",
                  left: "150px",
                  position: "relative",
                  borderRadius: "60px",
                }}
              >
                <Avatar
                  src={loginUser?.profilePicture}
                  sx={{
                    width: "120px",
                    height: "120px",
                    position: "relative",
                  }}
                />
              </Box>
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
                    width: "120px",
                    height: "120px",
                    padding: "35px 60px",
                    position: "relative",
                    borderRadius: "60px",
                    marginBottom: "10px",
                  }}
                >
                  <Box>
                    <Avatar
                      src={loginUser?.profilePicture}
                      sx={{
                        width: "120px",
                        height: "120px",
                        top: "-37px",
                        left: "-60px",
                        // padding: "35px",
                        position: "relative",
                      }}
                    />
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
