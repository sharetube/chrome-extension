import { getVideoUrlFromLink } from "@shared/api/getVideoUrlFromLink";
import { ContentScriptMessagingClient } from "@shared/client/client";
import waitForElement from "@shared/lib/waitForElement";
import { CSLogger } from "@shared/logging/logger";
import {
	type ExtensionMessagePayloadMap,
	type ExtensionMessageResponseMap,
	ExtensionMessageType,
} from "types/extensionMessage";
import { Mode } from "types/mode";
import type { PlayerStateType } from "types/player.type";
import { dateNowInUs } from "../../shared/dateNowInUs";

interface MastheadElement extends HTMLElement {
	theater: boolean;
}

const logger = CSLogger.getInstance();

class Player {
	private parent: HTMLElement;
	private player: HTMLVideoElement;
	private endScreen: HTMLDivElement | undefined;

	private isAdmin: boolean;
	private videoId: number;

	private mode: Mode;
	private muted: boolean | undefined;
	private isReady: boolean;
	private isEnded: boolean;
	private videoChanged: boolean;
	private adShowing: boolean;
	private isDataLoaded: boolean;
	private ignoreSeekingCount: number;
	private ignorePlayCount: number;
	private ignorePauseCount: number;

	private contentScriptMessagingClient: ContentScriptMessagingClient;
	private parentObserver: MutationObserver;
	private endScreenObserver: MutationObserver;
	private abortController: AbortController;

	constructor(e: HTMLElement, player: HTMLVideoElement) {
		this.parent = e;
		this.player = player;

		this.isAdmin = false;
		this.videoId = 0;

		this.parentObserver = new MutationObserver((mutations) => {
			for (const mutation of mutations) {
				if (mutation.attributeName === "class") {
					this.handleAdChanged(this.parent.classList);
					this.handleModeChanged(this.parent.classList);
				}
				break;
			}
		});

		this.endScreenObserver = new MutationObserver((mutations) => {
			if (!this.isReady || !this.isDataLoaded) return;
			for (const mutation of mutations) {
				if (mutation.attributeName === "style") {
					if (!(mutation.target as HTMLDivElement).getAttribute("style")) {
						this.handleEnd();
						this.endScreen
							?.querySelector(".ytp-endscreen-content")
							?.childNodes.forEach((elem) => {
								const newElem = elem.cloneNode(true) as HTMLAnchorElement;
								elem.replaceWith(newElem);
								newElem.addEventListener("click", (event) => {
									event.preventDefault();

									ContentScriptMessagingClient.sendMessage(
										ExtensionMessageType.ADD_VIDEO,
										getVideoUrlFromLink(newElem.href),
									);
								});
							});
					}
					break;
				}
			}
		});

		ContentScriptMessagingClient.sendMessage(
			ExtensionMessageType.GET_IS_ADMIN,
		).then(
			(res: ExtensionMessageResponseMap[ExtensionMessageType.GET_IS_ADMIN]) => {
				this.isAdmin = res;
			},
		);

		ContentScriptMessagingClient.sendMessage(
			ExtensionMessageType.GET_CURRENT_VIDEO,
		).then(
			(
				res: ExtensionMessageResponseMap[ExtensionMessageType.GET_CURRENT_VIDEO],
			) => {
				this.videoId = res.id;
			},
		);

		this.mode = Mode.DEFAULT;
		this.isReady = false;
		this.isEnded = false;
		this.videoChanged = true;
		this.adShowing = false;
		this.isDataLoaded = false;
		this.ignoreSeekingCount = 0;
		this.ignorePlayCount = 0;
		this.ignorePauseCount = 0;

		this.contentScriptMessagingClient = new ContentScriptMessagingClient();

		this.contentScriptMessagingClient.addHandler(
			ExtensionMessageType.CURRENT_VIDEO_UPDATED,
			(
				res: ExtensionMessagePayloadMap[ExtensionMessageType.CURRENT_VIDEO_UPDATED],
			) => {
				this.videoId = res.id;
				this.updateVideo(res.url);
			},
		);

		this.contentScriptMessagingClient.addHandler(
			ExtensionMessageType.PLAYER_STATE_UPDATED,
			(
				state: ExtensionMessagePayloadMap[ExtensionMessageType.PLAYER_STATE_UPDATED],
			) => {
				logger.log("received new player state", state);
				this.isEnded = false;
				if (this.adShowing) return;
				this.setState(state);
			},
		);

		this.contentScriptMessagingClient.addHandler(
			ExtensionMessageType.ADMIN_STATUS_UPDATED,
			(
				payload: ExtensionMessagePayloadMap[ExtensionMessageType.ADMIN_STATUS_UPDATED],
			) => {
				logger.log("admin status updated", { isAdmin: payload });
				this.isAdmin = payload;
			},
		);

		this.contentScriptMessagingClient.addHandler(
			ExtensionMessageType.VIDEO_ENDED,
			() => {
				if (this.isEnded) return;
				this.isEnded = true;
				this.endVideo();
			},
		);

		this.abortController = new AbortController();

		this.observeParent();
		this.observeEndscreen();
		this.removeCeVideos();
		this.addEventListeners();
		this.sendMute();
	}

