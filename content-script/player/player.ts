import { dateNowInUs } from "../../shared/dateNowInUs";
import { ContentScriptMessagingClient } from "@shared/client/client";
import { CSLogger } from "@shared/logging/logger";
import {
    ExtensionMessagePayloadMap,
    ExtensionMessageResponseMap,
    ExtensionMessageType,
} from "types/extensionMessage";
import { Mode } from "types/mode";
import { PlayerType } from "types/player.type";

interface MastheadElement extends HTMLElement {
    theater: boolean;
}

const logger = CSLogger.getInstance();

class Player {
    private e: HTMLElement; // todo: rename
    private player: HTMLVideoElement;

    private isAdmin: boolean;
    private videoId: number;

    private mode: Mode;
    private muted: boolean | undefined;
    private isReady: boolean;
    private isEnded: boolean;
    private moveToStartAfterVideoChange: boolean;
    private adShowing: boolean;
    private isDataLoaded: boolean;
    private ignoreSeekingCount: number;
    private ignorePlayCount: number;
    private ignorePauseCount: number;

    private contentScriptMessagingClient: ContentScriptMessagingClient;
    private observer: MutationObserver | undefined;
    private abortController: AbortController;

    constructor(e: HTMLElement, p: HTMLVideoElement) {
        this.e = e;
        this.player = p;

        this.isAdmin = false;
        this.videoId = 0;

        ContentScriptMessagingClient.sendMessage(ExtensionMessageType.GET_IS_ADMIN).then(
            (res: ExtensionMessageResponseMap[ExtensionMessageType.GET_IS_ADMIN]) => {
                this.isAdmin = res;
            },
        );

        ContentScriptMessagingClient.sendMessage(ExtensionMessageType.GET_CURRENT_VIDEO).then(
            (res: ExtensionMessageResponseMap[ExtensionMessageType.GET_CURRENT_VIDEO]) => {
                this.videoId = res.id;
            },
        );

        this.mode = Mode.DEFAULT;
        this.isReady = false;
        this.isEnded = false;
        this.moveToStartAfterVideoChange = true;
        this.adShowing = false;
        this.isDataLoaded = false;
        this.ignoreSeekingCount = 0;
        this.ignorePlayCount = 0;
        this.ignorePauseCount = 0;

        this.contentScriptMessagingClient = new ContentScriptMessagingClient();

        this.contentScriptMessagingClient.addHandler(
            ExtensionMessageType.CURRENT_VIDEO_UPDATED,
            (res: ExtensionMessagePayloadMap[ExtensionMessageType.CURRENT_VIDEO_UPDATED]) => {
                this.videoId = res.id;
                this.updateVideo(res.url);
            },
        );

        this.contentScriptMessagingClient.addHandler(
            ExtensionMessageType.PLAYER_STATE_UPDATED,
            (state: ExtensionMessagePayloadMap[ExtensionMessageType.PLAYER_STATE_UPDATED]) => {
                logger.log("recieved new player state", state);
                if (this.adShowing) return;
                this.setState(state);
            },
        );

        this.contentScriptMessagingClient.addHandler(
            ExtensionMessageType.ADMIN_STATUS_UPDATED,
            (payload: ExtensionMessagePayloadMap[ExtensionMessageType.ADMIN_STATUS_UPDATED]) => {
                logger.log("admin status updated", { isAdmin: payload });
                this.isAdmin = payload;
            },
        );

        this.abortController = new AbortController();

        this.observeElement();
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
        this.player.addEventListener("ratechange", this.handleRatechange.bind(this), {
            signal: this.abortController.signal,
        });
        this.player.addEventListener("waiting", this.handleWaiting.bind(this), {
            signal: this.abortController.signal,
        });
        this.player.addEventListener("canplay", this.handleCanplay.bind(this), {
            signal: this.abortController.signal,
        });
        this.player.addEventListener("loadeddata", this.handleLoadedData.bind(this), {
            signal: this.abortController.signal,
        });
        this.player.addEventListener("ended", this.handleEnded.bind(this), {
            signal: this.abortController.signal,
        });
        this.player.addEventListener("emptied", this.handleEmptied.bind(this), {
            signal: this.abortController.signal,
        });

        document.addEventListener("keydown", this.handleKeyDown.bind(this), {
            signal: this.abortController.signal,
        });
    }

    private clearEventListeners() {
        this.abortController.abort(); // Removes all listeners attached with this controller
        this.abortController = new AbortController();
    }

    private clearContentScriptHandlers() {
        this.contentScriptMessagingClient.removeHandler(ExtensionMessageType.CURRENT_VIDEO_UPDATED);
        this.contentScriptMessagingClient.removeHandler(ExtensionMessageType.PLAYER_STATE_UPDATED);
        this.contentScriptMessagingClient.removeHandler(ExtensionMessageType.ADMIN_STATUS_UPDATED);
    }

    private disconnectObserver(): void {
        if (!this.observer) return;
        this.observer.disconnect();
        this.observer = undefined;
    }

    public clearAll() {
        logger.log("clearAll");
        this.clearUpdateIsReadyFalseTimeout();
        this.clearEventListeners();
        this.clearContentScriptHandlers();
        this.disconnectObserver();
    }

    private setActualState() {
        logger.log("setActualState");
        ContentScriptMessagingClient.sendMessage(ExtensionMessageType.GET_PLAYER_STATE).then(
            (state: PlayerType) => {
                logger.log("fetched player state", state);
                this.setState(state);
            },
        );
    }

