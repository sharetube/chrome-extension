import { Member, Playlist } from "./serverMessage";
import { Video } from "./serverMessage";
import { videoID } from "./video";
import { PlayerState } from "types/player";
import { profile } from "types/profile";


export enum ExtensionMessageType {
    PRIMARY_TAB_SET = "PRIMARY_TAB_SET",
    PRIMARY_TAB_UNSET = "PRIMARY_TAB_UNSET",
    PROFILE_UPDATED = "PROFILE_UPDATED",
    GET_PROFILE = "GET_PROFILE",
    UPDATE_PROFILE = "UPDATE_PROFILE",
    CREATE_ROOM = "CREATE_ROOM",
    SWITCH_TO_PRIMARY_TAB = "SWITCH_TO_PRIMARY_TAB",
    CHECK_PRIMARY_TAB_EXISTS = "CHECK_PRIMARY_TAB_EXISTS",
    IS_PRIMARY_TAB = "IS_PRIMARY_TAB",
    // Room
    GET_ADMIN_STATUS = "GET_ADMIN_STATUS",
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
    GET_PLAYER_STATE = "GET_PLAYER_STATE",
    GET_PLAYER_VIDEO = "GET_PLAYER_VIDEO",
    GET_LAST_VIDEO = "GET_LAST_VIDEO",
    LAST_VIDEO_UPDATED = "LAST_VIDEO_UPDATED",
}

export interface CrateRoomPayload {
    videoId: string;
}

export type ExtensionMessagePayloadMap = {
    [ExtensionMessageType.PRIMARY_TAB_SET]: null;
    [ExtensionMessageType.PRIMARY_TAB_UNSET]: null;
    [ExtensionMessageType.PROFILE_UPDATED]: profile;
    [ExtensionMessageType.GET_PROFILE]: null;
    [ExtensionMessageType.UPDATE_PROFILE]: profile;
    [ExtensionMessageType.SWITCH_TO_PRIMARY_TAB]: null;
    [ExtensionMessageType.CHECK_PRIMARY_TAB_EXISTS]: null;
    [ExtensionMessageType.IS_PRIMARY_TAB]: null;
    [ExtensionMessageType.CREATE_ROOM]: CrateRoomPayload;
    // Room
    [ExtensionMessageType.GET_ADMIN_STATUS]: null;
    [ExtensionMessageType.ADMIN_STATUS_UPDATED]: boolean;
    [ExtensionMessageType.GET_PLAYLIST]: null;
    [ExtensionMessageType.PLAYLIST_UPDATED]: Playlist;
    [ExtensionMessageType.UPDATE_PLAYLIST]: Playlist;
    [ExtensionMessageType.GET_MEMBERS]: null;
    [ExtensionMessageType.MEMBERS_UPDATED]: Member[];
    [ExtensionMessageType.ADD_VIDEO]: videoID;
    [ExtensionMessageType.REMOVE_VIDEO]: videoID;
    [ExtensionMessageType.GET_ROOM_ID]: null;
    [ExtensionMessageType.PROMOTE_MEMBER]: string;
    [ExtensionMessageType.REMOVE_MEMBER]: string;
    // Player
    [ExtensionMessageType.UPDATE_PLAYER_STATE]: PlayerState;
    [ExtensionMessageType.PLAYER_STATE_UPDATED]: PlayerState;
    [ExtensionMessageType.UPDATE_PLAYER_VIDEO]: videoID;
    [ExtensionMessageType.GET_PLAYER_STATE]: null;
    [ExtensionMessageType.GET_PLAYER_VIDEO]: null;
    [ExtensionMessageType.PLAYER_VIDEO_UPDATED]: videoID;
    [ExtensionMessageType.GET_LAST_VIDEO]: null;
    [ExtensionMessageType.LAST_VIDEO_UPDATED]: Video;
};

export interface ExtensionMessage<T extends ExtensionMessageType> {
    type: ExtensionMessageType;
    payload: ExtensionMessagePayloadMap[T];
}