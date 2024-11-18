import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Divider,
  List,
  ListItemButton,
  TextField,
  Typography,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { useTranslation } from "react-i18next";
import CloseFullscreenIcon from "@mui/icons-material/CloseFullscreen";
import { closeEditModal } from "../../redux/features/editModalSlice";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { auth, db } from "../../firebase";
import { doc, getDoc, updateDoc, Timestamp } from "firebase/firestore";
import { type Post } from "../../types/post";

type Props = {
  id: string;
};

const EditShare = (props: Props) => {
  const { id } = props;
  console.log("to Edit:", id);
  // const [inputText, setInputText] = useState<string>("");
  // eslint-disable-next-line
  const { t, i18n } = useTranslation();
  const lang = useAppSelector((state) => state.lang);
  const dispatch = useAppDispatch();
  // const user = useAppSelector((state) => state.user.user);
  // const dis_id = useAppSelector((state) => state.postingUser.id);
  const [post, setPost] = useState<Post>({
    id: "",
    desc: "",
    createdAt: Timestamp.fromDate(new Date()),
    imgURL: "",
    likes: [],
    uid: "",
    username: "",
    read: [],
  });

  useEffect(() => {
    i18n.changeLanguage(lang.lang);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang, i18n]);

  useEffect(() => {
    if (auth.currentUser === null) {
      return;
    }
    const ref = doc(db, "posts", id);
    getDoc(ref)
      .then((shareDocRef) => {
        const { desc, imgURL, uid, likes, createdAt, username, read } =
          shareDocRef.data() as Post;
        setPost({
          id: shareDocRef.id,
          desc,
          imgURL,
          uid,
          likes,
          createdAt,
          username,
          read,
        });
      })
      .catch((error) => {
        console.log(error);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async () => {
    // e.preventDefault();
    if (auth.currentUser === null) {
      return;
    }
    const ref = doc(db, "posts", id);
    updateDoc(ref, {
      desc: post.desc,
      createdAt: Timestamp.fromDate(new Date()),
    })
      .then(() => {
        dispatch(closeEditModal());
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
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
          maxWidth: "500px",
          borderRadius: "10px",
          padding: "2rem 1rem",
          textAlign: "center",
          zIndex: "100",
        }}
      >
        <Box
          component="form"
          onSubmit={() => handleSubmit()}
          sx={{
            display: "flex",
            width: "100%",
            alignItems: "center",
          }}
        >
          <Box sx={{ width: "500px" }}>
            <TextField
              id="desc"
              type="text"
              name="desc"
              placeholder=""
              variant="outlined"
              fullWidth
              multiline
              rows={10}
              value={post?.desc}
              sx={{
                ".MuiOutlinedInput-input": { padding: 0 },
                ".MuiOutlinedInput-notchedOutline": { border: "none" },
                ".MuiOutlinedInput-root": {
                  fontSize: "0.9rem",
                  fontWeight: "500",
                  marginTop: "-10px",
                },
              }}
              onChange={(text: React.ChangeEvent<HTMLInputElement>) =>
                setPost({ ...post, desc: text.target.value })
              }
            />

            <Divider sx={{ margin: "0 15px ", marginTop: "3px" }} />
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <List sx={{ display: "flex" }}>
                <ListItemButton>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      marginright: "12px",
                      cursor: "pointer",
                    }}
                  >
                    <Typography sx={{ fontSize: "15px", color: "gray" }}>
                      id:{id}
                    </Typography>
                    <Typography sx={{ fontSize: "15px", color: "gray" }}>
                      {post.username}
                    </Typography>
                  </Box>
                </ListItemButton>
              </List>
              <Box>
                <Button sx={{ color: "blue" }} type="submit">
                  <UploadFileIcon />
                </Button>
                <Button
                  sx={{ color: "#2c517c" }}
                  onClick={() => {
                    dispatch(closeEditModal());
                  }}
                >
                  <CloseFullscreenIcon />
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </aside>
  );
};

export default EditShare;
