import React, { useEffect, useState } from "react";
import Topbar from "../components/home/Topbar";
import { Avatar, Box, Typography } from "@mui/material";
import Sidebar from "../components/sidebar/Sidebar";
import TimeLine from "../components/home/TimeLine";
import Rightbar from "../components/home/Rightbar";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { setDisplayName } from "../redux/features/displayNameSlice";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../redux/hooks";
// import { CurrentUser } from "../Types";

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

const Profile = () => {
  const [currentUserData, setCurrentUserData] = useState<Users>();

  const dispatch = useDispatch();
  const postingUid = useAppSelector((state) => state.postingUser.uid);
  console.log(postingUid);

  useEffect(() => {
    const fetchUser = async () => {
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          const uid = user.uid;
          const docRef = doc(db, "users", uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            console.log(docSnap.data());
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
            dispatch(setDisplayName(docSnap.data().username));
          } else {
            console.log("No such document!33");
          }
        } else {
          console.log("User is signed out");
        }
      });
    };
    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Topbar />
      <Box sx={{ display: "flex", width: "100%", backgroundColor: "#f8fcff" }}>
        <Sidebar />
        <Box sx={{ flex: 9.5 }}>
          <Box sx={{ position: "relative" }}>
            <img
              src={currentUserData?.coverPicture || "/post/beach.jpg "}
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
            {/* <TimeLine username={currentUserData?.username} />
            <Rightbar user={currentUserData} /> */}
            <TimeLine mode="profile" />
            <Rightbar />
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Profile;
