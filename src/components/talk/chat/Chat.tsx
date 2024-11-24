import React, { ChangeEventHandler, useEffect, useState } from "react";
import ChatHeader from "./ChatHeader";
import { Box, IconButton, Typography } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import ChatMessage from "./ChatMessage";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { db } from "../../../firebase";
import {
  CollectionReference,
  DocumentData,
  addDoc,
  collection,
  Timestamp,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { useTranslation } from "react-i18next";
import { mediaQuery, useMediaQuery } from "../../../utiles/useMediaQuery";
import Sidebar from "../sidebar/Sidebar";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import { openGroupModal } from "../../../redux/features/groupModalSlice";
import { type Message } from "../../../types/message";
import { TextareaAutosize } from "@mui/base/TextareaAutosize";

const Chat = () => {
  const [inputText, setInputText] = useState<string>("");
  const isSp = useMediaQuery(mediaQuery.sp);
  const dispatch = useAppDispatch();

  const loginUser = useAppSelector((state) => state.user.user);
  const channelId = useAppSelector((state) => state.channel.channelId);
  const channelName = useAppSelector((state) => state.channel.channelName);
  const channelProp = useAppSelector((state) => state.channel.channelProp);
  const channelMembers = useAppSelector((state) => state.channel.channelMember);

  // dispatch(closeGroupModal());
  const isGroupOpen = useAppSelector((state) => state.groupModal);
  console.log(isGroupOpen);
  const [t] = useTranslation();

  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    let collectionRef = collection(
      db,
      "channels",
      String(channelId),
      "messages"
    );

    const collectionRefOrderBy = query(
      collectionRef,
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      collectionRefOrderBy,
      (snapshot) => {
        const results: Message[] = [];
        snapshot.docs.forEach((doc) => {
          const {
            talk,
            createdAt,
            uid,
            profilePicture,
            username,
            email,
            read,
          } = doc.data();
          results.push({
            createdAt,
            talk,
            uid,
            profilePicture,
            username,
            email,
            read,
          });
        });
        setMessages(results);
        console.log(messages);
      },
      (error) => {
        // console.log("onSnapshot at Talk, error");
      }
    );
    return () => {
      unsubscribe(); // 追加
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channelId, channelMembers]);

  const sendMessage = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();
    //channelsコレクションの中にあるmessageコレクションの中にメッセージ本文を入れる
    const collectionRef: CollectionReference<DocumentData> = collection(
      db,
      "channels",
      String(channelId),
      "messages"
    );
    // const docRef: DocumentReference<DocumentData> =
    await addDoc(collectionRef, {
      talk: inputText,
      createdAt: Timestamp.fromDate(new Date()),
      uid: loginUser?.uid,
      username: loginUser?.displayName,
      profilePicture: loginUser?.profilePicture,
      read: [],
    });
    setInputText("");
  };

  const handleChange: ChangeEventHandler = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setInputText(event.target.value);
  };

  if (isSp) {
    return (
      <>
        <Box
          sx={{
            display: "flex",
            // flexDirection: "row",
            backgroundColor: "#ffffff",
            height: "80vh",
          }}
        >
          <Box>
            <Box
              sx={{
                display: "flex",
              }}
            >
              <IconButton sx={{ marginLeft: "10px", marginTop: "5px" }}>
                <MenuBookIcon onClick={() => dispatch(openGroupModal())} />
              </IconButton>
              <ChatHeader channelName={channelName} channelProp={channelProp} />
            </Box>
            {isGroupOpen.isGroupOpen ? <Sidebar /> : null}
            <Box
            // sx={{ height: "100vh", overflowY: "scroll" }}
            >
              {channelName ? (
                channelProp === loginUser?.uid ||
                channelMembers.includes(loginUser?.uid ?? "") ? (
                  messages.map((message, index) => (
                    <ChatMessage key={index} message={message} />
                  ))
                ) : (
                  <Typography
                    style={{
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "yellowGreen",
                    }}
                  >
                    {t("閲覧する権限はありません")}
                  </Typography>
                )
              ) : (
                ""
              )}
            </Box>

            {/* chatinput */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                width: "91%",
                position: "absolute",
                bottom: 0,

                justifyContent: "space-between",
                padding: "15px",
                backgroundColor: "#acb1be",
                borderRadius: "5px",
                margin: "15px",
                color: "gray",
              }}
            >
              <form style={{ flexGrow: 1 }}>
                <TextareaAutosize
                  placeholder={t("メッセージを送信")}
                  style={{
                    boxSizing: "border-box",
                    width: "370px",
                    fontFamily: "sans-serif",
                    fontSize: "1.0rem",
                    fontWeight: "600",
                    lineHeight: "1.3",
                    padding: "12px",
                    borderRadius: "6px 6px 0 6px",
                    marginLeft: "5px",
                    color: "black",
                  }}
                  onChange={handleChange}
                  value={inputText}
                />
              </form>
              <IconButton
                onClick={(
                  event: React.MouseEvent<HTMLButtonElement, MouseEvent>
                ) => sendMessage(event)}
              >
                <SendIcon fontSize="large" />
              </IconButton>
            </Box>
          </Box>
        </Box>
      </>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flex: "4.0",
        maxWidth: "790",
        flexDirection: "column",
        // flexGrow: 1,
        backgroundColor: "#ffffff",
        // backgroundColor: "#52555d",
        height: "95vh",
      }}
    >
      {/* chatheader */}
      <ChatHeader channelName={channelName} channelProp={channelProp} />

      {/* chat-message */}
      <Box sx={{ height: "100vh", overflowY: "scroll" }}>
        {channelName ? (
          channelProp === loginUser?.uid ||
          channelMembers.includes(loginUser?.uid ?? "") ? (
            messages.map((message, index) => (
              <ChatMessage message={message} key={index} />
            ))
          ) : (
            <Typography
              style={{
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "yellowGreen",
              }}
            >
              {t("閲覧する権限はありません")}
            </Typography>
          )
        ) : (
          ""
        )}
      </Box>

      {/* chatinput */}
      <Box
        sx={{
          display: "flex",
          maxWidth: "790",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "15px",
          backgroundColor: "#acb1be",
          borderRadius: "5px",
          margin: "15px",
          color: "gray",
          paddingRight: "5px",
        }}
      >
        <form style={{ flexGrow: 1 }}>
          <TextareaAutosize
            placeholder={t("メッセージを送信")}
            style={{
              boxSizing: "border-box",
              width: "370px",
              fontFamily: "sans-serif",
              fontSize: "1.0rem",
              fontWeight: "600",
              lineHeight: "1.3",
              padding: "12px",
              borderRadius: "6px 6px 0 6px",
              marginLeft: "5px",
              color: "black",
            }}
            onChange={handleChange}
            value={inputText}
          />
        </form>
        <IconButton
          style={{ marginLeft: "5px" }}
          onClick={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) =>
            sendMessage(event)
          }
        >
          <SendIcon fontSize="large" />
        </IconButton>
      </Box>
    </Box>
  );
};

export default Chat;
