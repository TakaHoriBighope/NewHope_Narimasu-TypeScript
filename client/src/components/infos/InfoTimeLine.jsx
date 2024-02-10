import { Box, Fab, ListItemButton } from "@mui/material";
import React, { useEffect, useState } from "react";
import UpInfo from "./UpInfo";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import EditIcon from "@mui/icons-material/Edit";
import { openModal } from "../../redux/features/modalSlice";
import ModalInform from "../modal/ModalInform";
import i18n from "i18next";
// import { useTranslation } from "react-i18next";
import { initReactI18next } from "react-i18next";
import jaJson from "../locales/ja.json";
import enJson from "../locales/en.json";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: enJson },
    ja: { translation: jaJson },
  },
});

const InfoTimeLine = () => {
  const dispatch = useDispatch();
  const [infos, setInfos] = useState([]);
  const { infoId } = useParams();
  const [activeIndex, setActiveIndex] = useState(0);
  const currentUser = useSelector((state) => state.user.value);
  const { isOpen } = useSelector((state) => state.modal);

  const lang2 = useSelector((state) => state.lang.value);
  console.log(lang2);
  const [lang, setLang] = useState(lang2);

  useEffect(() => {
    setLang(lang);
    i18n.changeLanguage(lang);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang, i18n]);

  useEffect(() => {
    if (!currentUser.username) {
      return;
    }
    const fetchInfos = async () => {
      const response = await axios.get(`/inform/${currentUser.username}`);
      setInfos(
        response.data.sort((info1, info2) => {
          return new Date(info2.createdAt) - new Date(info1.createdAt);
        })
      );
    };
    fetchInfos();
  }, [currentUser.username]);

  useEffect(() => {
    const activeIndex = infos.findIndex((e) => e._id === infoId);
    setActiveIndex(activeIndex);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [infos, infoId]);

  return (
    <Box sx={{ flex: 5.5, maxWidth: 990 }}>
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
        {isOpen && <ModalInform />}
        {infos.map((info, index) => (
          <ListItemButton
            // component={Link}
            // to={"/"}
            key={info._id}
            selected={index === activeIndex}
          >
            <UpInfo info={info} key={info._id} />
          </ListItemButton>
        ))}
      </Box>
    </Box>
  );
};

export default InfoTimeLine;
