import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../redux/features/userSlice";
import modalReducer from "../redux/features/modalSlice";
import editModalReducer from "../redux/features/editModalSlice";
import groupModalReducer from "../redux/features/groupModalSlice";
import selectPosterModalReducer from "../redux/features/selectPosterModalSlice";
import langReducer from "../redux/features/langSlice";
import postingReducer from "../redux/features/postingSlice";
import infoReducer from "../redux/features/infoSlice";
import favoriteReducer from "../redux/features/favoriteSlice";
import displayNameReducer from "../redux/features/displayNameSlice";
import channelReducer from "../redux/features/channelSlice";
import postReducer from "../redux/features/postSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    modal: modalReducer,
    editModal: editModalReducer,
    groupModal: groupModalReducer,
    selectPosterModal: selectPosterModalReducer,
    lang: langReducer,
    postingUser: postingReducer,
    info: infoReducer,
    favorites: favoriteReducer,
    displayName: displayNameReducer,
    channel: channelReducer,
    post: postReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ["your/action/type"],
        // Ignore these field paths in all actions
        ignoredActionPaths: ["meta.arg", "payload.timestamp"],
        // Ignore these paths in the state
        ignoredPaths: ["items.dates"],
      },
    }),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
