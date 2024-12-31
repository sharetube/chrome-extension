import { BackgroundMessagingClient } from "background-script/clients/ExtensionClient";
import { PrimaryTabStorage } from "background-script/primaryTabStorage";
import { globalState, resetState } from "background-script/state";
import { takeTargetPrimaryTabId } from "background-script/targetPrimaryTabId";
import { ExtensionMessageType } from "types/extensionMessage";
import { FromServerMessagePayloadMap, FromServerMessageType } from "types/serverMessage";

const bgMessagingClient = BackgroundMessagingClient.getInstance();
export function joinedRoom(
    payload: FromServerMessagePayloadMap[FromServerMessageType.JOINED_ROOM],
): void {
    resetState();
    globalState.jwt = payload.jwt;
    globalState.room = payload.room;
    globalState.is_admin = payload.joined_member.is_admin;

    const videoPageLink = `https://youtube.com/watch?v=${payload.room.player.video_url}`;
    const targetPrimaryTabId = takeTargetPrimaryTabId();
    if (targetPrimaryTabId) {
        chrome.tabs.update(targetPrimaryTabId, { url: videoPageLink });
        PrimaryTabStorage.getInstance().set(targetPrimaryTabId);
    } else {
        console.error("No target primary tab found");
    }
}

export const videoRemoved = (
    payload: FromServerMessagePayloadMap[FromServerMessageType.VIDEO_REMOVED],
): void => {
    globalState.room.playlist = payload.playlist;
    bgMessagingClient.sendMessageToPrimaryTab(
        ExtensionMessageType.PLAYLIST_UPDATED,
        payload.playlist,
    );
};

export const videoAdded = (
    payload: FromServerMessagePayloadMap[FromServerMessageType.VIDEO_ADDED],
): void => {
    globalState.room.playlist = payload.playlist;
    bgMessagingClient.sendMessageToPrimaryTab(
        ExtensionMessageType.PLAYLIST_UPDATED,
        payload.playlist,
    );
};

export const playlistReordered = (
    payload: FromServerMessagePayloadMap[FromServerMessageType.PLAYLIST_REORDERED],
): void => {
    globalState.room.playlist = payload.playlist;
    bgMessagingClient.sendMessageToPrimaryTab(
        ExtensionMessageType.PLAYLIST_UPDATED,
        payload.playlist,
    );
};

export const memberJoined = (
    payload: FromServerMessagePayloadMap[FromServerMessageType.MEMBER_JOINED],
): void => {
    globalState.room.members = payload.members;
    bgMessagingClient.sendMessageToPrimaryTab(
        ExtensionMessageType.MEMBERS_UPDATED,
        payload.members,
    );
};

export const memberDisconnected = (
    payload: FromServerMessagePayloadMap[FromServerMessageType.MEMBER_DISCONNECTED],
): void => {
    globalState.room.members = payload.members;
    bgMessagingClient.sendMessageToPrimaryTab(
        ExtensionMessageType.MEMBERS_UPDATED,
        payload.members,
    );
};

export const memberUpdated = (
    payload: FromServerMessagePayloadMap[FromServerMessageType.MEMBER_UPDATED],
): void => {
    globalState.room.members = payload.members;
    bgMessagingClient.sendMessageToPrimaryTab(
        ExtensionMessageType.MEMBERS_UPDATED,
        payload.members,
    );
};

export const isAdminUpdated = (
    payload: FromServerMessagePayloadMap[FromServerMessageType.IS_ADMIN_UPDATED],
): void => {
    globalState.is_admin = payload.is_admin;
    bgMessagingClient.sendMessageToPrimaryTab(
        ExtensionMessageType.ADMIN_STATUS_UPDATED,
        payload.is_admin,
    );
};

export const playerStateUpdated = (
    payload: FromServerMessagePayloadMap[FromServerMessageType.PLAYER_STATE_UPDATED],
): void => {
    globalState.room.player = payload.player;

    bgMessagingClient.sendMessageToPrimaryTab(
        ExtensionMessageType.PLAYER_STATE_UPDATED,
        payload.player,
    );

    //? indicates loss of player_video_updated msg, should also get updated playlist
    // if (payload.player.video_url !== globalState.room.player.video_url) {
    //     bgMessagingClient.sendMessageToPrimaryTab(
    //         ExtensionMessageType.PLAYER_VIDEO_UPDATED,
    //         payload.player.video_url,
    //     );
    // }
};

export const playerVideoUpdated = (
    payload: FromServerMessagePayloadMap[FromServerMessageType.PLAYER_VIDEO_UPDATED],
): void => {
    globalState.room.playlist = payload.playlist;
    globalState.room.player = payload.player;

    bgMessagingClient.sendMessageToPrimaryTab(
        ExtensionMessageType.PLAYLIST_UPDATED,
        payload.playlist,
    );

    bgMessagingClient.sendMessageToPrimaryTab(
        ExtensionMessageType.PLAYER_VIDEO_UPDATED,
        payload.player.video_url,
    );

    if (payload.playlist.last_video) {
        bgMessagingClient.sendMessageToPrimaryTab(
            ExtensionMessageType.LAST_VIDEO_UPDATED,
            payload.playlist.last_video,
        );
    }
};
