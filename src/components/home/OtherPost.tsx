import { Avatar, Box, Button, IconButton, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
// import { format } from "timeago.js";
import GTranslateIcon from "@mui/icons-material/GTranslate";
import { db } from "../../firebase";
import { Timestamp, doc, getDoc } from "firebase/firestore";

type Props = {
  createdAt: Timestamp;
  desc: string;
  imgURL: string;
  likes: [];
  uid: string;
};

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

const OtherPost = (props: Props) => {
  const { createdAt, desc, imgURL, likes, uid } = props;
  // const [like, setLike] = useState(likes.length);
  const [postingUserData, setPostingUserData] = useState<Users>();

  useEffect(() => {
    //postしたユーザーのDataをget
    const fetchUser = async () => {
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setPostingUserData({
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
        // console.log(postingUserData.profilePicture);
      } else {
        console.log("No such document!");
      }
    };
    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box
      sx={{
        p: 2,
        maxWidth: 560,
        boxShadow: "0px 3px 10px 0px rgba(0, 0, 0, 0.2)",
        borderRadius: "10px",
        margin: "15px 0 15px 10px",
      }}
    >
      <Box sx={{ p: 2 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <Avatar src={postingUserData?.profilePicture} alt="" />
            <Typography sx={{ pl: 2, fontSize: "15px", fontWeight: 550 }}>
              {postingUserData?.username}
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                // justifyContent: "space-between",
              }}
            >
              <Typography sx={{ pl: 4, fontSize: "small", fontWeight: 550 }}>
                {/* {format(createdAt)} */}
                {new Date(createdAt?.toDate()).toLocaleString()}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
      <Box sx={{ p: 1 }}>
        <Typography sx={{ mb: 0.5, fontSize: "small" }}>{desc}</Typography>
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
              marginTop: "10px",
              width: "100%",
              maxHeight: "250px",
              objectFit: "contain",
            }}
          />
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <Typography sx={{ fontSize: "small" }}>{likes}</Typography>
        </Box>
        <Box>
          <IconButton sx={{ fontSize: "medium", mr: 2 }}>
            <GTranslateIcon />
          </IconButton>
          <Button>
            <Typography
              variant="body1"
              fontSize="small"
              fontWeight="550"
              marginLeft="15px"
            >
              {/* {post.comment} 感 謝 */}
            </Typography>
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default OtherPost;
