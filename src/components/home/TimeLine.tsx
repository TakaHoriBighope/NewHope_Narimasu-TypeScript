import { Box, Fab, ListItemButton } from "@mui/material";
import React, { useEffect, useState } from "react";
import Post from "./Post";
import { openModal } from "../../redux/features/modalSlice";
import EditIcon from "@mui/icons-material/Edit";
import ModalShare from "../modal/ModalShare";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { doc, getDoc, orderBy } from "firebase/firestore";
import { db } from "../../firebase";
import {
  DocumentData,
  Query,
  Timestamp,
  collection,
  onSnapshot,
  query,
} from "firebase/firestore";
import { mediaQuery, useMediaQuery } from "../../utiles/useMediaQuery";
import PeopleIcon from "@mui/icons-material/People";
import { openSelectPosterModal } from "../../redux/features/selectPosterModalSlice";
import SelectPoster from "../sidebar/SelectPoster";

interface Posts {
  createdAt: Timestamp;
  desc: string;
  imgURL: string;
  likes: string[];
  uid: string;
  id: string;
}

type Props = {
  mode: string;
};

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

const TimeLine = (props: Props) => {
  const { mode } = props;
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
  const [posts, setPosts] = useState<Posts[]>([]);
  const collectionRef: Query<DocumentData> = query(
    collection(db, "posts"),
    orderBy("createdAt", "desc")
  );
  useEffect(() => {
    onSnapshot(collectionRef, (querySnapshot) => {
      const postsResults: Posts[] = [];
      querySnapshot.forEach((doc) => {
        postsResults.push({
          uid: doc.data().uid,
          createdAt: doc.data().createdAt,
          desc: doc.data().desc,
          likes: doc.data().likes,
          imgURL: doc.data().imgURL,
          id: doc.id,
        });
      });
      setPosts(postsResults);
    });
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
            mode === "profile" ? ( //profileで表示する
              loginUser?.uid === post.uid ? ( //profileで表示する
                <ListItemButton>
                  <Post key={post.uid} post={post} id={post.id} />
                </ListItemButton>
              ) : (
                ""
              )
            ) : loginUserData?.followings?.includes(post.uid) ? ( //homeで表示する
              <ListItemButton>
                <Post key={post.uid} post={post} id={post.id} />
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
          mode === "profile" ? ( //profileで表示する
            loginUser?.uid === post.uid ? ( //profileで表示する
              <ListItemButton>
                <Post key={post.uid} post={post} id={post.id} />
              </ListItemButton>
            ) : (
              ""
            )
          ) : loginUserData?.followings?.includes(post.uid) ? ( //homeで表示する
            <ListItemButton>
              <Post key={post.uid} post={post} id={post.id} />
            </ListItemButton>
          ) : (
            ""
          )
        )}
      </Box>
    </Box>
  );
};

export default TimeLine;
