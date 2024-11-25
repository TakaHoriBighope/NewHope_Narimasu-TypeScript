import React, { useState, ChangeEventHandler } from "react";
import { Box, Typography, IconButton, TextField } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import {
  arrayRemove,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebase";
import { useTranslation } from "react-i18next";
import { type Channel } from "../../types/channel";
import { useAppDispatch } from "../../redux/hooks";
import {
  deleteUser,
  EmailAuthProvider,
  getAuth,
  reauthenticateWithCredential,
} from "firebase/auth";
import { logout } from "../../redux/features/userSlice";
import StarIcon from "@mui/icons-material/Star";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
// import { setLanguage } from "../../redux/features/langSlice";

export const AccountDeletion = () => {
  const dispatch = useAppDispatch();

  //ログインしているユーザー(uid, email address, username(displayName))
  const [password, setPassword] = useState("");
  const [channels, setChannels] = useState<Channel[]>([]);
  // const [passwordErrText, setPasswordErrText] = useState("");
  // const [loading, setLoading] = useState(false);
  const [t] = useTranslation();

  const [isOpen, setIsOpen] = useState(false);
  // let lang = "";

  // useEffect(() => {
  //   i18n.changeLanguage(lang);
  //   dispatch(setLanguage(lang));
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [lang, i18n]);

  const handleChange: ChangeEventHandler = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPassword(event.target.value);
  };

  const onPressDeleteAccount = (password: string) => {
    const auth = getAuth();
    const user = auth.currentUser;
    const uid = auth.currentUser?.uid;

    //emailを使ってcredentialを新規に得る、これをしないとaccount削除が出来ない
    const credential = EmailAuthProvider.credential(
      auth.currentUser?.email ?? "",
      password
    );
    // setLoading(true);
    console.log("credential:", credential);
    //１．ます最初にchannelsのデータを取得
    let channelsResult: Channel[] = [];
    getDocs(collection(db, "channels"))
      .then((snapshot) => {
        snapshot.docs.forEach((doc) => {
          const { channelName, channelProp, channelMember } =
            doc.data() as Channel;
          channelsResult.push({
            channelId: doc.id,
            channelName,
            channelProp,
            channelMember,
          });
        });
        setChannels(channelsResult);
      })
      .catch((error) => {
        const { code, message } = error;
        console.log(code, message);
      });
    //２．channels.channelMemberのuidを削除する
    for (let i = 0; i < channels.length; i++) {
      const groupOutDocRef = doc(
        db,
        "channels",
        String(channels[i].channelId ?? "")
      );
      updateDoc(groupOutDocRef, { channelMember: arrayRemove(uid) })
        .then(() => {
          console.log(`deleted ${channels[i].channelName}:${uid}`);
        })
        .catch((error) => {
          const { code, message } = error;
          console.log(code, message);
        });
    }
    //3．usersのuidを削除する
    deleteDoc(doc(db, "users", String(uid)))
      .then(() => {
        if (user) {
          reauthenticateWithCredential(user, credential)
            .then(() => {
              deleteUser(user)
                .then(() => {
                  console.log("User deleted.", uid);
                  // User deleted.
                  dispatch(logout());
                  // setUser(null);
                })
                .catch((error) => {
                  // An error ocurred
                  const { code, message } = error;
                  console.log(code, message);
                });
              // User re-authenticated.
            })
            .catch((error) => {
              // An error ocurred
              const { code, message } = error;
              console.log(code, message);
            });
        }
      })
      .catch((error) => {
        // An error ocurred
        const { code, message } = error;
        console.log(code, message);
      });
  };

  return (
    <Box>
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
          {t("アカウントを削除する。")}
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <TextField
          sx={{ "& .MuiInputBase-input": { height: 25 }, width: 230 }}
          inputProps={{ inputMode: "text" }}
          color="primary"
          id="password"
          label={t("パスワード")}
          focused
          margin="normal"
          name="password"
          type="password"
          required
          helperText={t("パスワードを入力して下さい。")}
          // error={passwordErrText !== ""}
          // disabled={loading}
          size="small"
          onChange={handleChange}
          value={password}
        />
        <Box>
          {!!password ? (
            <IconButton
              sx={{ color: "#800 " }}
              // onClick={() => onPressDeleteAccount(password)}
              onClick={() => {
                setIsOpen(true);
              }}
            >
              <CheckCircleIcon sx={{ fontSize: "35px" }} />
            </IconButton>
          ) : null}
        </Box>

        <Dialog
          open={isOpen}
          onClose={() => {
            setIsOpen(false);
          }}
        >
          <DialogTitle>{t("確認")}</DialogTitle>
          <DialogContent>{t("本当によろしいですか？")}</DialogContent>
          <DialogActions>
            <Button
              variant="outlined"
              onClick={() => {
                setPassword("");
                setIsOpen(false);
              }}
            >
              {t("キャンセル")}
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                onPressDeleteAccount(password);
                setIsOpen(false);
              }}
            >
              OK
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};