	private addEventListeners() {
		// Mute handle
		this.player.addEventListener("volumechange", this.handleMute.bind(this), {
			signal: this.abortController.signal,
		});
		this.player.addEventListener("play", this.handlePlay.bind(this), {
			signal: this.abortController.signal,
		});
		this.player.addEventListener("pause", this.handlePause.bind(this), {
			signal: this.abortController.signal,
		});
		this.player.addEventListener("seeking", this.handleSeeking.bind(this), {
			signal: this.abortController.signal,
		});
		this.player.addEventListener(
			"ratechange",
			this.handleRatechange.bind(this),
			{
				signal: this.abortController.signal,
			},
		);
		this.player.addEventListener("waiting", this.handleWaiting.bind(this), {
			signal: this.abortController.signal,
		});
		this.player.addEventListener("canplay", this.handleCanplay.bind(this), {
			signal: this.abortController.signal,
		});
		this.player.addEventListener(
			"loadeddata",
			this.handleLoadedData.bind(this),
			{
				signal: this.abortController.signal,
			},
		);
		this.player.addEventListener("emptied", this.handleEmptied.bind(this), {
			signal: this.abortController.signal,
		});
	}

	private clearEventListeners() {
		this.abortController.abort(); // Removes all listeners attached with this controller
		this.abortController = new AbortController();
	}

	private clearContentScriptHandlers() {
		this.contentScriptMessagingClient.removeHandler(
			ExtensionMessageType.CURRENT_VIDEO_UPDATED,
		);
		this.contentScriptMessagingClient.removeHandler(
			ExtensionMessageType.PLAYER_STATE_UPDATED,
		);
		this.contentScriptMessagingClient.removeHandler(
			ExtensionMessageType.ADMIN_STATUS_UPDATED,
		);
		this.contentScriptMessagingClient.removeHandler(
			ExtensionMessageType.VIDEO_ENDED,
		);
	}

	private clearEndScreenObserver() {
		this.endScreenObserver.disconnect();
	}

	public clearAll() {
		logger.log("clearAll");
		this.clearUpdateIsReadyFalseTimeout();
		this.clearEventListeners();
		this.clearContentScriptHandlers();
		this.parentObserver.disconnect();
		this.clearEndScreenObserver();
		this.removeCeVideos();
	}

	private setActualState() {
		logger.log("setActualState");
		ContentScriptMessagingClient.sendMessage(
			ExtensionMessageType.GET_PLAYER_STATE,
		).then((state: PlayerStateType) => {
			logger.log("fetched player state", state);
			this.setState(state);
		});
	}

	private handleEnd() {
		logger.log("sending end");
		this.isEnded = true;

		if (this.isAdmin) {
			ContentScriptMessagingClient.sendMessage(
				ExtensionMessageType.VIDEO_ENDED,
			);
		}
	}

	//? add same for isReady true
	private udpateIsReadyFalseTimeout: NodeJS.Timeout | undefined;
	private setUpdateIsReadyFalseTimeout(): void {
		this.clearUpdateIsReadyFalseTimeout();
		this.udpateIsReadyFalseTimeout = setTimeout(() => {
			if (!this.isReady) return;
			logger.log("update is ready false timeout");
			this.isReady = false;
			ContentScriptMessagingClient.sendMessage(
				ExtensionMessageType.UPDATE_READY,
				false,
			);
			this.clearUpdateIsReadyFalseTimeout();
		}, 400);
	}

