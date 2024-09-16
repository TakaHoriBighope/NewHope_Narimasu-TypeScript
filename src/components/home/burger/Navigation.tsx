import { FC, useEffect, useState } from "react";
import "./styles.css";
import { Box, IconButton, ListItemButton, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Home, Person, Settings } from "@mui/icons-material";
import ChatIcon from "@mui/icons-material/Chat";
import InfoIcon from "@mui/icons-material/Info";
import { Link } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../../firebase";
import { doc, getDoc } from "firebase/firestore";

type Props = {
  open: boolean;
  id: string;
};

type Users = {
  uid: string;
  coverPicture: string;
  createdAt: string;
  followers: [];
  followings: [];
  profilePicture: string;
  salesTalk: string;
  updatedAt: string;
  username: string;
};

export const Navigation: FC<Props> = ({ open, id }) => {
  const [t] = useTranslation();
  const UID2 = process.env.REACT_APP_UID2;
  const [currentUserData, setCurrentUserData] = useState<Users>();

  useEffect(() => {
    const fetchUser = () => {
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          const uid = user.uid;
          const docRef = doc(db, "users", uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setCurrentUserData({
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
            console.log("No such document!11");
          }
        } else {
          console.log("No such document!22");
        }
      });
    };
    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <nav id={id} aria-hidden={!open} className="navigation">
        <ul>
          <li>
            <ListItemButton>
              <Link to={"/"} style={{ textDecoration: "none", color: "black" }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <IconButton>
                    <Home />
                  </IconButton>
                  <Typography variant="body1" fontWeight="700">
                    {t("教会からお知らせ")}
                  </Typography>
                </Box>
              </Link>
            </ListItemButton>
          </li>
          <li>
            <ListItemButton>
              <Link
                to={"/share"}
                style={{ textDecoration: "none", color: "black" }}
              >
                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <IconButton>
                    <ChatIcon />
                  </IconButton>
                  <Typography variant="body1" fontWeight="700">
                    {t("シェア")}
                  </Typography>
                </Box>
              </Link>
            </ListItemButton>
          </li>
          <li>
            <ListItemButton>
              <Link
                to={"/talk"}
                style={{ textDecoration: "none", color: "black" }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <IconButton>
                    <ChatIcon />
                  </IconButton>
                  <Typography variant="body1" fontWeight="700">
                    {t("トーク")}
                  </Typography>
                </Box>
              </Link>
            </ListItemButton>
          </li>
          <li>
            <ListItemButton>
              <Link
                to={"/profile"}
                style={{ textDecoration: "none", color: "black" }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <IconButton>
                    <Person />
                  </IconButton>
                  <Typography variant="body1" fontWeight="700">
                    {t("プロファイル")}
                  </Typography>
                </Box>
              </Link>
            </ListItemButton>
          </li>
          <li>
            {currentUserData?.uid === UID2 ? (
              <ListItemButton>
                <Link
                  to={"/information"}
                  style={{ textDecoration: "none", color: "black" }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <IconButton>
                      <InfoIcon />
                    </IconButton>
                    <Typography variant="body1" fontWeight="700">
                      {t("お知らせを作成")}
                    </Typography>
                  </Box>
                </Link>
              </ListItemButton>
            ) : (
              ""
            )}
          </li>
          <li>
            <ListItemButton>
              <Box>
                <Link
                  to={"/pSettings"}
                  style={{ textDecoration: "none", color: "black" }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <IconButton>
                      <Settings />
                    </IconButton>
                    <Typography variant="body1" fontWeight="700">
                      {t("設定")}
                    </Typography>
                  </Box>
                </Link>
              </Box>
            </ListItemButton>
          </li>
        </ul>
      </nav>
    </>
  );
};
