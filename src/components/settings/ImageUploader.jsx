import { Box, Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db, storage } from "../../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { onAuthStateChanged } from "firebase/auth";
import { setDisplayName } from "../../redux/features/displayNameSlice";
import { useTranslation } from "react-i18next";

import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import { login } from "../../redux/features/userSlice";

const ImageUploader = () => {
  const [loading, setLoading] = useState(false);
  const [isUpLoaded, setUpLoaded] = useState(false);
  const loginUser = useAppSelector((state) => state.user.user);

  const [currentUserData, setCurrentUserData] = useState({});
  const dispatch = useAppDispatch();
  const lang = useAppSelector((state) => state.lang.value);
  const [imageType, setImageType] = React.useState("profile");

  const handleChange = (event) => {
    setImageType(event.target.value);
  };

  const [t, i18n] = useTranslation();

  useEffect(() => {
    i18n.changeLanguage(lang);
    // dispatch(setLanguage(lang));
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
    let path = "";
    if (imageType === "profile") {
      path = "profile/";
    } else {
      path = "back/";
    }
    // console.log(e.target.files[0].name);
    const file = e.target.files[0];
    const storageRef = ref(storage, path + Date.now() + file.name);
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
          if (imageType === "profile") {
            setDoc(imageRef, { profilePicture: downloadURL }, { merge: true });
            if (imageType === "profile") {
              dispatch(
                login({
                  uid: loginUser.uid,
                  email: loginUser.email,
                  profilePicture: downloadURL,
                  displayName: loginUser.displayName,
                })
              );
            }
          } else {
            setDoc(imageRef, { coverPicture: downloadURL }, { merge: true });
          }
        });
      }
    );
  };
  return (
    <>
      <Box sx={{ flex: 3.5, maxWidth: 500 }}>
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
                  padding: "36px",
                  borderRadius: "10px",
                  boxShadow: "0px 0px 8px gray",
                  color: "gray",
                }}
              >
                <FormControl>
                  {/* <FormLabel id="demo-controlled-radio-buttons-group">
                    選択
                  </FormLabel> */}
                  <RadioGroup
                    aria-labelledby="demo-controlled-radio-buttons-group"
                    name="controlled-radio-buttons-group"
                    value={imageType}
                    onChange={handleChange}
                  >
                    <Box>
                      <FormControlLabel
                        value="profile"
                        control={<Radio />}
                        label={t("プロフィール")}
                      />
                      <FormControlLabel
                        value="back"
                        control={<Radio />}
                        label={t("背景画像")}
                      />
                    </Box>
                  </RadioGroup>
                </FormControl>
                <Box>
                  <h2 style={{ fontWeight: "600", marginTop: "5px" }}>
                    {t("画像アップローダー")}
                  </h2>
                  <p>{t("jpegかpngの画像ファイル")}</p>
                </Box>
                <Box
                  style={{
                    border: "2px dashed #2d6395",
                    padding: "35px 60px",
                    position: "relative",
                  }}
                >
                  <Box>
                    <PersonOutlineIcon
                      sx={{
                        width: "150px",
                        height: "150px",
                        color: "lightgray",
                      }}
                    />
                    <p style={{ marginBottom: 0 }}>
                      {t("ここにドラッグ＆ドロップして下さい")}
                    </p>
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
                <Button variant="contained">
                  ファイルを選択 type="file"
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
