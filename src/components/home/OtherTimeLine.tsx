import { Box, ListItemButton } from "@mui/material";
import React, { useEffect, useState } from "react";
import {
  DocumentData,
  Query,
  Timestamp,
  collection,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "../../firebase";
import OtherPost from "./OtherPost";
import { useAppSelector } from "../../redux/hooks";

interface Posts {
  createdAt: Timestamp;
  desc: string;
  imgURL: string;
  likes: [];
  uid: string;
}

const OtherTimeLine = () => {
  const [posts, setPosts] = useState<Posts[]>([]);
  const postingUid = useAppSelector((state) => state.postingUser.uid);
  console.log(postingUid);

  // const postData = collection(db, "posts");
  const collectionRef: Query<DocumentData> = query(
    collection(db, "posts"),
    orderBy("createdAt", "desc")
  );

  useEffect(() => {
    // リアルタイムでデータを取得する
    onSnapshot(collectionRef, (querySnapshot) => {
      const postsResults: Posts[] = [];
      querySnapshot.forEach((doc) => {
        postsResults.push({
          uid: doc.data().uid,
          createdAt: doc.data().createdAt,
          desc: doc.data().desc,
          likes: doc.data().likes,
          imgURL: doc.data().imgURL,
        });
      });
      setPosts(postsResults);
      // setPosts(querySnapshot.docs.map((doc) => doc.data()));
    });
    // console.log(posts);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box sx={{ flex: 5.5, maxWidth: 990 }}>
      <Box>
        {posts.map((post) =>
          postingUid === post.uid ? (
            <ListItemButton>
              <OtherPost
                key={post.uid}
                createdAt={post.createdAt}
                desc={post.desc}
                imgURL={post.imgURL}
                likes={post.likes}
                uid={post.uid}
              />
            </ListItemButton>
          ) : (
            ""
          )
        )}
      </Box>
    </Box>
  );
};

export default OtherTimeLine;