	private clearUpdateIsReadyFalseTimeout(): boolean {
		if (!this.udpateIsReadyFalseTimeout) {
			return false;
		}

		clearTimeout(this.udpateIsReadyFalseTimeout);
		this.udpateIsReadyFalseTimeout = undefined;
		return true;
	}

	// Handlers
	private handleWaiting() {
		logger.log("waiting");
		if (!this.isEnded && this.isDataLoaded) {
			this.setUpdateIsReadyFalseTimeout();
		}
	}

	private handleEmptied() {
		if (this.adShowing) {
			logger.log("emptied ignored because ad is showing");
			return;
		}
		logger.log("emptied");

		if (this.videoChanged) {
			logger.log("moving to start after video change");
			this.videoChanged = false;
			this.clearEndScreenObserver();
			this.observeEndscreen();
		}

		this.isDataLoaded = false;
		this.isReady = false;
	}

	private handlePause() {
		if (this.adShowing) {
			logger.log("pause ignored because ad is showing");
			return;
		}

		if (this.isEnded) {
			logger.log("pause ignored because ended");
			return;
		}

		if (this.ignorePauseCount > 0) {
			logger.log("pause ignored");
			this.ignorePauseCount--;
			return;
		}
		logger.log("pause");

		this.handleStateChanged();
	}

	private handleCanplay() {
		if (this.adShowing) {
			logger.log("canplay ignored because ad is showing");
			return;
		}

		logger.log("canplay");
		if (!this.clearUpdateIsReadyFalseTimeout() || !this.isReady) {
			if (this.isReady) return;
			this.isReady = true;
			logger.log("sending is ready true");
			ContentScriptMessagingClient.sendMessage(
				ExtensionMessageType.UPDATE_READY,
				true,
			);
			this.setActualState();
		}
	}

	private handleLoadedData() {
		if (this.adShowing) {
			logger.log("loaded data ignored because ad is showing");
			return;
		}

		logger.log("loaded data");
		this.isDataLoaded = true;
	}

	private handlePlay() {
		if (this.adShowing) {
			logger.log("play ignored because ad is showing");
			return;
		}

		if (!this.isDataLoaded) {
			logger.log("play ignored because data not loaded");
			return;
		}

		if (this.ignorePlayCount > 0) {
			logger.log("play ignored");
			this.ignorePlayCount--;
			return;
		}
		logger.log("play");

		this.handleStateChanged();
	}

	private handleSeeking() {
		if (this.adShowing) {
			logger.log("seeking ignored because ad is showing");
			return;
		}

		if (this.ignoreSeekingCount > 0) {
			logger.log("seeking ignored");
			this.ignoreSeekingCount--;
			return;
		}

		logger.log("seeking");
		this.isEnded = false;
		this.setUpdateIsReadyFalseTimeout();
		this.handleStateChanged();
	}

	private handleRatechange() {
		if (this.adShowing) {
			logger.log("ratechange ignored because ad is showing");
			return;
		}
		logger.log("ratechange");

		this.handleStateChanged();
	}

	// Mute
	private sendMute() {
		ContentScriptMessagingClient.sendMessage(
			ExtensionMessageType.UPDATE_MUTED,
			this.muted,
		);
	}

	private handleMute() {
		if (this.player.muted === this.muted) {
			logger.log("mute ignored");
			return;
		}
		logger.log("mute");
		this.muted = this.player.muted;
		this.sendMute();
	}

	private endVideo() {
		if (!this.getIsPlaying()) {
			this.ignorePlayCount++;
		}
		(this.player.play() as Promise<void>).catch(() => {
			logger.log("error calling play, clicking player...");
			this.clickPlayButton();
		});

		this.player.currentTime = this.player.duration + 1;
		this.ignoreSeekingCount++;
	}

