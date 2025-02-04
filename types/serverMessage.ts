import type { MemberType } from "./member.type";
import type { PlayerType } from "./player.type";
import type { RoomType } from "./room.type";
import type { PlaylistType, VideoType } from "./video.type";

export enum ToServerMessageType {
	UPDATE_PROFILE = "UPDATE_PROFILE",
	PROMOTE_MEMBER = "PROMOTE_MEMBER",
	REMOVE_MEMBER = "REMOVE_MEMBER",
	ADD_VIDEO = "ADD_VIDEO",
	REMOVE_VIDEO = "REMOVE_VIDEO",
	REORDER_PLAYLIST = "REORDER_PLAYLIST",
	UPDATE_READY = "UPDATE_READY",
	UPDATE_MUTED = "UPDATE_MUTED",
	UPDATE_PLAYER_STATE = "UPDATE_PLAYER_STATE",
	UPDATE_PLAYER_VIDEO = "UPDATE_PLAYER_VIDEO",
	END_VIDEO = "END_VIDEO",
	ALIVE = "ALIVE",
}

export enum FromServerMessageType {
	JOINED_ROOM = "JOINED_ROOM",
	PLAYER_VIDEO_UPDATED = "PLAYER_VIDEO_UPDATED",
	VIDEO_ADDED = "VIDEO_ADDED",
	VIDEO_REMOVED = "VIDEO_REMOVED",
	PLAYLIST_REORDERED = "PLAYLIST_REORDERED",
	MEMBER_JOINED = "MEMBER_JOINED",
	MEMBER_DISCONNECTED = "MEMBER_DISCONNECTED",
	MEMBER_UPDATED = "MEMBER_UPDATED",
	IS_ADMIN_UPDATED = "IS_ADMIN_UPDATED",
	PLAYER_STATE_UPDATED = "PLAYER_STATE_UPDATED",
}

const TO = ToServerMessageType;
const FROM = FromServerMessageType;

export type ToServerMessagePayloadMap = {
	[TO.UPDATE_PROFILE]: {
		username: string;
		color: string;
		avatar_url: string;
	};
	[TO.PROMOTE_MEMBER]: {
		member_id: string;
	};
	[TO.REMOVE_MEMBER]: {
		member_id: string;
	};
	[TO.ADD_VIDEO]: {
		video_url: string;
		updated_at: number;
		playlist_version: number;
		player_version: number;
	};
	[TO.REMOVE_VIDEO]: {
		video_id: number;
		playlist_version: number;
	};
	[TO.REORDER_PLAYLIST]: {
		video_ids: number[];
		playlist_version: number;
	};
	[TO.UPDATE_READY]: {
		is_ready: boolean;
	};
	[TO.UPDATE_MUTED]: {
		is_muted: boolean;
	};
	[TO.UPDATE_PLAYER_STATE]: {
		rid: string;
		video_id: number;
		playback_rate: number;
		is_playing: boolean;
		current_time: number;
		updated_at: number;
		player_version: number;
	};
	[TO.UPDATE_PLAYER_VIDEO]: {
		video_id: number;
		updated_at: number;
		player_version: number;
		playlist_version: number;
	};
	[TO.END_VIDEO]: {
		player_version: number;
	};
	[TO.ALIVE]: undefined;
};

export type FromServerMessagePayloadMap = {
	[FROM.JOINED_ROOM]: {
		jwt: string;
		joined_member: MemberType;
		room: RoomType;
	};
	[FROM.PLAYER_VIDEO_UPDATED]: {
		player: PlayerType;
		playlist: PlaylistType;
		members: MemberType[];
	};
	[FROM.VIDEO_ADDED]: {
		added_video: VideoType;
		playlist: PlaylistType;
	};
	[FROM.VIDEO_REMOVED]: {
		removed_video_id: number;
		playlist: PlaylistType;
	};
	[FROM.PLAYLIST_REORDERED]: {
		playlist: PlaylistType;
	};
	[FROM.MEMBER_JOINED]: {
		joined_member: MemberType;
		members: MemberType[];
	};
	[FROM.MEMBER_DISCONNECTED]: {
		disconnected_member_id: string;
		members: MemberType[];
	};
	[FROM.MEMBER_UPDATED]: {
		updated_member: MemberType;
		members: MemberType[];
	};
	[FROM.IS_ADMIN_UPDATED]: {
		is_admin: boolean;
	};
	[FROM.PLAYER_STATE_UPDATED]: {
		rid?: string;
		current_video_id: number;
		player: PlayerType;
	};
};

export interface ToServerMessage<T extends ToServerMessageType> {
	type: ToServerMessageType;
	payload: ToServerMessagePayloadMap[T];
}

export interface FromServerMessage<T extends FromServerMessageType> {
	type: FromServerMessageType;
	payload: FromServerMessagePayloadMap[T];
}