    private sendSkip() {
        logger.log("sending skip");
        if (this.isEnded) {
            this.setActualState();
            return;
        }

        logger.log("sending skip 2");
        this.isEnded = true;

        ContentScriptMessagingClient.sendMessage(
            ExtensionMessageType.VIDEO_ENDED,
            dateNowInUs(),
        ).then(res => {
            if (res) return;

            const state = this.getState();
            state.is_ended = true;
            this.setState(state);
            this.handleStateChanged();
        });
    }

    private handlePauseTimeout: NodeJS.Timeout | undefined;
    private setHandlePauseTimeout(): void {
        logger.log("setUpdateIsReadyFalseTimeout");
        this.clearHandlePauseTimeout();
        this.handlePauseTimeout = setTimeout(() => {
            logger.log("pause timeout");
            this.handleStateChanged();
        }, 4);
    }

    private clearHandlePauseTimeout(): boolean {
        if (!this.handlePauseTimeout) return false;

        clearTimeout(this.handlePauseTimeout);
        this.handlePauseTimeout = undefined;
        return true;
    }

    //? add same for isReady true
    private udpateIsReadyFalseTimeout: NodeJS.Timeout | undefined;
    private setUpdateIsReadyFalseTimeout(): void {
        this.clearUpdateIsReadyFalseTimeout();
        this.udpateIsReadyFalseTimeout = setTimeout(() => {
            if (!this.isReady) return;
            logger.log("update is ready false timeout");
            this.isReady = false;
            ContentScriptMessagingClient.sendMessage(ExtensionMessageType.UPDATE_READY, false);
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
    private handleKeyDown(event: KeyboardEvent) {
        switch (event.key) {
            case "ArrowRight":
                logger.log("ArrowRight");
                if (this.isAdmin && this.player.duration - this.player.currentTime < 5) {
                    this.sendSkip();
                }

                break;
            case "ArrowLeft":
                logger.log("ArrowLeft");

                break;
        }
    }

    private handleWaiting() {
        logger.log("waiting");
        if (this.isDataLoaded) {
            this.setUpdateIsReadyFalseTimeout();
        }
    }

    private handleEnded() {
        logger.log("ended");
        if (!this.isAdmin) {
            logger.log("ended ignored because is not admin");
            return;
        }

        this.clearHandlePauseTimeout();
        this.sendSkip();
    }

    private handleEmptied() {
        if (this.adShowing) {
            logger.log("emptied ignored because ad is showing");
            return;
        }
        logger.log("emptied");

        if (this.moveToStartAfterVideoChange) {
            logger.log("moving to start after video change");
            this.moveToStartAfterVideoChange = false;
            this.player.currentTime = 0;
        }

        this.isDataLoaded = false;
        this.isReady = false;
    }

    private handlePause() {
        if (this.adShowing) {
            logger.log("pause ignored because ad is showing");
            return;
        }

        if (this.ignorePauseCount > 0) {
            logger.log("pause ignored");
            this.ignorePauseCount--;
            return;
        }
        logger.log("pause");

        this.setHandlePauseTimeout();
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
            ContentScriptMessagingClient.sendMessage(ExtensionMessageType.UPDATE_READY, true);
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

        if (this.isEnded) {
            logger.log("play ignored because video ended");
            this.setActualState();
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
        ContentScriptMessagingClient.sendMessage(ExtensionMessageType.UPDATE_MUTED, this.muted!);
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

    private setState(state: PlayerType) {
        let ct;
        if (state.is_ended) {
            // 1s - too low
            // 2s - ok
            // todo: try to low as possible, in range 1-2s
            ct = this.player.duration - 2;
        } else {
            if (state.is_playing) {
                const delta = dateNowInUs() - state.updated_at;
                ct = Math.round(state.current_time + delta * state.playback_rate) / 1e6;
                logger.log("delta", { delta });
            } else {
                ct = state.current_time / 1e6;
            }
        }
        this.isEnded = state.is_ended;

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
        (document.querySelector(".ytp-cued-thumbnail-overlay > button") as HTMLElement).click();
    }

    private getIsPlaying(): boolean {
        return !this.player.paused;
    }

    private getState(): PlayerType {
        const s = {
            updated_at: dateNowInUs(),
            current_time: Math.round(this.player.currentTime * 1e6),
            playback_rate: this.player.playbackRate,
            is_ended: this.isEnded,
            is_playing: this.getIsPlaying(),
        };
        logger.log("get state returned", s);
        return s;
    }

    private handleStateChanged() {
        this.clearHandlePauseTimeout();
        if (!this.isReady) return;
        if (this.isAdmin) {
            logger.log("sending state to server");
            ContentScriptMessagingClient.sendMessage(ExtensionMessageType.UPDATE_PLAYER_STATE, {
                video_id: this.videoId,
                ...this.getState(),
            });
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
        this.moveToStartAfterVideoChange = true;
        this.isEnded = false;
        window.postMessage({ type: "SKIP", payload: videoUrl }, "*");
    }

    private observeElement(): void {
        this.observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if (mutation.type === "attributes" && mutation.attributeName === "class") {
                    this.handleAdChanged(this.e.classList);
                    this.handleModeChanged(this.e.classList);
                }
            });
        });

        this.observer.observe(this.e, {
            attributes: true,
            attributeFilter: ["class"],
        });
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
            ContentScriptMessagingClient.sendMessage(ExtensionMessageType.UPDATE_READY, false);
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

        if (masthead && masthead.hasAttribute("theater")) {
            this.setMode(Mode.THEATER);
            return;
        }

        this.setMode(Mode.DEFAULT);
    }

    private setMode(mode: Mode) {
        if (this.mode === mode) return;
        this.mode = mode;
    }
}

export default Player;
