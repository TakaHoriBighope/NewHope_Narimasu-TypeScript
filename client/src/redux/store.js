import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/userSlice";
import postReducer from "./features/postSlice";
import infoReducer from "./features/infoSlice";
import favoriteReducer from "./features/favoriteSlice";
import modalReducer from "./features/modalSlice";
import langReducer from "./features/langSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    post: postReducer,
    favorites: favoriteReducer,
    info: infoReducer,
    modal: modalReducer,
    lang: langReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
