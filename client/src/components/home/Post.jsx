import { Favorite } from "@mui/icons-material";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import { Avatar, Box, Button, IconButton, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { format } from "timeago.js";
import { Link } from "react-router-dom";
import { setPost } from "../../redux/features/postSlice";
import GTranslateIcon from "@mui/icons-material/GTranslate";

const Post = ({ post }) => {
  const PUBLIC_FOLDER = process.env.REACT_APP_PUBLIC_FOLDER;

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [like, setLike] = useState(post.likes.length);
  const [isLiked, setIsLiked] = useState(false);
  const [user, setUser] = useState({}); //postの一時的user
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState(null);
  const currentUser = useSelector((state) => state.user.value); //グローバルuser
  // const posts = useSelector((state) => state.post.value); //グローバルpost

  useEffect(() => {
    //postしたユーザーのprofilePictureを表示するために
    const fetchUser = async () => {
      await axios.get(`/users?userId=${post.userId}`).then((response) => {
        setUser(response.data);
      });
      // const response = await postApi.getOne(`${post.userId}`);
    };
    fetchUser();
  }, [post.userId]);

  useEffect(() => {
    const getPosts = async () => {
      await axios.get(`/posts/timeline/${post.userId}`).then((response) => {
        setUsers(response.data);
      });
      // const res = await postApi.get(`${post.userId}`);
      if (!users) {
        navigate("/");
      } else {
        dispatch(setPost(users));
      }
    };
    getPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, navigate, post.userId]);

  const handleLike = async () => {
    try {
      //いいねのAPIを叩いていく
      await axios.put(`/posts/${post._id}/like`, {
        userId: currentUser._id,
      });
    } catch (error) {
      console.log(error);
    }
    setLike(isLiked ? like - 1 : like + 1);
    setIsLiked(!isLiked);
  };

  const deletePost = async () => {
    console.log(currentUser);
    console.log(post._id);
    console.log(posts);
    try {
      await axios.delete(`/posts/${post._id}`).then(() => {
        console.log("Post deleted!");
        setPosts(null);
        window.location.reload();
      });
      // const deletedPost = await postApi.delete(`${post._id}`);
      console.log(posts);

      // const newPosts = posts.filter((e) => e._id !== post._id); //削除
      // console.log(newPosts);

      // const totalPosts = [newPosts, ...posts];
      // dispatch(setPost(totalPosts));
      // window.location.reload();

      // if (posts === null) {
      //   navigate("/");
      // } else {
      //   navigate(`/posts/${posts[0]._id}`);
      // }
    } catch (error) {
      alert(`個人投稿を削除 + ${error}`);
    }
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
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Link to={`/profile/${user.username}`}>
            <Avatar src={PUBLIC_FOLDER + user.profilePicture} alt="" />
          </Link>
          <Typography sx={{ pl: 2, fontSize: "15px", fontWeight: 550 }}>
            {user.username}
          </Typography>
          <Typography sx={{ pl: 4, fontSize: "small" }}>
            {format(post.createdAt)}
          </Typography>
        </Box>
        {currentUser._id === post.userId ? (
          //他人の投稿は削除できない
          <IconButton
            variant="outlined"
            color="error"
            onClick={() => deletePost()}
          >
            <DeleteOutlinedIcon />
          </IconButton>
        ) : (
          ""
        )}
      </Box>
      <Box sx={{ p: 1 }}>
        <Typography sx={{ mb: 0.5, fontSize: "small" }}>{post.desc}</Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <img
            src={PUBLIC_FOLDER + post.img}
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
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton onClick={() => handleLike()}>
            <Favorite htmlColor="red" sx={{ fontSize: "small" }} />
          </IconButton>
          <Typography sx={{ fontSize: "small" }}>
            {like}人がいいねを押しました
          </Typography>
        </Box>
        <Button>
          <IconButton sx={{ fontSize: "medium", mr: 2 }}>
            <GTranslateIcon />
          </IconButton>
          <Typography variant="body1" fontSize="small" fontWeight="550">
            {post.comment} 感 謝
          </Typography>
        </Button>
      </Box>
    </Box>
  );
};

export default Post;
