import { Favorite } from "@mui/icons-material";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import { Avatar, Box, Button, Typography } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import React, { useEffect, useState } from "react";
import { format } from "timeago.js";
import GTranslateIcon from "@mui/icons-material/GTranslate";
import { auth, db } from "../../firebase";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { type Post } from "../../types/post";
import { type User } from "../../types/user";
// import { useNavigate } from "react-router-dom";
// import { setPostingUser } from "../../redux/features/postingSlice";
// import { useAppDispatch } from "../../redux/hooks";

type Props = {
  post: Post;
};

const ShareList = (props: Props) => {
  const { post } = props;
  const { id, desc, imgURL, likes, uid, createdAt } = post;

  // const dispatch = useAppDispatch();
  const [like, setLike] = useState<number>(likes.length);
  const [isLiked, setIsLiked] = useState(false);
  const [postingUserData, setPostingUserData] = useState<User>();
  const loginUser = auth.currentUser;
  // const navigate = useNavigate();

  useEffect(() => {
    //postしたユーザーのDataをget
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
        setPostingUserData({
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
  }, [uid]);

  const handleLike = async () => {
    const postLikeRef = doc(db, "posts", uid);
    await updateDoc(postLikeRef, {
      likes: uid,
    });
    setLike(isLiked ? like - 1 : like + 1);
    setIsLiked(!isLiked);
  };

  const deletePost = async (id: string) => {
    if (auth.currentUser === null) {
      return;
    }
    const ref = doc(db, "posts", id);
    deleteDoc(ref).catch(() => {
      console.log("faild");
    });
  };

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
      <Box
        sx={{
          p: 2,
          // display: "flex",
          // alignItems: "center",
          // justifyContent: "space-between",
        }}
      >
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
            <Avatar
              src={postingUserData?.profilePicture}
              alt=""
              // onClick={() => handleClickToOtherProfile()}
            />
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
                {/* {format(createdAt.toDate())} */}
                {format(new Date(createdAt?.toDate()).toLocaleString())}
              </Typography>
            </Box>
            {postingUserData?.uid === loginUser?.uid ? (
              //他人の投稿は削除できない
              <IconButton sx={{ color: "red" }} onClick={() => deletePost(id)}>
                <DeleteOutlinedIcon />
              </IconButton>
            ) : (
              ""
            )}
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
          <IconButton onClick={() => handleLike()}>
            <Favorite htmlColor="red" sx={{ fontSize: "small" }} />
          </IconButton>
          <Typography sx={{ fontSize: "small" }}>{like}</Typography>
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

export default ShareList;