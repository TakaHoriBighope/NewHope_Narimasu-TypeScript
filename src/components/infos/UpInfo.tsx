import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import { Box, IconButton, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { format } from "timeago.js";
import { auth, db } from "../../firebase";
import { Timestamp, deleteDoc, doc, getDoc } from "firebase/firestore";
import { useAppSelector } from "../../redux/hooks";

interface infoProps {
  id: string;
  info: {
    createdAt: Timestamp;
    desc: string;
    imgURL: string;
    likes: string[];
    uid: string;
  };
}

type Users = {
  uid: string;
  coverPicture: string;
  createdAt: string;
  followers: string[];
  followings: string[];
  profilePicture: string;
  salesTalk: string;
  updatedAt: string;
  username: string;
};

const UpInfo = (props: infoProps) => {
  const { id, info } = props;

  const displayName = useAppSelector((state) => state.displayName);
  const [infoUserData, setInfoUserData] = useState<Users>();
  console.log(displayName);
  const loginUser = auth.currentUser;

  useEffect(() => {
    //ingoしたユーザーDataをget
    const fetchUser = async () => {
      const docRef = doc(db, "users", info.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setInfoUserData({
          uid: docSnap.data().uid,
          coverPicture: docSnap.data().coverPicture,
          createdAt: docSnap.data().createdAt,
          followers: docSnap.data().followers,
          followings: docSnap.data().followings,
          profilePicture: docSnap.data().profilePicture,
          salesTalk: docSnap.data().salesTalk,
          updatedAt: docSnap.data().updatedAt,
          username: docSnap.data().username,
        });
      } else {
        console.log("No such document!");
      }
    };
    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [info.uid]);

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
            {format(new Date(info.createdAt?.toDate()).toLocaleString())}
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
        <Typography sx={{ mb: 0.5, fontSize: "0.8rem" }}>
          {info.desc}
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <img
            src={info.imgURL}
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
