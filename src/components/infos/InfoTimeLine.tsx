import { Box, Fab, ListItemButton } from "@mui/material";
import React, { useEffect, useState } from "react";
import UpInfo from "./UpInfo";
import EditIcon from "@mui/icons-material/Edit";
import { openModal } from "../../redux/features/modalSlice";
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
import ModalShare from "../modal/ModalShare";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { mediaQuery, useMediaQuery } from "../../utiles/useMediaQuery";

interface Infos {
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

const InfoTimeLine = (props: Props) => {
  const { mode } = props;

  const dispatch = useAppDispatch();
  const [infos, setInfos] = useState<Infos[]>([]);
  // const [activeIndex, setActiveIndex] = useState(0);
  const { isOpen } = useAppSelector((state) => state.modal);
  console.log(isOpen);
  const isSp = useMediaQuery(mediaQuery.sp);

  const collectionRef: Query<DocumentData> = query(
    collection(db, "infos"),
    orderBy("createdAt", "desc")
  );

  useEffect(() => {
    const getAllInfos = async () => {
      // リアルタイムでデータを取得する
      onSnapshot(collectionRef, (querySnapshot) => {
        const infosResults: Infos[] = [];
        querySnapshot.forEach((doc) => {
          infosResults.push({
            uid: doc.data().uid,
            createdAt: doc.data().createdAt,
            desc: doc.data().desc,
            likes: doc.data().likes,
            imgURL: doc.data().imgURL,
            id: doc.id,
          });
        });
        setInfos(infosResults);
      });
    };
    getAllInfos();
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
              <UpInfo info={info} key={info.uid} id={info.id} />
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
            <UpInfo info={info} key={info.uid} id={info.id} />
          </ListItemButton>
        ))}
      </Box>
    </Box>
  );
};

export default InfoTimeLine;
