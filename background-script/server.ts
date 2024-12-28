import { BackgroundMessagingClient } from "./clients/ExtensionClient";
import ServerClient from "./clients/ServerClient";
import { setPrimaryTab, takeTargetPrimaryTabId } from "./tab";
import { ExtensionMessageType } from "types/extensionMessage";
import { MemberType } from "types/member.type";
import { ProfileType } from "types/profile.type";
import { FromServerMessageType, Room, ToServerMessageType } from "types/serverMessage";
import { PlaylistType } from "types/video.type";

const server = ServerClient.getInstance();
const bgMessagingClient = BackgroundMessagingClient.getInstance();

interface State {
    room: Room;
    is_admin: boolean;
}

const state: State = {
    is_admin: false,
    room: {
        room_id: "",
        playlist: {
            videos: [],
            last_video: null,
        },
        player: {
            video_url: "",
            current_time: 0,
            is_playing: false,
            playback_rate: 1,
            updated_at: 0,
        },
        members: [],
    },
};

server.addHandler(FromServerMessageType.JOINED_ROOM, payload => {
    console.log("joined room", payload.room);
    state.room = payload.room;
    state.is_admin = payload.joined_member.is_admin;

    const videoPageLink = `https://youtube.com/watch?v=${state.room.player.video_url}`;
    const targetPrimaryTabId = takeTargetPrimaryTabId();
    if (targetPrimaryTabId) {
        chrome.tabs.update(targetPrimaryTabId, { url: videoPageLink });
        setPrimaryTab(targetPrimaryTabId);
    } else {
        console.error("No target primary tab found");
    }
});

const playlistUpdateHandler = (playlist: PlaylistType): void => {
    state.room.playlist = playlist;
    bgMessagingClient.sendMessageToPrimaryTab(ExtensionMessageType.PLAYLIST_UPDATED, playlist);
};

server.addHandler(FromServerMessageType.VIDEO_REMOVED, payload => {
    playlistUpdateHandler(payload.playlist);
});

server.addHandler(FromServerMessageType.VIDEO_ADDED, payload => {
    playlistUpdateHandler(payload.playlist);
});

server.addHandler(FromServerMessageType.PLAYLIST_REORDERED, payload => {
    playlistUpdateHandler(payload);
});

const userUpdateHandler = (users: MemberType[]) => {
    bgMessagingClient.sendMessageToPrimaryTab(ExtensionMessageType.MEMBERS_UPDATED, users);
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
    bgMessagingClient.sendMessageToPrimaryTab(
        ExtensionMessageType.ADMIN_STATUS_UPDATED,
        payload.is_admin,
    );
});

server.addHandler(FromServerMessageType.PLAYER_UPDATED, payload => {
    state.room.player = payload.player;

    bgMessagingClient.sendMessageToPrimaryTab(
        ExtensionMessageType.PLAYER_STATE_UPDATED,
        payload.player,
    );

    //? indicates loss of player_video_updated msg, should also get updated playlist
    if (payload.player.video_url !== state.room.player.video_url) {
        bgMessagingClient.sendMessageToPrimaryTab(
            ExtensionMessageType.PLAYER_VIDEO_UPDATED,
            payload.player.video_url,
        );
    }
});

export const updateProfile = (profile: ProfileType) => {
    server.send(ToServerMessageType.UPDATE_PROFILE, profile);
};

server.addHandler(FromServerMessageType.PLAYER_VIDEO_UPDATED, payload => {
    state.room.playlist = payload.playlist;
    state.room.player = payload.player;
    bgMessagingClient.sendMessageToPrimaryTab(
        ExtensionMessageType.PLAYLIST_UPDATED,
        payload.playlist,
    );
    bgMessagingClient.sendMessageToPrimaryTab(
        ExtensionMessageType.PLAYER_VIDEO_UPDATED,
        payload.player.video_url,
    );
    if (payload.playlist.last_video)
        bgMessagingClient.sendMessageToPrimaryTab(
            ExtensionMessageType.LAST_VIDEO_UPDATED,
            payload.playlist.last_video,
        );
});

// Message

bgMessagingClient.addHandler(ExtensionMessageType.ADD_VIDEO, (videoUrl: string) => {
    server.send(ToServerMessageType.ADD_VIDEO, { video_url: videoUrl });
});

bgMessagingClient.addHandler(ExtensionMessageType.REMOVE_VIDEO, (videoId: string) => {
    server.send(ToServerMessageType.REMOVE_VIDEO, { video_id: videoId });
});

bgMessagingClient.addHandler(ExtensionMessageType.GET_PLAYLIST, (): PlaylistType => {
    return state.room.playlist;
});

bgMessagingClient.addHandler(ExtensionMessageType.GET_MEMBERS, (): MemberType[] => {
    return state.room.members;
});

bgMessagingClient.addHandler(ExtensionMessageType.GET_ROOM_ID, () => {
    return state.room.room_id;
});

bgMessagingClient.addHandler(ExtensionMessageType.GET_ADMIN_STATUS, () => {
    return state.is_admin;
});

bgMessagingClient.addHandler(ExtensionMessageType.PROMOTE_MEMBER, id => {
    server.send(ToServerMessageType.PROMOTE_MEMBER, { member_id: id });
});

bgMessagingClient.addHandler(ExtensionMessageType.REMOVE_MEMBER, id => {
    server.send(ToServerMessageType.REMOVE_MEMBER, { member_id: id });
});

bgMessagingClient.addHandler(ExtensionMessageType.SKIP_CURRENT_VIDEO, () => {
    server.send(ToServerMessageType.UPDATE_PLAYER_VIDEO, {
        video_id: state.room.playlist.videos[0].id,
        updated_at: Date.now(),
    });
});

bgMessagingClient.addHandler(ExtensionMessageType.UPDATE_PLAYER_VIDEO, payload => {
    server.send(ToServerMessageType.UPDATE_PLAYER_VIDEO, {
        video_id: payload,
        // todo: get updated_at with payload
        updated_at: Date.now(),
    });
});

bgMessagingClient.addHandler(ExtensionMessageType.GET_PLAYER_STATE, () => {
    return state.room.player;
});

bgMessagingClient.addHandler(ExtensionMessageType.GET_PLAYER_VIDEO_URL, () => {
    console.log("getting player video url", state.room.player.video_url);
    return state.room.player.video_url;
});

bgMessagingClient.addHandler(ExtensionMessageType.GET_LAST_VIDEO, () => {
    return state.room.playlist.last_video;
});

bgMessagingClient.addHandler(ExtensionMessageType.UPDATE_MUTED, (muted: boolean) => {
    server.send(ToServerMessageType.UPDATE_MUTED, { is_muted: muted });
});

bgMessagingClient.addHandler(ExtensionMessageType.UPDATE_PLAYER_STATE, state => {
    server.send(ToServerMessageType.UPDATE_PLAYER_STATE, state);
});

bgMessagingClient.addHandler(ExtensionMessageType.UPDATE_READY, ready => {
    server.send(ToServerMessageType.UPDATE_READY, { is_ready: ready });
});
