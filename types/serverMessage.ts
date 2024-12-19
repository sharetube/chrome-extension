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
    ALIVE = "ALIVE",
}

export enum FromServerMessageType {
    JOINED_ROOM = "JOINED_ROOM",
    PLAYER_STATE_UPDATED = "PLAYER_STATE_UPDATED",
    PLAYER_VIDEO_UPDATED = "PLAYER_VIDEO_UPDATED",
    VIDEO_ADDED = "VIDEO_ADDED",
    VIDEO_REMOVED = "VIDEO_REMOVED",
    PLAYLIST_REORDERED = "PLAYLIST_REORDERED",
    MEMBER_JOINED = "MEMBER_JOINED",
    MEMBER_DISCONNECTED = "MEMBER_DISCONNECTED",
    MEMBER_UPDATED = "MEMBER_UPDATED",
    IS_ADMIN_CHANGED = "IS_ADMIN_CHANGED",
}

const TO = ToServerMessageType;
const FROM = FromServerMessageType;

export type Video = {
    id: string;
    url: string;
};

export type Member = {
    id: string;
    username: string;
    color: string;
    avatar_url: string;
    is_ready: boolean;
    is_admin: boolean;
    is_muted: boolean;
};

export type Playlist = {
    videos: Video[];
    last_video_id: Video | null;
};

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
    };
    [TO.REMOVE_VIDEO]: {
        video_id: string;
    };
    [TO.REORDER_PLAYLIST]: {
        videos: Video[];
    };
    [TO.UPDATE_READY]: {
        is_ready: boolean;
    };
    [TO.UPDATE_MUTED]: {
        is_muted: boolean;
    };
    [TO.UPDATE_PLAYER_STATE]: {
        playback_rate: number;
        is_playing: boolean;
        current_time: number;
        updated_at: number;
    };
    [TO.UPDATE_PLAYER_VIDEO]: {
        video_id: string;
        updated_at: number;
    };
    [TO.ALIVE]: null;
};

export type FromServerMessagePayloadMap = {
    [FROM.JOINED_ROOM]: {
        jwt: string;
        room: {
            room_id: string;
            player: {
                video_url: string;
                playback_rate: number;
                is_playing: boolean;
                current_time: number;
                updated_at: number;
            };
            playlist: Playlist;
            members: Member[];
        };
    };
    [FROM.PLAYER_STATE_UPDATED]: {
        player: {
            playback_rate: number;
            is_playing: boolean;
            current_time: number;
            updated_at: number;
        };
    };
    [FROM.PLAYER_VIDEO_UPDATED]: {
        player: {
            video_url: string;
            playback_rate: number;
            is_playing: boolean;
            current_time: number;
            updated_at: number;
        };
        playlist: Playlist;
    };
    [FROM.VIDEO_ADDED]: {
        added_video: Video;
        playlist: Playlist;
    };
    [FROM.VIDEO_REMOVED]: {
        removed_video_id: string;
        playlist: Playlist;
    };
    [FROM.PLAYLIST_REORDERED]: {
        videos: Video[];
        last_video_id: Video;
    };
    [FROM.MEMBER_JOINED]: {
        joined_member: Member;
        members: Member[];
    };
    [FROM.MEMBER_DISCONNECTED]: {
        disconnected_member_id: string;
        members: Member[];
    };
    [FROM.MEMBER_UPDATED]: {
        updated_member: Member;
        members: Member[];
    };
    [FROM.IS_ADMIN_CHANGED]: {
        is_admin: boolean;
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
