import type { PlayerStateType } from "types/player.type";
import type { MemberType } from "./member.type";
import type { ProfileType } from "./profile.type";
import type { PlaylistType, VideoType } from "./video.type";

export enum ExtensionMessageType {
	PRIMARY_TAB_SET = "PRIMARY_TAB_SET",
	PRIMARY_TAB_UNSET = "PRIMARY_TAB_UNSET",
	PROFILE_UPDATED = "PROFILE_UPDATED",
	GET_PROFILE = "GET_PROFILE",
	UPDATE_PROFILE = "UPDATE_PROFILE",
	CREATE_ROOM = "CREATE_ROOM",
	GO_TO_VIDEO = "GO_TO_VIDEO",
	SWITCH_TO_PRIMARY_TAB = "SWITCH_TO_PRIMARY_TAB",
	IS_PRIMARY_TAB_EXISTS = "IS_PRIMARY_TAB_EXISTS",
	IS_PRIMARY_TAB = "IS_PRIMARY_TAB",
	PRIMARY_TAB_LOADED = "PRIMARY_TAB_LOADED",
	GET_IS_ADMIN = "GET_ADMIN_STATUS",
	REORDER_PLAYLIST = "REORDER_PLAYLIST",
	ADMIN_STATUS_UPDATED = "ADMIN_STATUS_UPDATED",
	KICKED = "KICKED",
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
	UPDATE_PLAYER_STATE = "UPDATE_PLAYER_STATE",
	PLAYER_STATE_UPDATED = "PLAYER_STATE_UPDATED",
	CURRENT_VIDEO_UPDATED = "CURRENT_VIDEO_UPDATED",
	UPDATE_PLAYER_VIDEO = "UPDATE_PLAYER_VIDEO",
	VIDEO_ENDED = "VIDEO_ENDED",
	GET_PLAYER_STATE = "GET_PLAYER_STATE",
	GET_CURRENT_VIDEO = "GET_CURRENT_VIDEO",
	GET_LAST_VIDEO = "GET_LAST_VIDEO",
	LAST_VIDEO_UPDATED = "LAST_VIDEO_UPDATED",
	UPDATE_MUTED = "UPDATE_MUTED",
	UPDATE_URL = "UPDATE_URL",
	UPDATE_READY = "UPDATE_READY",
	// Devmode
	GET_DEVMODE = "GET_DEVMODE",
	SET_DEVMODE = "SET_DEVMODE",
	DEVMODE_UPDATED = "DEVMODE_UPDATED",
}

export type ExtensionMessagePayloadMap = {
	[ExtensionMessageType.PRIMARY_TAB_SET]: undefined;
	[ExtensionMessageType.PRIMARY_TAB_UNSET]: undefined;
	[ExtensionMessageType.PROFILE_UPDATED]: ProfileType;
	[ExtensionMessageType.GET_PROFILE]: undefined;
	[ExtensionMessageType.UPDATE_PROFILE]: ProfileType;
	[ExtensionMessageType.SWITCH_TO_PRIMARY_TAB]: undefined;
	[ExtensionMessageType.IS_PRIMARY_TAB_EXISTS]: undefined;
	[ExtensionMessageType.IS_PRIMARY_TAB]: undefined;
	[ExtensionMessageType.CREATE_ROOM]: string;
	[ExtensionMessageType.GO_TO_VIDEO]: string;
	[ExtensionMessageType.REORDER_PLAYLIST]: number[];
	// Room
	[ExtensionMessageType.GET_IS_ADMIN]: undefined;
	[ExtensionMessageType.ADMIN_STATUS_UPDATED]: boolean;
	[ExtensionMessageType.PLAYLIST_UPDATED]: PlaylistType;
	[ExtensionMessageType.UPDATE_PLAYLIST]: PlaylistType;
	[ExtensionMessageType.GET_MEMBERS]: undefined;
	[ExtensionMessageType.MEMBERS_UPDATED]: MemberType[];
	[ExtensionMessageType.ADD_VIDEO]: string;
	[ExtensionMessageType.REMOVE_VIDEO]: number;
	[ExtensionMessageType.GET_ROOM_ID]: undefined;
	[ExtensionMessageType.PROMOTE_MEMBER]: string;
	[ExtensionMessageType.REMOVE_MEMBER]: string;
	// Player
	[ExtensionMessageType.UPDATE_PLAYER_STATE]: {
		video_id: number;
	} & PlayerStateType;
	[ExtensionMessageType.PLAYER_STATE_UPDATED]: PlayerStateType;
	[ExtensionMessageType.UPDATE_PLAYER_VIDEO]: {
		videoId: number;
		updatedAt: number;
	};
	[ExtensionMessageType.VIDEO_ENDED]: undefined;
	[ExtensionMessageType.GET_PLAYER_STATE]: undefined;
	[ExtensionMessageType.GET_CURRENT_VIDEO]: undefined;
	[ExtensionMessageType.UPDATE_URL]: string;
	[ExtensionMessageType.CURRENT_VIDEO_UPDATED]: VideoType;
	[ExtensionMessageType.LAST_VIDEO_UPDATED]: VideoType;
	[ExtensionMessageType.PRIMARY_TAB_LOADED]: undefined;
	// Profile
	[ExtensionMessageType.UPDATE_MUTED]: boolean;
	[ExtensionMessageType.UPDATE_READY]: boolean;
	[ExtensionMessageType.GET_LAST_VIDEO]: undefined;
	[ExtensionMessageType.GET_PLAYLIST]: undefined;
	[ExtensionMessageType.KICKED]: undefined;
	// Devmode
	[ExtensionMessageType.GET_DEVMODE]: undefined;
	[ExtensionMessageType.SET_DEVMODE]: boolean;
	[ExtensionMessageType.DEVMODE_UPDATED]: boolean;
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
	[ExtensionMessageType.GET_CURRENT_VIDEO]: VideoType;
	[ExtensionMessageType.GET_LAST_VIDEO]: VideoType | null;
	// Devmode
	[ExtensionMessageType.GET_DEVMODE]: boolean;
	[ExtensionMessageType.DEVMODE_UPDATED]: boolean;
};

export interface ExtensionMessage<T extends ExtensionMessageType> {
	type: ExtensionMessageType;
	payload?: ExtensionMessagePayloadMap[T];
}
