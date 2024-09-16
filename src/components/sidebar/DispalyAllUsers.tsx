import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import DispFollower from "./DispFollower";
import { db } from "../../firebase";
import {
  DocumentData,
  Query,
  collection,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";

type Users = {
  uid: string;
  coverPicture: string;
  createdAt: string;
  followers: [];
  followings: [];
  profilePicture: string;
  salesTalk: string;
  updatedAt: string;
  username: string;
};

const DisplayAllUsers = () => {
  const [users, setUsers] = useState<Users[]>([]);
  const collectionRef: Query<DocumentData> = query(
    collection(db, "users"),
    orderBy("createdAt", "desc")
  );

  useEffect(() => {
    // リアルタイムでデータを取得する
    onSnapshot(collectionRef, (querySnapshot) => {
      const usersResults: Users[] = [];
      querySnapshot.forEach((doc) => {
        usersResults.push({
          uid: doc.data().uid,
          coverPicture: doc.data().coverPicture,
          createdAt: doc.data().createdAt,
          followers: doc.data().followers,
          followings: doc.data().followings,
          profilePicture: doc.data().profilePicture,
          salesTalk: doc.data().salesTalk,
          updatedAt: doc.data().updatedAt,
          username: doc.data().username,
        });
      });
      setUsers(usersResults);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          maxHeight: 560,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginLeft: "20px",
          }}
        >
          {users.map((user) => (
            <DispFollower user={user} key={user.uid} />
          ))}
        </Box>
      </Box>
    </>
  );
};

export default DisplayAllUsers;