	private setState(state: PlayerStateType) {
		let ct: number;
		if (state.is_playing) {
			const delta = dateNowInUs() - state.updated_at;
			ct = Math.round(state.current_time + delta * state.playback_rate) / 1e6;
			logger.log("delta", { delta });
		} else {
			ct = state.current_time / 1e6;
		}

		if (state.is_playing && !this.getIsPlaying()) {
			this.ignorePlayCount++;
		} else if (!state.is_playing && this.getIsPlaying()) {
			this.ignorePauseCount++;
		}
		if (state.is_playing) {
			(this.player.play() as Promise<void>).catch(() => {
				logger.log("error calling play, clicking player...");
				this.clickPlayButton();
			});
		} else {
			this.player.pause();
		}
		this.player.currentTime = ct;
		this.ignoreSeekingCount++;

		this.player.playbackRate = state.playback_rate;

		logger.log("set player state", {
			current_time: ct,
			playback_rate: state.playback_rate,
			is_playing: state.is_playing,
		});
	}

	private clickPlayButton() {
		(
			document.querySelector(
				".ytp-cued-thumbnail-overlay > button",
			) as HTMLElement
		).click();
	}

	private getIsPlaying(): boolean {
		return !this.player.paused;
	}

	private getState(): PlayerStateType {
		const s = {
			updated_at: dateNowInUs(),
			current_time: Math.round(this.player.currentTime * 1e6),
			playback_rate: this.player.playbackRate,
			is_playing: this.getIsPlaying(),
		};
		logger.log("get state returned", s);
		return s;
	}

	private handleStateChanged() {
		if (!this.isReady) return;
		if (this.isAdmin) {
			logger.log("sending state to server");
			ContentScriptMessagingClient.sendMessage(
				ExtensionMessageType.UPDATE_PLAYER_STATE,
				{
					video_id: this.videoId,
					...this.getState(),
				},
			);
		} else {
			this.setActualState();
		}
	}

	private updateVideo(videoUrl: string) {
		logger.log("updateVideo", { videoUrl });
		this.isDataLoaded = false;
		this.adShowing = false;
		this.ignoreSeekingCount = 0;
		this.ignorePlayCount = 0;
		this.ignorePauseCount = 0;
		this.videoChanged = true;
		this.isEnded = false;
		window.postMessage({ type: "SKIP", payload: videoUrl }, "*");
	}

	// Ad handling
	private handleAdChanged(cl: DOMTokenList): void {
		const adShowing = cl.contains("ad-showing");
		if (this.adShowing === adShowing) return;

		logger.log("ad changed", { was: this.adShowing, now: adShowing });
		this.adShowing = adShowing;
		if (this.adShowing) {
			// this.clickPlayButton();
			this.clearUpdateIsReadyFalseTimeout();
			this.isReady = false;
			ContentScriptMessagingClient.sendMessage(
				ExtensionMessageType.UPDATE_READY,
				false,
			);
		} else {
			this.player.currentTime = 0;
		}
	}

	// Player mode
	private handleModeChanged(cl: DOMTokenList): void {
		const classNames = Array.from(cl);
		const c = (className: string) => classNames.includes(className);

		if (c("ytp-modern-miniplayer")) {
			this.setMode(Mode.MINI);
			return;
		}

		if (c("ytp-fullscreen") && c("ytp-big-mode")) {
			this.setMode(Mode.FULL);
			return;
		}

		const masthead = document.querySelector(
			"#content > #masthead-container > #masthead",
		) as MastheadElement;

		if (masthead?.hasAttribute("theater")) {
			this.setMode(Mode.THEATER);
			return;
		}

		this.setMode(Mode.DEFAULT);
	}

	private setMode(mode: Mode) {
		if (this.mode === mode) return;
		this.mode = mode;
	}

	private observeParent(): void {
		this.parentObserver.observe(this.parent, {
			attributes: true,
			attributeFilter: ["class"],
		});
	}

	private observeEndscreen(): void {
		waitForElement(".html5-endscreen", this.parent).then((endScreen) => {
			this.endScreen = endScreen as HTMLDivElement;
			this.endScreenObserver.observe(endScreen, {
				attributes: true,
				attributeFilter: ["style"],
			});
		});
	}

	private removeCeVideos() {
		waitForElement(".ytp-ce-video", this.parent)
			.then(() => {
				this.parent.querySelectorAll(".ytp-ce-video").forEach((e) => {
					e.remove();
				});
			})
			.catch(() => {});
	}
}

export default Player;
