import { Timestamp } from "firebase/firestore";

export type ProfileUser = {
  uid: string;
  profilePicture: string;
};

export type User = {
  id?: string;
  email: string;
  coverPicture: string;
  profilePicture: string;
  followers: String[];
  followings: String[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
  salesTalk: string;
  username: string;
  uid: string;
};

export const initialUser: User = {
  id: "",
  email: "",
  coverPicture: "",
  profilePicture: "",
  followers: [],
  followings: [],
  createdAt: Timestamp.fromDate(new Date()),
  updatedAt: Timestamp.fromDate(new Date()),
  salesTalk: "",
  username: "",
  uid: "",
};
