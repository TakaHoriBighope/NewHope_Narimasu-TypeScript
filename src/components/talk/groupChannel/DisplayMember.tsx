import React from "react";
import { Box } from "@mui/material";
import { db } from "../../../firebase";
import {
  getDoc,
  arrayRemove,
  arrayUnion,
  doc,
  updateDoc,
} from "firebase/firestore";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { closeModal } from "../../../redux/features/modalSlice";
import { type User } from "../../../types/user";

// import { setChannelInfo } from "../../../redux/features/channelSlice";
// import Chat from "../chat/Chat";

type Props = {
  user: User;
};

const DisplayMember = (props: Props) => {
  const { user } = props;
  const dispatch = useAppDispatch();

  const channelId = useAppSelector((state) => state.channel.channelId);

  const handleChangeGroupIn = async () => {
    if (user.uid) {
      const groupDocRef = doc(db, "channels", String(channelId));
      await updateDoc(groupDocRef, {
        channelMember: arrayUnion(user.id),
      });
      dispatch(closeModal());
      const docRef = doc(db, "channels", String(channelId));
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        // dispatch(
        //   setChannelInfo({
        //     channelId: id,
        //     channelName: docSnap.data().channelName,
        //     channelProp: docSnap.data().channelProp,
        //     channelMember: docSnap.data().channelMember,
        //   })
        // );
        console.log(docSnap.data().channelMember);
      } else {
        console.log("No such document!");
      }
    }
    // window.location.reload();
  };
  // eslint-disable-next-line
  const handleChangeGroupOut = async () => {
    if (user.uid) {
      const groupOutDocRef = doc(db, "channels", channelId ?? "");
      await updateDoc(groupOutDocRef, {
        channelMember: arrayRemove(user.uid),
      });
    }
    window.location.reload();
  };

  return (
    <Box
      sx={{
        width: "200px",
        fontSize: "1.2rem",
        marginBottom: "-10px",
        cursor: "pointer",
        "&:hover": {
          color: "white",
          backgroundColor: "#88a3cf",
          borderRadius: "7px",
        },
      }}
      onClick={() => handleChangeGroupIn()}
    >
      <p style={{ fontWeight: "650", margin: "5px" }}>{user.username}</p>
    </Box>
  );
};

export default DisplayMember;
