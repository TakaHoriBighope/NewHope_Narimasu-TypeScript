import { Box, Divider, IconButton, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
// import { format } from "timeago.js";
import MarkChatReadIcon from "@mui/icons-material/MarkChatRead";
import GTranslateIcon from "@mui/icons-material/GTranslate";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import { auth, db } from "../../firebase";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { type User } from "../../types/user";
import { type Info } from "../../types/info";
import EditIcon from "@mui/icons-material/Edit";
import EditInfo from "../info/EditInfo";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { openEditModal } from "../../redux/features/editModalSlice";

type Props = {
  id: string;
  info: Info;
};

const InfoList = (props: Props) => {
  const { id, info } = props;
  const { likes, uid, desc, imgURL, createdAt } = info;

  const [like, setLike] = useState<number>(likes.length);
  const [isLiked, setIsLiked] = useState(false);

  const [infoUserData, setInfoUserData] = useState<User>();
  const loginUser = auth.currentUser;

  const dispatch = useAppDispatch();
  const isEditOpen = useAppSelector((state) => state.editModal);

  const dateString = createdAt.toDate().toLocaleString("en-US");
  let dateAry = dateString.split(",");

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
        <Typography
          sx={{ fontSize: "0.8rem", fontWeight: "550", marginRight: "20px" }}
        >
          {/* {format(createdAt.toDate())} */}
          {/* {format(new Date(createdAt?.toDate()).toLocaleString())} */}
          {dateAry[0]}
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
        <Box>
          {infoUserData?.uid === loginUser?.uid ? (
            //他人の投稿は編集できない
            <IconButton
              sx={{ color: "blue" }}
              onClick={() => {
                dispatch(openEditModal());
              }}
            >
              <EditIcon />
            </IconButton>
          ) : (
            ""
          )}
          {isEditOpen.isEditOpen ? <EditInfo id={id} /> : null}
        </Box>
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
