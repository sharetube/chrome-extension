import { BackgroundMessagingClient } from "background-script/clients/ExtensionClient";
import { JWTStorage } from "background-script/jwtStorage";
import { BGLogger } from "background-script/logging/logger";
import { globalState, resetState } from "background-script/state";
import { getTargetPrimaryTabId } from "background-script/targetPrimaryTabId";
import { ExtensionMessageType } from "types/extensionMessage";
import type {
	FromServerMessagePayloadMap,
	FromServerMessageType,
} from "types/serverMessage";
import browser from "webextension-polyfill";

const bgMessagingClient = BackgroundMessagingClient.getInstance();
const jwtStorage = JWTStorage.getInstance();
const logger = BGLogger.getInstance();

export function joinedRoom(
	payload: FromServerMessagePayloadMap[FromServerMessageType.JOINED_ROOM],
): void {
	jwtStorage.set(payload.jwt);
	resetState();
	globalState.room = payload.room;
	globalState.isAdmin = payload.joined_member.is_admin;

	const videoPageLink = `https://youtube.com/watch?v=${payload.room.playlist.current_video.url}&t=0`;
	const targetPrimaryTabId = getTargetPrimaryTabId();
	if (targetPrimaryTabId) {
		browser.tabs.update(targetPrimaryTabId, { url: videoPageLink });
		// bgMessagingClient.sendMessage(
		//     targetPrimaryTabId,
		//     ExtensionMessageType.GO_TO_VIDEO,
		//     payload.room.player.video_url,
		// );
		// todo: skip that if target primary tab was primary tab
		globalState.waitingForPrimaryTab = true;
	} else {
		logger.log("No target primary tab found");
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
	globalState.isAdmin = payload.is_admin;
	bgMessagingClient.broadcastMessage(
		ExtensionMessageType.ADMIN_STATUS_UPDATED,
		payload.is_admin,
	);
};

export const playerStateUpdated = (
	payload: FromServerMessagePayloadMap[FromServerMessageType.PLAYER_STATE_UPDATED],
): void => {
	globalState.room.player = payload.player;
	if (
		payload.player.version === globalState.room.player.version &&
		payload.rid !== globalState.updatePlayerStateRid
	) {
		if (payload.player.is_ended) {
			bgMessagingClient.sendMessageToPrimaryTab(
				ExtensionMessageType.VIDEO_ENDED,
			);
		} else {
			bgMessagingClient.sendMessageToPrimaryTab(
				ExtensionMessageType.PLAYER_STATE_UPDATED,
				payload.player.state,
			);
		}

		//? indicates loss of player_video_updated msg, should also get updated playlist
		// if (payload.player.video_url !== globalState.room.player.video_url) {
		//     bgMessagingClient.sendMessageToPrimaryTab(
		//         ExtensionMessageType.PLAYER_VIDEO_UPDATED,
		//         payload.player.video_url,
		//     );
		// }
	}
};

export const playerVideoUpdated = (
	payload: FromServerMessagePayloadMap[FromServerMessageType.PLAYER_VIDEO_UPDATED],
): void => {
	globalState.room.playlist = payload.playlist;
	globalState.room.player = payload.player;
	globalState.room.members = payload.members;

	bgMessagingClient.sendMessageToPrimaryTab(
		ExtensionMessageType.CURRENT_VIDEO_UPDATED,
		payload.playlist.current_video,
	);

	bgMessagingClient.sendMessageToPrimaryTab(
		ExtensionMessageType.PLAYLIST_UPDATED,
		payload.playlist,
	);

	bgMessagingClient.sendMessageToPrimaryTab(
		ExtensionMessageType.MEMBERS_UPDATED,
		payload.members,
	);

	if (payload.playlist.last_video) {
		bgMessagingClient.sendMessageToPrimaryTab(
			ExtensionMessageType.LAST_VIDEO_UPDATED,
			payload.playlist.last_video,
		);
	}
};

export const kickedFromRoom = (): void => {
	logger.log("KICKED FROM ROOM");
	bgMessagingClient.sendMessageToPrimaryTab(ExtensionMessageType.KICKED);
};
