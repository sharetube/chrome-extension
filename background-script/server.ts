import { BackgroundMessagingClient } from "./ExtensionClient";
import ServerClient from "./ServerClient";
import { notifyTabsPrimaryTabSet, setPrimaryTab } from "./tab";
import { ExtensionMessageType } from "types/extensionMessage";
import { profile } from "types/profile";
import {
    FromServerMessageType,
    Member,
    Playlist,
    ToServerMessageType,
    Video,
} from "types/serverMessage";

const server = ServerClient.getInstance();
const message = BackgroundMessagingClient.getInstance();

interface State {
    room_id: string;
    members: Member[];
    playlist: Playlist;
}

const state: State = {
    room_id: "",
    members: [] as Member[],
    playlist: {
        videos: [] as Video[],
        last_video_id: null,
    },
};

server.addHandler(FromServerMessageType.JOINED_ROOM, payload => {
    state.playlist = payload.room.playlist;
    state.members = payload.room.members;
    state.room_id = payload.room.room_id;
    const video_url = payload.room.player.video_url;
    console.log("JOIN");
    chrome.tabs.create({ url: `https://youtube.com/watch?v=${video_url}` }, tab => {
        if (tab.id) setPrimaryTab(tab.id);
    });
});

const playlistUpdateHandler = (playlist: Playlist): void => {
    state.playlist = playlist;
    console.log(playlist);
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
    message.sendMessageToPrimaryTab(ExtensionMessageType.USERS_UPDATED, users);
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

export const updateProfile = (profile: profile) => {
    server.send(ToServerMessageType.UPDATE_PROFILE, profile);
};

// Message

message.addHandler(ExtensionMessageType.ADD_VIDEO, (videoUrl: string) => {
    server.send(ToServerMessageType.ADD_VIDEO, { video_url: videoUrl });
});

message.addHandler(ExtensionMessageType.REMOVE_VIDEO, (videoId: string) => {
    server.send(ToServerMessageType.REMOVE_VIDEO, { video_id: videoId });
});

message.addHandler(ExtensionMessageType.GET_PLAYLIST, () => {
    return state.playlist;
});

message.addHandler(ExtensionMessageType.GET_USERS, (): Member[] => {
    return state.members;
});

message.addHandler(ExtensionMessageType.COPY_LINK, () => {
    return state.room_id;
});

//! Fix this
message.addHandler(ExtensionMessageType.GET_ADMIN_STATUS, () => {
    return true;
});
