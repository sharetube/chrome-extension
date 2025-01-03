import { MemberType } from "./member.type";
import { ProfileType } from "./profile.type";
import { PlaylistType, VideoType } from "./video.type";
import { PlayerStateType, PlayerType } from "types/player.type";

export enum ExtensionMessageType {
    PRIMARY_TAB_SET = "PRIMARY_TAB_SET",
    PRIMARY_TAB_UNSET = "PRIMARY_TAB_UNSET",
    PROFILE_UPDATED = "PROFILE_UPDATED",
    GET_PROFILE = "GET_PROFILE",
    UPDATE_PROFILE = "UPDATE_PROFILE",
    CREATE_ROOM = "CREATE_ROOM",
    SWITCH_TO_PRIMARY_TAB = "SWITCH_TO_PRIMARY_TAB",
    IS_PRIMARY_TAB_EXISTS = "IS_PRIMARY_TAB_EXISTS",
    IS_PRIMARY_TAB = "IS_PRIMARY_TAB",
    // Room
    GET_IS_ADMIN = "GET_ADMIN_STATUS",
    ADMIN_STATUS_UPDATED = "ADMIN_STATUS_UPDATED",
    GET_PLAYLIST = "GET_PLAYLIST",
    PLAYLIST_UPDATED = "PLAYLIST_UPDATED",
    UPDATE_PLAYLIST = "UPDATE_PLAYLIST",
    GET_MEMBERS = "GET_MEMBERS",
    MEMBERS_UPDATED = "MEMBERS_UPDATED",
    ADD_VIDEO = "ADD_VIDEO",
    REMOVE_VIDEO = "REMOVE_VIDEO",
    GET_ROOM_ID = "GET_ROOM_ID",
    PROMOTE_MEMBER = "PROMOTE_MEMBER",
    REMOVE_MEMBER = "REMOVE_MEMBER",
    // Player
    UPDATE_PLAYER_STATE = "UPDATE_PLAYER_STATE",
    PLAYER_STATE_UPDATED = "PLAYER_STATE_UPDATED",
    PLAYER_VIDEO_UPDATED = "PLAYER_VIDEO_UPDATED",
    UPDATE_PLAYER_VIDEO = "UPDATE_PLAYER_VIDEO",
    SKIP_CURRENT_VIDEO = "SKIP_CURRENT_VIDEO",
    GET_PLAYER_STATE = "GET_PLAYER_STATE",
    GET_PLAYER_VIDEO_URL = "GET_PLAYER_VIDEO_URL",
    GET_LAST_VIDEO = "GET_LAST_VIDEO",
    LAST_VIDEO_UPDATED = "LAST_VIDEO_UPDATED",
    UPDATE_MUTED = "UPDATE_MUTED",
    UPDATE_READY = "UPDATE_READY",
}

export type ExtensionMessagePayloadMap = {
    [ExtensionMessageType.PRIMARY_TAB_SET]: void;
    [ExtensionMessageType.PRIMARY_TAB_UNSET]: void;
    [ExtensionMessageType.PROFILE_UPDATED]: ProfileType;
    [ExtensionMessageType.GET_PROFILE]: void;
    [ExtensionMessageType.UPDATE_PROFILE]: ProfileType;
    [ExtensionMessageType.SWITCH_TO_PRIMARY_TAB]: void;
    [ExtensionMessageType.IS_PRIMARY_TAB_EXISTS]: void;
    [ExtensionMessageType.IS_PRIMARY_TAB]: void;
    [ExtensionMessageType.CREATE_ROOM]: { videoUrl: string };
    // Room
    [ExtensionMessageType.GET_IS_ADMIN]: void;
    [ExtensionMessageType.ADMIN_STATUS_UPDATED]: boolean;
    [ExtensionMessageType.PLAYLIST_UPDATED]: PlaylistType;
    [ExtensionMessageType.UPDATE_PLAYLIST]: PlaylistType;
    [ExtensionMessageType.GET_MEMBERS]: void;
    [ExtensionMessageType.MEMBERS_UPDATED]: MemberType[];
    [ExtensionMessageType.ADD_VIDEO]: string;
    [ExtensionMessageType.REMOVE_VIDEO]: string;
    [ExtensionMessageType.GET_ROOM_ID]: void;
    [ExtensionMessageType.PROMOTE_MEMBER]: string;
    [ExtensionMessageType.REMOVE_MEMBER]: string;
    // Player
    [ExtensionMessageType.UPDATE_PLAYER_STATE]: PlayerStateType;
    [ExtensionMessageType.PLAYER_STATE_UPDATED]: PlayerType;
    // todo: also send updated_at
    [ExtensionMessageType.UPDATE_PLAYER_VIDEO]: string;
    [ExtensionMessageType.SKIP_CURRENT_VIDEO]: void;
    [ExtensionMessageType.GET_PLAYER_STATE]: void;
    [ExtensionMessageType.GET_PLAYER_VIDEO_URL]: void;
    [ExtensionMessageType.PLAYER_VIDEO_UPDATED]: string;
    [ExtensionMessageType.LAST_VIDEO_UPDATED]: VideoType;
    // Profile
    [ExtensionMessageType.UPDATE_MUTED]: boolean;
    [ExtensionMessageType.UPDATE_READY]: boolean;
    [ExtensionMessageType.GET_LAST_VIDEO]: void;
    [ExtensionMessageType.GET_PLAYLIST]: void;
};
export type ExtensionMessageResponseMap = {
    [ExtensionMessageType.GET_PLAYLIST]: PlaylistType;
    [ExtensionMessageType.GET_PROFILE]: Promise<ProfileType>;
    [ExtensionMessageType.IS_PRIMARY_TAB]: Promise<boolean>;
    [ExtensionMessageType.IS_PRIMARY_TAB_EXISTS]: Promise<boolean>;
    [ExtensionMessageType.GET_MEMBERS]: MemberType[];
    [ExtensionMessageType.ADD_VIDEO]: string;
    [ExtensionMessageType.REMOVE_VIDEO]: string;
    [ExtensionMessageType.GET_ROOM_ID]: string;
    [ExtensionMessageType.GET_IS_ADMIN]: boolean;
    [ExtensionMessageType.GET_PLAYER_STATE]: PlayerStateType;
    [ExtensionMessageType.GET_PLAYER_VIDEO_URL]: string;
    [ExtensionMessageType.GET_LAST_VIDEO]: VideoType | null;
};

export interface ExtensionMessage<T extends ExtensionMessageType> {
    type: ExtensionMessageType;
    payload?: ExtensionMessagePayloadMap[T];
}
