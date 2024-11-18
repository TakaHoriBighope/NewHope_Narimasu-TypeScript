import React, { useEffect, useState } from "react";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import { Box, IconButton } from "@mui/material";
import { db } from "../../firebase";
import {
  arrayRemove,
  arrayUnion,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { useAppSelector } from "../../redux/hooks";
import { useTranslation } from "react-i18next";
// import { closeSelectPosterModal } from "../../redux/features/selectPosterModalSlice";
import { type User } from "../../types/user";

type Props = {
  user: User;
};

type Follow = {
  followings: string[];
  uid: "";
};

const DispFollower = (props: Props) => {
  //ログインしているユーザー(uid, email address, username(displayName))
  const { user } = props;

  const loginUser = useAppSelector((state) => state.user.user);
  const lang = useAppSelector((state) => state.lang);
  // eslint-disable-next-line
  const [t, i18n] = useTranslation();

  useEffect(() => {
    i18n.changeLanguage(lang.lang);
    // dispatch(setLanguage(lang));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang, i18n]);

  //ログインしているユーザーデーターを取ってくる（followingsの状態が必要）
  const [followingsData, setFollowingsData] = useState<Follow>();
  useEffect(() => {
    const fetchUser = async () => {
      const uid = loginUser?.uid;
      if (uid) {
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setFollowingsData({
            uid: docSnap.data().uid,
            followings: docSnap.data().followings,
          });
        } else {
          console.log("No such document!");
        }
      }
    };
    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChangeDisplayIn = async () => {
    //自分のポストデータを表示するか？
    // if (currentUserData.uid === loginUser.uid) {
    //   return;
    // }
    const uid = followingsData?.uid;
    if (uid) {
      const followDocRef = doc(db, "users", uid);
      await updateDoc(followDocRef, {
        followings: arrayUnion(user.uid),
      });
    }
    window.location.reload();
  };

  const handleChangeDisplayOut = async () => {
    const uid = followingsData?.uid;
    if (uid) {
      const unfollowDocRef = doc(db, "users", uid);
      await updateDoc(unfollowDocRef, {
        followings: arrayRemove(user.uid),
      });
    }
    window.location.reload();
  };

  return (
    <Box>
      {/* loginUserがフォローしているユーザーであれば */}
      {followingsData?.followings?.includes(user.uid) ? (
        <Box
          style={{
            width: "200px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: "0.8rem",
            marginBottom: "-10px",
          }}
        >
          {followingsData?.uid === user?.uid ? (
            <p style={{ fontWeight: "650" }}>{user.username}</p>
          ) : (
            <p>{user.username}</p>
          )}
          <IconButton onClick={() => handleChangeDisplayOut()}>
            <LoginIcon
              htmlColor="black"
              sx={{ fontSize: "1rem", fontWeight: "800" }}
            />
          </IconButton>
        </Box>
      ) : (
        <Box
          style={{
            width: "200px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: "0.8rem",
            marginBottom: "-10px",
          }}
        >
          {loginUser?.uid === user?.uid ? (
            <p style={{ fontWeight: "650", color: "black" }}>{user.username}</p>
          ) : (
            <p>{user.username}</p>
          )}
          <IconButton onClick={() => handleChangeDisplayIn()}>
            <LogoutIcon htmlColor="gray" sx={{ fontSize: "1rem" }} />
          </IconButton>
        </Box>
      )}
    </Box>
  );
};

export default DispFollower;
