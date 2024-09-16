import { Box, IconButton } from "@mui/material";
import React, { useEffect, useState } from "react";
import { db } from "../../../firebase";
import {
  DocumentData,
  Query,
  collection,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import DisplayMembers from "./DisplayMember";
import { closeModal } from "../../../redux/features/modalSlice";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import CloseIcon from "@mui/icons-material/Close";

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

type Props = {
  channelName: string | null;
};

const DisplayAllmembers = (props: Props) => {
  const { channelName } = props;

  const dispatch = useAppDispatch();

  const channelProp = useAppSelector((state) => state.channel.channelProp);
  const channelMember = useAppSelector((state) => state.channel.channelMember);
  const reduxChannelName = useAppSelector((state) => state.channel.channelName);

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
      <aside
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "rgba(0, 0, 0, 0.5)",
          zIndex: 50,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            background: "#fff",
            width: "80vw",
            maxWidth: "300px",
            borderRadius: "10px",
            padding: "2rem 1rem",
            textAlign: "center",
            zIndex: "100",
          }}
        >
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
              {users.map((user) =>
                channelName === reduxChannelName && user.uid === channelProp ? (
                  ""
                ) : channelMember.includes(user.uid) ? (
                  ""
                ) : (
                  <DisplayMembers user={user} key={user.uid} id={user.uid} />
                )
              )}
            </Box>
          </Box>
          <Box>
            <IconButton
              sx={{ gap: "15px", color: "#7b7c85", marginTop: "30px" }}
            >
              <CloseIcon onClick={() => dispatch(closeModal())} />
            </IconButton>
          </Box>
        </Box>
      </aside>
    </>
  );
};

export default DisplayAllmembers;
