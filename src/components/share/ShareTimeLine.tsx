import { Box, Fab, ListItemButton } from "@mui/material";
import React, { useEffect, useState } from "react";
import ShareList from "./ShareList";
import { openModal } from "../../redux/features/modalSlice";
import EditIcon from "@mui/icons-material/Edit";
import ModalShare from "../share/ModalShare";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { doc, getDoc, orderBy } from "firebase/firestore";
import { db } from "../../firebase";
import {
  DocumentData,
  Query,
  collection,
  onSnapshot,
  query,
} from "firebase/firestore";
import { mediaQuery, useMediaQuery } from "../../utiles/useMediaQuery";
import PeopleIcon from "@mui/icons-material/People";
import { openSelectPosterModal } from "../../redux/features/selectPosterModalSlice";
import SelectPoster from "../sidebar/SelectPoster";
import { type Post } from "../../types/post";

type Users = {
  uid: string;
  coverPicture: string;
  createdAt: string;
  followers: string[];
  followings: string[];
  profilePicture: string;
  salesTalk: string;
  updatedAt: string;
  username: string;
};

const ShareTimeLine = () => {
  const dispatch = useAppDispatch();
  const isSelectPosterOpen = useAppSelector((state) => state.selectPosterModal);
  console.log(isSelectPosterOpen);
  const isOpen = useAppSelector((state) => state.modal);
  console.log(isOpen);
  const isSp = useMediaQuery(mediaQuery.sp);

  //ログインしているユーザー(uid, email address, username(displayName))
  const loginUser = useAppSelector((state) => state.user.user);

  //ログインしているユーザーデーターを取ってくる（followingsの状態が必要）
  const [loginUserData, setLoginUserData] = useState<Users>();
  useEffect(() => {
    const fetchUser = async () => {
      const uid = loginUser?.uid;
      console.log(uid);
      if (uid) {
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setLoginUserData({
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
          console.log("No such document!33");
        }
      }
    };
    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loginUser]);

  // リアルタイムでpostsデータを取得する
  const [posts, setPosts] = useState<Post[]>([]);
  const collectionRef: Query<DocumentData> = query(
    collection(db, "posts"),
    orderBy("createdAt", "desc")
  );
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collectionRef,
      (querySnapshot) => {
        const postsResults: Post[] = [];
        querySnapshot.forEach((doc) => {
          const { desc, imgURL, uid, likes, createdAt, username, read } =
            doc.data() as Post;
          postsResults.push({
            id: doc.id,
            desc,
            imgURL,
            uid,
            likes,
            createdAt,
            username,
            read,
          });
        });
        setPosts(postsResults);
      },
      (error) => {
        // console.log("onSnapshot at Share", error);
      }
    );
    return () => {
      unsubscribe(); // ← 追加
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isSp) {
    return (
      <Box>
        <Box>
          <Fab
            size="small"
            aria-label="edit"
            sx={{
              color: "#2c517c",
              position: "fixed",
              top: 45,
              right: 20,
              zIndex: "1",
            }}
            onClick={() => dispatch(openSelectPosterModal())}
          >
            <PeopleIcon />
          </Fab>
          <Fab
            size="small"
            color="secondary"
            aria-label="edit"
            sx={{ position: "fixed", bottom: 20, right: 20, zIndex: "1" }}
            onClick={() => dispatch(openModal())}
          >
            <EditIcon />
          </Fab>
          {isSelectPosterOpen.isSelectPosterOpen ? <SelectPoster /> : null}
          {isOpen.isOpen ? <ModalShare mode="posts" /> : null}
          {posts.map((post) =>
            loginUserData?.followings?.includes(post.uid) ? ( //homeで表示する
              <ListItemButton>
                <ShareList key={post.uid} post={post} />
              </ListItemButton>
            ) : (
              ""
            )
          )}
        </Box>
      </Box>
    );
  }
  return (
    <Box sx={{ flex: 4, maxWidth: 790 }}>
      <Box>
        <Fab
          size="small"
          color="secondary"
          aria-label="edit"
          sx={{ position: "fixed", bottom: 20, left: 200 }}
          onClick={() => dispatch(openModal())}
        >
          <EditIcon />
        </Fab>
        {isOpen.isOpen ? <ModalShare mode="posts" /> : null}
        {posts.map((post) =>
          loginUserData?.followings?.includes(post.uid) ? ( //homeで表示する
            <ListItemButton>
              <ShareList key={post.uid} post={post} />
            </ListItemButton>
          ) : (
            ""
          )
        )}
      </Box>
    </Box>
  );
};

export default ShareTimeLine;
