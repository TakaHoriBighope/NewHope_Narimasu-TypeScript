import React, { useEffect, useState } from "react";
import InfoList from "../info/InfoList";
import { Box, IconButton, Typography } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import { useTranslation } from "react-i18next";
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
// import { useAppSelector } from "../../redux/hooks";
// import { mediaQuery, useMediaQuery } from "../../utiles/useMediaQuery";

interface Infos {
  id: string;
  createdAt: Timestamp;
  desc: string;
  imgURL: string;
  likes: [];
  uid: string;
}

const Rightbar = () => {
  // const isSp = useMediaQuery(mediaQuery.sp);
  // const loginUser = useAppSelector((state) => state.user.user);

  // const HomeRightbar = () => {
  const [infos, setInfos] = useState<Infos[]>([]);

  const [t] = useTranslation();

  useEffect(() => {
    const collectionRef: Query<DocumentData> = query(
      collection(db, "infos"),
      orderBy("createdAt", "desc")
    );
    // リアルタイムでデータを取得する
    onSnapshot(collectionRef, (querySnapshot) => {
      const infosResults: Infos[] = [];
      querySnapshot.forEach((doc) => {
        infosResults.push({
          id: doc.data().id,
          uid: doc.data().uid,
          createdAt: doc.data().createdAt,
          desc: doc.data().desc,
          likes: doc.data().likes,
          imgURL: doc.data().imgURL,
        });
      });
      setInfos(infosResults);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box
      sx={{
        p: 2,
        flex: 4,
        maxWidth: 680,
      }}
    >
      {/* <HomeRightbar /> */}
      <Box sx={{ flex: 4, maxWidth: 500 }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton>
            <StarIcon sx={{ fontSize: "25px", color: "blueviolet" }} />
          </IconButton>
          <Typography sx={{ fontWeight: "700", fontSize: "20px" }}>
            {t("NH成増からのお知らせ")}
          </Typography>
        </Box>
        {infos.map((info) => (
          <InfoList info={info} key={info.uid} />
        ))}
      </Box>
    </Box>
  );
};

export default Rightbar;
