import {
  Box,
  Fab,
  ListItemButton,
  IconButton,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import StarIcon from "@mui/icons-material/Star";
// import UpInfo from "./UpInfo";
import InfoList from "./InfoList";
import EditIcon from "@mui/icons-material/Edit";
import { openModal } from "../../redux/features/modalSlice";
import {
  DocumentData,
  Query,
  collection,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "../../firebase";
import CreateInform from "../info/CreateInform";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { mediaQuery, useMediaQuery } from "../../utiles/useMediaQuery";
import { type Info } from "../../types/info";
import { useTranslation } from "react-i18next";

type Props = {
  mode: string;
};

const InfoTimeLine = (props: Props) => {
  const { mode } = props;

  const dispatch = useAppDispatch();
  const [infos, setInfos] = useState<Info[]>([]);
  // const [activeIndex, setActiveIndex] = useState(0);
  const { isOpen } = useAppSelector((state) => state.modal);
  console.log(isOpen);
  const isSp = useMediaQuery(mediaQuery.sp);

  const [t] = useTranslation();

  // リアルタイムでinfoデータを取得する
  const collectionRef: Query<DocumentData> = query(
    collection(db, "infos"),
    orderBy("createdAt", "desc")
  );
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collectionRef,
      (querySnapshot) => {
        const infosResults: Info[] = [];
        querySnapshot.forEach((doc) => {
          const { desc, imgURL, likes, uid, createdAt, read } =
            doc.data() as Info;
          infosResults.push({
            id: doc.id,
            desc,
            imgURL,
            likes,
            uid,
            createdAt,
            read,
          });
        });
        setInfos(infosResults);
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
          {mode === "main" ? (
            <Fab
              size="small"
              color="secondary"
              aria-label="edit"
              sx={{ position: "fixed", bottom: 20, right: 20 }}
              onClick={() => dispatch(openModal())}
            >
              <EditIcon />
            </Fab>
          ) : (
            ""
          )}
          {isOpen && <CreateInform />}
          {infos.map((info) => (
            <ListItemButton>
              <InfoList info={info} key={info.uid} id={info.id} />
            </ListItemButton>
          ))}
        </Box>
      </Box>
    );
  }
  return (
    <Box
      sx={{
        p: 2,
        flex: 4,
        maxWidth: 680,
      }}
    >
      <Box sx={{ flex: 4, maxWidth: 500 }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton>
            <StarIcon sx={{ fontSize: "25px", color: "blueviolet" }} />
          </IconButton>
          <Typography sx={{ fontWeight: "700", fontSize: "20px" }}>
            {t("NH成増からのお知らせ")}
          </Typography>
        </Box>
        <Box>
          <Fab
            size="small"
            color="secondary"
            aria-label="edit"
            sx={{ position: "fixed", bottom: 20, right: 200 }}
            onClick={() => dispatch(openModal())}
          >
            <EditIcon />
          </Fab>
          {isOpen && <CreateInform />}
          {infos.map((info) => (
            <ListItemButton>
              {/* <UpInfo info={info} key={info.uid} /> */}
              <InfoList info={info} key={info.uid} id={info.id} />
            </ListItemButton>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default InfoTimeLine;
