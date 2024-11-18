import { Box, Divider, IconButton, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { format } from "timeago.js";
import MarkChatReadIcon from "@mui/icons-material/MarkChatRead";
import GTranslateIcon from "@mui/icons-material/GTranslate";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import { auth, db } from "../../firebase";
import {
  Timestamp,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { type User } from "../../types/user";

type InfosProps = {
  info: {
    id: string;
    createdAt: Timestamp;
    desc: string;
    imgURL: string;
    likes: [];
    uid: string;
  };
};

const InfoList: React.FC<InfosProps> = ({ info }) => {
  const { id, likes, uid, desc, imgURL, createdAt } = info;

  const [like, setLike] = useState<number>(likes.length);
  const [isLiked, setIsLiked] = useState(false);

  const [infoUserData, setInfoUserData] = useState<User>();
  const loginUser = auth.currentUser;

  useEffect(() => {
    //postしたユーザーのDataをget
    const docRef = doc(db, "users", uid);
    getDoc(docRef)
      .then((userDocRef) => {
        const {
          uid,
          email,
          coverPicture,
          profilePicture,
          followers,
          followings,
          salesTalk,
          createdAt,
          updatedAt,
          username,
        } = userDocRef.data() as User;
        setInfoUserData({
          id: userDocRef.id,
          email,
          uid,
          coverPicture,
          profilePicture,
          followers,
          followings,
          salesTalk,
          createdAt,
          updatedAt,
          username,
        });
      })
      .catch((error) => {
        console.log(error);
      });
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

  const deleteInfo = async (id: string) => {
    if (auth.currentUser === null) {
      return;
    }
    console.log("Deleted: ", id);
    const ref = doc(db, "infos", id);
    deleteDoc(ref).catch(() => {
      console.log("faild");
    });
  };

  return (
    <Box>
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
        {infoUserData?.uid === loginUser?.uid ? (
          //他人の投稿は削除できない
          <IconButton sx={{ color: "red" }} onClick={() => deleteInfo(id)}>
            <DeleteOutlinedIcon />
          </IconButton>
        ) : (
          ""
        )}
      </Box>
      <Divider sx={{ margin: "10px" }} />
    </Box>
  );
};

export default InfoList;
