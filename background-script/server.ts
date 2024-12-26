import { BackgroundMessagingClient } from "./clients/ExtensionClient";
import ServerClient from "./clients/ServerClient";
import { setPrimaryTab, takeTargetPrimaryTabId } from "./tab";
import { ExtensionMessageType } from "types/extensionMessage";
import { PlayerState } from "types/player";
import { profile } from "types/profile";
import {
    FromServerMessageType,
    Member,
    Player,
    Playlist,
    ToServerMessageType,
    Video,
} from "types/serverMessage";

const server = ServerClient.getInstance();
const message = BackgroundMessagingClient.getInstance();

interface State {
    player: Player;
    room_id: string;
    members: Member[];
    playlist: Playlist;
    is_admin: boolean;
}

const state: State = {
    player: {} as Player,
    room_id: "",
    members: [] as Member[],
    playlist: {
        videos: [] as Video[],
        last_video: null,
    },
    is_admin: false,
};

server.addHandler(FromServerMessageType.JOINED_ROOM, payload => {
    state.player = payload.room.player;
    state.playlist = payload.room.playlist;
    state.members = payload.room.members;
    state.room_id = payload.room.room_id;
    state.is_admin = payload.joined_member.is_admin;

    const url = `https://youtube.com/watch?v=${state.player.video_url}`;
    const targetPrimaryTabId = takeTargetPrimaryTabId();
    if (targetPrimaryTabId) {
        chrome.tabs.update(targetPrimaryTabId, { url });
        setPrimaryTab(targetPrimaryTabId);
    } else {
        console.error("No target primary tab found");
    }
});

const playlistUpdateHandler = (playlist: Playlist): void => {
    state.playlist = playlist;
    message.sendMessageToPrimaryTab(ExtensionMessageType.PLAYLIST_UPDATED, playlist);
};

server.addHandler(FromServerMessageType.VIDEO_REMOVED, payload => {
    console.log(payload);
    playlistUpdateHandler(payload.playlist);
});

server.addHandler(FromServerMessageType.VIDEO_ADDED, payload => {
    playlistUpdateHandler(payload.playlist);
});

server.addHandler(FromServerMessageType.PLAYLIST_REORDERED, payload => {
    playlistUpdateHandler(payload);
});

const userUpdateHandler = (users: Member[]) => {
    message.sendMessageToPrimaryTab(ExtensionMessageType.MEMBERS_UPDATED, users);
};

server.addHandler(FromServerMessageType.MEMBER_JOINED, payload => {
    userUpdateHandler(payload.members);
});

server.addHandler(FromServerMessageType.MEMBER_DISCONNECTED, payload => {
    userUpdateHandler(payload.members);
});

server.addHandler(FromServerMessageType.MEMBER_UPDATED, payload => {
    userUpdateHandler(payload.members);
});

server.addHandler(FromServerMessageType.IS_ADMIN_CHANGED, payload => {
    message.sendMessageToPrimaryTab(ExtensionMessageType.ADMIN_STATUS_UPDATED, payload.is_admin);
});

server.addHandler(FromServerMessageType.PLAYER_UPDATED, payload => {
    state.player = payload.player;

    message.sendMessageToPrimaryTab(ExtensionMessageType.PLAYER_STATE_UPDATED, payload.player);

    if (payload.player.video_url !== state.player.video_url) {
        message.sendMessageToPrimaryTab(
            ExtensionMessageType.PLAYER_VIDEO_UPDATED,
            payload.player.video_url,
        );
    }
});

export const updateProfile = (profile: profile) => {
    server.send(ToServerMessageType.UPDATE_PROFILE, profile);
};

server.addHandler(FromServerMessageType.PLAYER_VIDEO_UPDATED, payload => {
    state.playlist = payload.playlist;
    state.player = payload.player;
    message.sendMessageToPrimaryTab(ExtensionMessageType.PLAYLIST_UPDATED, payload.playlist);
    message.sendMessageToPrimaryTab(
        ExtensionMessageType.PLAYER_VIDEO_UPDATED,
        payload.player.video_url,
    );
    if (payload.playlist.last_video)
        message.sendMessageToPrimaryTab(
            ExtensionMessageType.LAST_VIDEO_UPDATED,
            payload.playlist.last_video,
        );
});

// Message

message.addHandler(ExtensionMessageType.ADD_VIDEO, (videoUrl: string) => {
    server.send(ToServerMessageType.ADD_VIDEO, { video_url: videoUrl });
});

message.addHandler(ExtensionMessageType.REMOVE_VIDEO, (videoId: string) => {
    server.send(ToServerMessageType.REMOVE_VIDEO, { video_id: videoId });
});

message.addHandler(ExtensionMessageType.GET_PLAYLIST, (): Playlist => {
    return state.playlist;
});

message.addHandler(ExtensionMessageType.GET_MEMBERS, (): Member[] => {
    return state.members;
});

message.addHandler(ExtensionMessageType.GET_ROOM_ID, () => {
    return state.room_id;
});

message.addHandler(ExtensionMessageType.GET_ADMIN_STATUS, () => {
    return state.is_admin;
});

message.addHandler(ExtensionMessageType.PROMOTE_MEMBER, id => {
    server.send(ToServerMessageType.PROMOTE_MEMBER, { member_id: id });
});

message.addHandler(ExtensionMessageType.REMOVE_MEMBER, id => {
    server.send(ToServerMessageType.REMOVE_MEMBER, { member_id: id });
});

message.addHandler(ExtensionMessageType.UPDATE_PLAYER_VIDEO, payload => {
    server.send(ToServerMessageType.UPDATE_PLAYER_VIDEO, {
        video_id: payload,
        updated_at: Date.now(),
    });
});

message.addHandler(ExtensionMessageType.GET_PLAYER_STATE, () => {
    return state.player;
});

message.addHandler(ExtensionMessageType.GET_PLAYER_VIDEO, () => {
    return state.player.video_url;
});

message.addHandler(ExtensionMessageType.GET_LAST_VIDEO, () => {
    return state.playlist.last_video;
});

message.addHandler(ExtensionMessageType.UPDATE_MUTED, (muted: boolean) => {
    server.send(ToServerMessageType.UPDATE_MUTED, { is_muted: muted });
});

message.addHandler(ExtensionMessageType.UPDATE_PLAYER_STATE, state => {
    server.send(ToServerMessageType.UPDATE_PLAYER_STATE, state);
});

message.addHandler(ExtensionMessageType.UPDATE_READY, ready => {
    server.send(ToServerMessageType.UPDATE_READY, { is_ready: ready });
});
