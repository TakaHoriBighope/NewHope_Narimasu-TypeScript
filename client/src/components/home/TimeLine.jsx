import { Box, Fab } from "@mui/material";
import React, { useEffect, useState } from "react";
import Post from "./Post";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { openModal } from "../../redux/features/modalSlice";
import EditIcon from "@mui/icons-material/Edit";
import ModalShare from "../modal/ModalShare";

const TimeLine = ({ username }) => {
  const currentUser = useSelector((state) => state.user.value);
  console.log(`TimeLine useSelector:${currentUser.username}`);
  const [posts, setPosts] = useState([]);
  const dispatch = useDispatch();

  const { isOpen } = useSelector((state) => state.modal);

  useEffect(() => {
    const fetchPosts = async () => {
      console.log(`TimeLine useEffect:${currentUser.username}`);
      if (!currentUser._id) {
        return;
      }
      username
        ? await axios.get(`/posts/profile/${username}`).then((res) => {
            setPosts(
              res.data.slice().sort((post1, post2) => {
                return new Date(post2.createdAt) - new Date(post1.createdAt);
              })
            );
          }) //プロファイル
        : await axios.get(`/posts/timeline/${currentUser._id}`).then((res) => {
            setPosts(
              res.data.slice().sort((post1, post2) => {
                return new Date(post2.createdAt) - new Date(post1.createdAt);
              })
            );
          }); //ホーム
    };
    fetchPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username, currentUser]);

  return (
    <Box sx={{ flex: 5.5, maxWidth: 990 }}>
      <Box>
        {currentUser.username === username ? (
          ""
        ) : (
          <Fab
            size="small"
            color="secondary"
            aria-label="edit"
            sx={{ position: "fixed", bottom: 20, left: 200 }}
            onClick={() => dispatch(openModal())}
          >
            <EditIcon />
          </Fab>
        )}
        {isOpen && <ModalShare />}
        {posts.map((post) => (
          <Post post={post} key={post._id} />
        ))}
      </Box>
    </Box>
  );
};

export default TimeLine;
