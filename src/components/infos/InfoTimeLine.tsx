import { Box, Fab, ListItemButton } from "@mui/material";
import React, { useEffect, useState } from "react";
import UpInfo from "./UpInfo";
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
import ModalShare from "../modal/ModalShare";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { mediaQuery, useMediaQuery } from "../../utiles/useMediaQuery";
import { type Info } from "../../types/info";

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
          {isOpen && <ModalShare mode="infos" />}
          {infos.map((info) => (
            <ListItemButton>
              <UpInfo info={info} key={info.uid} />
            </ListItemButton>
          ))}
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
        {isOpen && <ModalShare mode="infos" />}
        {infos.map((info) => (
          <ListItemButton>
            <UpInfo info={info} key={info.uid} />
          </ListItemButton>
        ))}
      </Box>
    </Box>
  );
};

export default InfoTimeLine;
