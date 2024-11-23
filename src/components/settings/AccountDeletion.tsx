import React, { useState } from "react";
import { Box, Typography, IconButton } from "@mui/material";
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

export const AccountDeletion = () => {
  const [t] = useTranslation();
  const dispatch = useAppDispatch();

  //ログインしているユーザー(uid, email address, username(displayName))
  const [password, setPassword] = useState("");
  const [channels, setChannels] = useState<Channel[]>([]);

  const [isOpen, setIsOpen] = useState(false);

  // const passwordCheck = (newText: string) => {
  //   const regex = /^[a-zA-Z0-9]+$/;
  //   const isValid = regex.test(newText);
  //   setIsValid(isValid);
  // };

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
            fontSize: "20px",
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
        <Box
          sx={{
            marginTop: "10px",
          }}
        >
          <input
            placeholder="input your passoword"
            type="password"
            style={{
              padding: "5px",
              marginTop: "15px",
              height: 40,
              fontSize: 20,
              borderColor: "#800",
              borderBottomWidth: 1,
            }}
            // autoCapitalize="none"
            onChange={() => {
              setPassword(password);
              // passwordCheck(password);
            }}
            value={password}
          />
        </Box>
        {!!password ? (
          <Box>
            <IconButton
              sx={{ color: "#800 " }}
              // onClick={() => onPressDeleteAccount(password)}
              onClick={() => {
                setIsOpen(true);
              }}
            >
              <CheckCircleIcon sx={{ marginTop: "25px", fontSize: "35px" }} />
            </IconButton>
          </Box>
        ) : null}

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
