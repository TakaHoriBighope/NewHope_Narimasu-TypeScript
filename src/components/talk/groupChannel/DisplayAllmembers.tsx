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
import CloseFullscreenIcon from "@mui/icons-material/CloseFullscreen";
import { type User } from "../../../types/user";

type Props = {
  channelName: string | null;
};

const DisplayAllmembers = (props: Props) => {
  const { channelName } = props;

  const dispatch = useAppDispatch();

  const channelProp = useAppSelector((state) => state.channel.channelProp);
  const channelMember = useAppSelector((state) => state.channel.channelMember);
  const reduxChannelName = useAppSelector((state) => state.channel.channelName);

  const [users, setUsers] = useState<User[]>([]);
  const collectionRef: Query<DocumentData> = query(
    collection(db, "users"),
    orderBy("createdAt", "desc")
  );
  useEffect(() => {
    // リアルタイムでデータを取得する
    onSnapshot(collectionRef, (querySnapshot) => {
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
                  <DisplayMembers user={user} key={user.uid} />
                )
              )}
            </Box>
          </Box>
          <Box>
            <IconButton
              sx={{ gap: "15px", color: "#2c517c", marginTop: "30px" }}
            >
              <CloseFullscreenIcon onClick={() => dispatch(closeModal())} />
            </IconButton>
          </Box>
        </Box>
      </aside>
    </>
  );
};

export default DisplayAllmembers;
