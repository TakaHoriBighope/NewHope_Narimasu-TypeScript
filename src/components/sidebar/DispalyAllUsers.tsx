import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import DispFollower from "./DispFollower";
import { db } from "../../firebase";
import { type User } from "../../types/user";
import {
  DocumentData,
  Query,
  collection,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";

const DisplayAllUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  // リアルタイムでデータを取得する
  const collectionRef: Query<DocumentData> = query(
    collection(db, "users"),
    orderBy("createdAt", "desc")
  );
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collectionRef,
      (querySnapshot) => {
        const usersResults: User[] = [];
        querySnapshot.forEach((doc) => {
          usersResults.push({
            uid: doc.data().uid,
            email: doc.data().email,
            coverPicture: doc.data().coverPicture,
            profilePicture: doc.data().profilePicture,
            followers: doc.data().followers,
            followings: doc.data().followings,
            createdAt: doc.data().createdAt,
            updatedAt: doc.data().uodatedAt,
            salesTalk: doc.data().salesTalk,
            username: doc.data().username,
          });
        });
        setUsers(usersResults);
      },
      (error) => {
        // console.log("onSnapshot:", error);
      }
    );
    return () => {
      unsubscribe(); // ← 追加
    };
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
