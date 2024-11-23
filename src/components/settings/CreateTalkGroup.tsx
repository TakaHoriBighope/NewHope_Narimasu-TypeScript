import React, { ChangeEventHandler, useState } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "../../redux/hooks";
import StarIcon from "@mui/icons-material/Star";

export const CreateTalkGroup = () => {
  const [groupName, setGroupName] = useState<string>("");
  // const { user, setUser } = useState<User>();
  const [t] = useTranslation();

  //ログインしているユーザー(uid, email address, username(displayName))
  const loginUser = useAppSelector((state) => state.user.user);

  const handleChange: ChangeEventHandler = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setGroupName(event.target.value);
  };

  const onSubmitCreateNewGroup = async () => {
    if (groupName) {
      const docRef = await addDoc(collection(db, "channels"), {
        channelName: groupName,
        channelProp: loginUser?.uid,
        channelMember: [],
      });
      const channelRef = doc(db, "channels", docRef.id);
      await updateDoc(channelRef, {
        channelId: docRef.id,
      });
    }
    setGroupName("");
  };

  return (
    <Box
      sx={{
        textAlign: "center",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", marginTop: "15px" }}>
        <IconButton>
          <StarIcon sx={{ fontSize: "25px", color: "blueviolet" }} />
        </IconButton>
        <Typography
          sx={{
            fontSize: "20px",
            fontWeight: "600",
            color: "#483c3c",
          }}
        >
          {t("新しいトークグループを作成しますか？")}
        </Typography>
      </Box>

      <Typography
        sx={{
          marginTop: "15px",
          fontSize: "16px",
          fontWeight: "600",
          color: "#483c3c",
        }}
      >
        {t("あなたは新しいグループの管理者です。")}
      </Typography>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            marginTop: "10px",
          }}
        >
          <input
            placeholder="input new group name"
            style={{
              padding: "5px",
              marginTop: "15px",
              height: 40,
              fontSize: 20,
              borderColor: "#800",
              borderBottomWidth: 1,
            }}
            onChange={handleChange}
            value={groupName}
          />
        </Box>
        <Box>
          {!!groupName ? (
            <IconButton
              sx={{ color: "#800 " }}
              onClick={onSubmitCreateNewGroup}
            >
              {/* <SaveIcon fontSize="large" /> */}
              <SaveIcon sx={{ marginTop: "25px", fontSize: "35px" }} />
            </IconButton>
          ) : null}
        </Box>
      </Box>
    </Box>
  );
};
