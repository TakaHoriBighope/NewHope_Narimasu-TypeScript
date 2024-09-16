import React, { useEffect, useState } from "react";
import Topbar from "./Topbar";
import { Avatar, Box, Typography } from "@mui/material";
import Sidebar from "../sidebar/Sidebar";
import OtherTimeLine from "./OtherTimeLine";
import Rightbar from "./Rightbar";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { useAppSelector } from "../../redux/hooks";

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

const OtheProfile = () => {
  const user = useAppSelector((state) => state.user.user);
  console.log(user);
  const [currentUserData, setCurrentUserData] = useState<Users>();
  const postingUser = useAppSelector((state) => state.postingUser.uid);
  console.log(postingUser);

  useEffect(() => {
    const fetchUser = async () => {
      const docRef = doc(db, "users", postingUser);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setCurrentUserData({
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
        // docSnap.data() will be undefined in this case
        console.log("No such document!");
      }
    };
    fetchUser();
  }, [postingUser]);

  return (
    <>
      <Topbar />
      <Box sx={{ display: "flex", width: "100%", backgroundColor: "#f8fcff" }}>
        <Sidebar />
        <Box sx={{ flex: 9.5 }}>
          <Box sx={{ position: "relative" }}>
            <img
              src={currentUserData?.coverPicture}
              alt=""
              style={{
                width: "100%",
                height: "250px",
                objectFit: "cover",
                marginBottom: "60px",
              }}
            />
            <Avatar
              src={currentUserData?.profilePicture}
              alt=""
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                height: "60px",
                width: "60px",
                borderRadius: "50%",
                margin: "auto",
                top: "200px",
                border: "2px solid white",
              }}
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginTop: "-50px",
            }}
          >
            <Typography sx={{ fontWeight: 550 }}>
              {currentUserData?.username}
            </Typography>
            <Typography sx={{ fontSize: "13px" }}>
              {currentUserData?.salesTalk}
            </Typography>
          </Box>
          <Box sx={{ display: "flex" }}>
            <OtherTimeLine />
            <Rightbar />
            {/* <Rightbar user={currentUserData} /> */}
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default OtheProfile;
