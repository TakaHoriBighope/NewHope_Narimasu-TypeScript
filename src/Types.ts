export interface InitialUserState {
  user: null | {
    uid: string;
    email: string;
    profilePicture: string;
    displayName: string;
  };
}
export interface InitialChannelState {
  channelId: string | null;
  channelName: string | null;
  channelProp: string | null;
  channelMember: string[];
}
export interface IModalState {
  isOpen: boolean;
}
export interface IGroupModalState {
  isGroupOpen: boolean;
}
export interface ISelectPosterModalState {
  isSelectPosterOpen: boolean;
}

export interface IPostState {
  post: string[];
}

export interface ILangState {
  lang: string;
}

export interface IPostingUserState {
  uid: string;
}
export interface IInfoState {
  uid: string[];
}
export interface IFavoriteState {
  uid: string[];
}
export interface IDispNameState {
  displayName: string | undefined;
}

export interface CurrentUser {
  user:
    | null
    | undefined
    | {
        coverPicture: "";
        profilePicture: "";
        followes: [];
        followings: [];
        createdAt: "";
        updatedAt: "";
        salesTalk: "";
        username: "";
        uid: "";
      };
}
