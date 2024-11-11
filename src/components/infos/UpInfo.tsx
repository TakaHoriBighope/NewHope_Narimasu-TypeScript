import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import { Box, IconButton, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { format } from "timeago.js";
import { auth, db } from "../../firebase";
import { deleteDoc, doc, getDoc } from "firebase/firestore";
import { useAppSelector } from "../../redux/hooks";
import { type User } from "../../types/user";
import { type Info } from "../../types/info";

type Props = {
  info: Info;
};

const UpInfo = (props: Props) => {
  const { info } = props;
  const { id, desc, imgURL, uid, createdAt } = info;

  const displayName = useAppSelector((state) => state.displayName);
  const [infoUserData, setInfoUserData] = useState<User>();
  console.log(displayName);
  const loginUser = auth.currentUser;

  useEffect(() => {
    //infoしたユーザーDataをget
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

  const deleteInfo = async () => {
    await deleteDoc(doc(db, "infos", id));
  };

  return (
    <Box
      sx={{
        p: 2,
        maxWidth: 560,
        borderRadius: "10px",
        margin: "1px 0 1px 5px",
        boxShadow: "0px 3px 10px 0px rgba(0, 0, 0, 0.2)",
      }}
    >
      <Box
        sx={{
          p: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography sx={{ pl: 2, fontWeight: "550" }}>
            {infoUserData?.username}
            {/* {displayName} */}
          </Typography>
          <Typography sx={{ pl: 5, fontSize: "small" }}>
            {format(new Date(createdAt?.toDate()).toLocaleString())}
          </Typography>
        </Box>
        {infoUserData?.uid === loginUser?.uid ? (
          //他人の投稿は削除できない
          <IconButton sx={{ color: "red" }} onClick={() => deleteInfo()}>
            <DeleteOutlinedIcon />
          </IconButton>
        ) : (
          ""
        )}
      </Box>
      <Box sx={{ p: 1 }}>
        <Typography sx={{ mb: 0.5, fontSize: "0.8rem" }}>{desc}</Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <img
            src={imgURL}
            alt=""
            style={{
              width: "100%",
              maxHeight: "250px",
              marginTop: "10px",
              objectFit: "contain",
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default UpInfo;
