import React, { useEffect, useState } from "react";
import ChatHeader from "./ChatHeader";
import { Box, IconButton } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import ChatMessage from "./ChatMessage";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { db } from "../../../firebase";
import {
  CollectionReference,
  DocumentData,
  Timestamp,
  addDoc,
  collection,
  serverTimestamp,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { useTranslation } from "react-i18next";
import { mediaQuery, useMediaQuery } from "../../../utiles/useMediaQuery";
import Sidebar from "../sidebar/Sidebar";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import { openGroupModal } from "../../../redux/features/groupModalSlice";

interface Messages {
  timestamp: Timestamp;
  message: string;
  user: {
    uid: string;
    profilePicture: string;
    email: string;
    displayName: string;
  };
}

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

  const [messages, setMessages] = useState<Messages[]>([]);

  useEffect(() => {
    let collectionRef = collection(
      db,
      "channels",
      String(channelId),
      "messages"
    );

    const collectionRefOrderBy = query(
      collectionRef,
      orderBy("timestamp", "desc")
    );

    onSnapshot(collectionRefOrderBy, (snapshot) => {
      let results: Messages[] = [];
      snapshot.docs.forEach((doc) => {
        results.push({
          timestamp: doc.data().timestamp,
          message: doc.data().message,
          user: doc.data().user,
        });
      });
      setMessages(results);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channelId, channelMembers]);

  const sendMessage = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    //channelsコレクションの中にあるmessageコレクションの中にメッセージ本文を入れる
    const collectionRef: CollectionReference<DocumentData> = collection(
      db,
      "channels",
      String(channelId),
      "messages"
    );
    // const docRef: DocumentReference<DocumentData> =
    await addDoc(collectionRef, {
      message: inputText,
      timestamp: serverTimestamp(),
      user: loginUser,
    });
    setInputText("");
  };

  if (isSp) {
    return (
      <>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
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
              <ChatHeader channelName={channelName} />
            </Box>
            {isGroupOpen.isGroupOpen ? <Sidebar /> : null}
            <Box
            // sx={{ height: "100vh", overflowY: "scroll" }}
            >
              {channelName ? (
                channelProp === loginUser?.uid ||
                channelMembers.includes(loginUser?.uid ?? "") ? (
                  messages.map((message, index) => (
                    <ChatMessage
                      key={index}
                      message={message.message}
                      timestamp={message.timestamp}
                      user={message.user}
                    />
                  ))
                ) : (
                  <h3
                    style={{
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "yellowGreen",
                    }}
                  >
                    {t("閲覧する権限はありません")}
                  </h3>
                )
              ) : (
                ""
              )}
            </Box>

            {/* chatinput */}
            <Box
              sx={{
                display: "flex",
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
              <SendIcon fontSize="large" />
              <form style={{ flexGrow: 1 }}>
                <input
                  inputMode="text"
                  placeholder={t("メッセージを送信")}
                  style={{
                    padding: "0 15px",
                    background: "transparent",
                    border: "none",
                    outline: "none",
                    color: "black",
                    fontSize: "large",
                    // width: "100%",
                  }}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setInputText(e.target.value)
                  }
                  value={inputText}
                />
                <button
                  type="submit"
                  style={{ display: "none" }}
                  onClick={(
                    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
                  ) => sendMessage(e)}
                >
                  送信
                </button>
              </form>
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
        flex: "4.5",
        flexDirection: "column",
        // flexGrow: 1,
        backgroundColor: "#ffffff",
        // backgroundColor: "#52555d",
        height: "95vh",
      }}
    >
      {/* chatheader */}
      <ChatHeader channelName={channelName} />

      {/* chat-message */}
      <Box sx={{ height: "100vh", overflowY: "scroll" }}>
        {channelName ? (
          channelProp === loginUser?.uid ||
          channelMembers.includes(loginUser?.uid ?? "") ? (
            messages.map((message, index) => (
              <ChatMessage
                key={index}
                message={message.message}
                timestamp={message.timestamp}
                user={message.user}
              />
            ))
          ) : (
            <h3
              style={{
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "yellowGreen",
              }}
            >
              {t("閲覧する権限はありません")}
            </h3>
          )
        ) : (
          ""
        )}
      </Box>

      {/* chatinput */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "15px",
          backgroundColor: "#acb1be",
          borderRadius: "5px",
          margin: "15px",
          color: "gray",
        }}
      >
        <SendIcon fontSize="large" />
        <form style={{ flexGrow: 1 }}>
          <input
            type="text"
            placeholder={t("メッセージを送信")}
            style={{
              padding: "15px",
              background: "transparent",
              border: "none",
              outline: "none",
              color: "black",
              fontSize: "large",
              width: "100%",
            }}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setInputText(e.target.value)
            }
            value={inputText}
          />
          <button
            type="submit"
            style={{ display: "none" }}
            onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) =>
              sendMessage(e)
            }
          >
            送信
          </button>
        </form>
      </Box>
    </Box>
  );
};

export default Chat;
