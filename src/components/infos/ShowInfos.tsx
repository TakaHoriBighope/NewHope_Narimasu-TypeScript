import { Box, Divider, IconButton, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { format } from "timeago.js";
import MarkChatReadIcon from "@mui/icons-material/MarkChatRead";
import GTranslateIcon from "@mui/icons-material/GTranslate";
import { db } from "../../firebase";
import { Timestamp, doc, getDoc, updateDoc } from "firebase/firestore";

type InfosProps = {
  info: {
    createdAt: Timestamp;
    desc: string;
    imgURL: string;
    likes: [];
    uid: string;
  };
};

interface Users {
  uid: string;
  coverPicture: string;
  createdAt: string;
  followers: [];
  followings: [];
  profilePicture: string;
  salesTalk: string;
  updatedAt: string;
  username: string;
}

const ShowInfos: React.FC<InfosProps> = ({ info }) => {
  const { likes, uid, desc, imgURL, createdAt } = info;

  const [like, setLike] = useState<number>(likes.length);
  const [isLiked, setIsLiked] = useState(false);

  const [infoUserData, setInfoUserData] = useState<Users>();

  useEffect(() => {
    //postしたユーザーのDataをget
    const fetchUser = async () => {
      const docSnap = await getDoc(doc(db, "users", uid));
      if (docSnap.exists()) {
        setInfoUserData({
          uid: docSnap.data().uid,
          coverPicture: docSnap.data().coverPicture,
          createdAt: docSnap.data().timestamp,
          followers: docSnap.data().followers,
          followings: docSnap.data().followings,
          profilePicture: docSnap.data().profilePicture,
          salesTalk: docSnap.data().salesTalk,
          updatedAt: docSnap.data().updateAt,
          username: docSnap.data().username,
        });
      } else {
        console.log("No such document!");
      }
    };
    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLike = async () => {
    const infoLikeRef = doc(db, "infos", uid);
    await updateDoc(infoLikeRef, {
      likes: uid,
    });
    setLike(isLiked ? like - 1 : like + 1);
    setIsLiked(!isLiked);
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography sx={{ fontSize: "0.9rem", fontWeight: "550", pr: "35px" }}>
          {infoUserData?.username}
        </Typography>
        <Typography sx={{ fontSize: "0.8rem", fontWeight: "550" }}>
          {/* {format(createdAt.toDate())} */}
          {format(new Date(createdAt?.toDate()).toLocaleString())}
        </Typography>
      </Box>
      <Typography
        sx={{
          fontSize: "small",
        }}
      >
        {desc}
      </Typography>
      <img
        src={imgURL}
        alt=""
        style={{
          marginTop: "15px",
          width: "100%",
          maxHeight: "250px",
          objectFit: "contain",
          borderRadius: "5px",
          margin: "0 auto",
        }}
      />
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex" }}>
          <IconButton onClick={() => handleLike()}>
            <MarkChatReadIcon htmlColor="red" sx={{ fontSize: "small" }} />
          </IconButton>
          <Typography>{like}</Typography>
        </Box>
        <IconButton sx={{ fontSize: "small", mr: 2 }}>
          <GTranslateIcon />
        </IconButton>
      </Box>
      <Divider sx={{ margin: "15px" }} />
    </>
  );
};

export default ShowInfos;
