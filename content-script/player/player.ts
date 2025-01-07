import { dateNowInUs } from "../../shared/dateNowInUs";
import { log } from "../../shared/log";
import { ContentScriptMessagingClient } from "@shared/client/client";
import {
    ExtensionMessagePayloadMap,
    ExtensionMessageResponseMap,
    ExtensionMessageType,
} from "types/extensionMessage";
import { Mode } from "types/mode";
import { PlayerStateType, PlayerType } from "types/player.type";

interface MastheadElement extends HTMLElement {
    theater: boolean;
}

class Player {
    private _e: HTMLElement; // todo: rename
    private _player: HTMLVideoElement;

    private _isAdmin: boolean;

    private _mode: Mode;
    private _muted: boolean | null;
    private _videoUrl: string;
    private _isReady: boolean;
    private _adShowing: boolean;
    private _isDataLoaded: boolean;
    private _ignoreSeekingCount: number;
    private _ignorePlayCount: number;
    private _ignorePauseCount: number;

    private _contentScriptMessagingClient: ContentScriptMessagingClient;
    private observer: MutationObserver | null = null;
    private abortController: AbortController;

    public constructor(e: HTMLElement, p: HTMLVideoElement) {
        this._e = e;
        this._player = p;
        this._isAdmin = false;

        ContentScriptMessagingClient.sendMessage(ExtensionMessageType.GET_IS_ADMIN).then(
            (res: ExtensionMessageResponseMap[ExtensionMessageType.GET_IS_ADMIN]) => {
                this._isAdmin = res;
            },
        );

        this._mode = Mode.DEFAULT;
        this._muted = null;
        this._videoUrl = "";
        this._isReady = false;
        this._adShowing = false;
        this._isDataLoaded = false;
        this._ignoreSeekingCount = 0;
        this._ignorePlayCount = 0;
        this._ignorePauseCount = 0;

        this._contentScriptMessagingClient = new ContentScriptMessagingClient();
        ContentScriptMessagingClient.sendMessage(ExtensionMessageType.GET_PLAYER_VIDEO_URL).then(
            (url: string) => {
                this._videoUrl = url;
            },
        );

        this._contentScriptMessagingClient.addHandler(
            ExtensionMessageType.PLAYER_VIDEO_UPDATED,
            (videoUrl: ExtensionMessagePayloadMap[ExtensionMessageType.PLAYER_VIDEO_UPDATED]) => {
                this._videoUrl = videoUrl;
                this.updateVideo(videoUrl);
            },
        );

        this._contentScriptMessagingClient.addHandler(
            ExtensionMessageType.PLAYER_STATE_UPDATED,
            (state: ExtensionMessagePayloadMap[ExtensionMessageType.PLAYER_STATE_UPDATED]) => {
                if (this._adShowing) return;
                this.setState(state);
            },
        );

        this._contentScriptMessagingClient.addHandler(
            ExtensionMessageType.ADMIN_STATUS_UPDATED,
            (payload: ExtensionMessagePayloadMap[ExtensionMessageType.ADMIN_STATUS_UPDATED]) => {
                log("admin status updated", payload);
                this._isAdmin = payload;
            },
        );

        this.abortController = new AbortController();

        this.observeElement();
        this.addEventListeners();
        this.sendMute();
    }

    private addEventListeners() {
        // Mute handle
        this._player.addEventListener("volumechange", this.handleMute.bind(this), {
            signal: this.abortController.signal,
        });
        this._player.addEventListener("play", this.handlePlay.bind(this), {
            signal: this.abortController.signal,
        });
        this._player.addEventListener("pause", this.handlePause.bind(this), {
            signal: this.abortController.signal,
        });
        this._player.addEventListener("seeking", this.handleSeeking.bind(this), {
            signal: this.abortController.signal,
        });
        this._player.addEventListener("ratechange", this.handleRatechange.bind(this), {
            signal: this.abortController.signal,
        });
        this._player.addEventListener("waiting", this.handleWaiting.bind(this), {
            signal: this.abortController.signal,
        });
        this._player.addEventListener("canplay", this.handleCanplay.bind(this), {
            signal: this.abortController.signal,
        });
        this._player.addEventListener("loadeddata", this.handleLoadedData.bind(this), {
            signal: this.abortController.signal,
        });
        this._player.addEventListener("ended", this.handleEnded.bind(this), {
            signal: this.abortController.signal,
        });
        this._player.addEventListener("emptied", this.handleEmptied.bind(this), {
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
        this._contentScriptMessagingClient.removeHandler(ExtensionMessageType.PLAYER_VIDEO_UPDATED);
        this._contentScriptMessagingClient.removeHandler(ExtensionMessageType.PLAYER_STATE_UPDATED);
        this._contentScriptMessagingClient.removeHandler(ExtensionMessageType.ADMIN_STATUS_UPDATED);
    }

    public clearAll() {
        log("clearAll");
        this.clearUpdateIsReadyFalseTimeout();
        this.clearEventListeners();
        this.clearContentScriptHandlers();
        this.disconnectObserver();
    }

    private setActualState() {
        ContentScriptMessagingClient.sendMessage(ExtensionMessageType.GET_PLAYER_STATE).then(
            (state: PlayerStateType) => {
                log("fetched player state", state);
                this.setState(state);
            },
        );
    }

    private sendSkip() {
        ContentScriptMessagingClient.sendMessage(
            ExtensionMessageType.SKIP_CURRENT_VIDEO,
            dateNowInUs(),
        );
    }

    //? add same for isReady true
    private udpateIsReadyFalseTimeout: NodeJS.Timeout | null = null;
    private setUpdateIsReadyFalseTimeout(): void {
        this.clearUpdateIsReadyFalseTimeout();
        this.udpateIsReadyFalseTimeout = setTimeout(() => {
            if (!this._isReady) return;
            log("update is ready false timeout");
            this._isReady = false;
            ContentScriptMessagingClient.sendMessage(ExtensionMessageType.UPDATE_READY, false);
            this.clearUpdateIsReadyFalseTimeout();
        }, 500);
    }

    private clearUpdateIsReadyFalseTimeout(): boolean {
        if (!this.udpateIsReadyFalseTimeout) {
            return false;
        }

        clearTimeout(this.udpateIsReadyFalseTimeout);
        this.udpateIsReadyFalseTimeout = null;
        return true;
    }

    // Handlers
    private handleKeyDown(event: KeyboardEvent) {
        switch (event.key) {
            case "ArrowRight":
                log("ArrowRight: video diration, current time");
                this._ignorePlayCount--;
                if (this._isAdmin && this._player.duration - this._player.currentTime < 5) {
                    this.sendSkip();
                }

                break;
            case "ArrowLeft":
                log("ArrowLeft");
                this._ignorePlayCount--;

                break;
        }
    }

    private handleWaiting() {
        log("waiting");
        if (this._isDataLoaded) {
            this.setUpdateIsReadyFalseTimeout();
        }
    }

    private handleEnded() {
        log("ended");
        if (this._isAdmin) {
            this.sendSkip();
        }
    }

    private handleEmptied() {
        log("emptied");
        if (this._adShowing) {
            log("ignored emptied because ad is showing");
            return;
        }

        this._isReady = false;
        this._ignoreSeekingCount = 0;
        this._ignorePlayCount = 0;
        this._ignorePauseCount = 0;
    }

    private handlePause() {
        log("pause");
        if (this._adShowing) {
            log("ignored pause because ad is showing");
            return;
        }

        if (this._ignorePauseCount > 0) {
            log("pause ignored");
            this._ignorePauseCount--;
            return;
        }

        this.handleStateChanged();
    }

    private handleCanplay() {
        log("canplay");
        if (this._adShowing) {
            log("ignored canplay because ad is showing");
            return;
        }

        if (!this.clearUpdateIsReadyFalseTimeout()) {
            if (this._isReady) return;
            this._isReady = true;
            this.setActualState();
            ContentScriptMessagingClient.sendMessage(ExtensionMessageType.UPDATE_READY, true);
        }
    }

    private handleLoadedData() {
        log("loaded data");
        if (this._adShowing) {
            log("ignored loaded data because ad is showing");
            return;
        }

        this._isDataLoaded = true;
    }

    private handlePlay() {
        log("play");
        if (this._adShowing) {
            log("ignored play because ad is showing");
            return;
        }

        if (!this._isDataLoaded) {
            log("play ignored because data not loaded");
            return;
        }

        if (this._ignorePlayCount > 0) {
            log("play ignored");
            this._ignorePlayCount--;
            return;
        }

        this.handleStateChanged();
    }

    private handleSeeking() {
        log("seeking");
        if (this._adShowing) {
            log("ignored seeking because ad is showing");
            return;
        }

        if (this._ignoreSeekingCount > 0) {
            log("seeking ignored");
            this._ignoreSeekingCount--;
            return;
        }

        if (this._isDataLoaded && this.getIsPlaying()) {
            log("ignore play count ++", this._ignorePlayCount);
            this._ignorePlayCount++;
        }
        this.handleStateChanged();
    }

    private handleRatechange() {
        log("ratechange");
        if (this._adShowing) {
            log("ignored ratechange because ad is showing");
            return;
        }

        this.handleStateChanged();
    }

    // Mute
    private sendMute() {
        ContentScriptMessagingClient.sendMessage(ExtensionMessageType.UPDATE_MUTED, this._muted!);
    }

    private handleMute() {
        log("mute");
        if (this._player.muted === this._muted) {
            return;
        } else {
            this._muted = this._player.muted;
            this.sendMute();
        }
    }

    public setState(state: PlayerStateType) {
        let ct;
        if (state.is_playing) {
            ct =
                Math.round(
                    state.current_time + (dateNowInUs() - state.updated_at) * state.playback_rate,
                ) / 1e6;
        } else {
            ct = state.current_time / 1e6;
        }

        if (state.is_playing && !this.getIsPlaying()) {
            this._ignorePlayCount++;
        } else if (!state.is_playing && this.getIsPlaying()) {
            this._ignorePauseCount++;
        }
        this._player[state.is_playing ? "play" : "pause"]();

        this._player.currentTime = ct;
        this._ignoreSeekingCount++;

        this._player.playbackRate = state.playback_rate;

        log("setted player state", {
            current_time: ct,
            playback_rate: state.playback_rate,
            is_playing: state.is_playing,
        });
    }

    public getIsPlaying(): boolean {
        return !this._player.paused;
    }

    public getState(): PlayerType {
        const s = {
            video_url: this._videoUrl,
            updated_at: dateNowInUs(),
            current_time: Math.round(this._player.currentTime * 1e6),
            playback_rate: this._player.playbackRate,
            is_playing: this.getIsPlaying(),
        };
        log("get state returned: ", s);
        return s;
    }

    private handleStateChanged() {
        if (!this._isReady) return;
        if (this._isAdmin) {
            ContentScriptMessagingClient.sendMessage(
                ExtensionMessageType.UPDATE_PLAYER_STATE,
                this.getState(),
            );
        } else {
            this.setActualState();
        }
    }

    private updateVideo(videoUrl: string) {
        window.postMessage({ type: "SKIP", payload: videoUrl }, "*");
        this._adShowing = false;
        this._isDataLoaded = false;
    }

    private observeElement(): void {
        this.observer = new MutationObserver(mutations => {
            // todo: optimize by breaking loop
            mutations.forEach(mutation => {
                if (mutation.type === "attributes" && mutation.attributeName === "class") {
                    this.handleAdChanged(this._e.classList);
                    this.handleModeChanged(this._e.classList);
                }
            });
        });

        this.observer.observe(this._e, {
            attributes: true,
            attributeFilter: ["class"],
        });
    }

    private disconnectObserver(): void {
        if (!this.observer) return;
        this.observer.disconnect();
        this.observer = null;
    }

    // Ad showing
    private handleAdChanged(cl: DOMTokenList): void {
        const adShowing = cl.contains("ad-showing");
        if (this._adShowing === adShowing) return;

        log("ad showing", this._adShowing, adShowing);
        this._adShowing = adShowing;
        if (this._adShowing) {
            this._isReady = false;
            ContentScriptMessagingClient.sendMessage(ExtensionMessageType.UPDATE_READY, false);
        } else {
            this._isReady = true;
            ContentScriptMessagingClient.sendMessage(ExtensionMessageType.UPDATE_READY, true);
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
        ) as MastheadElement | null;

        if (masthead && masthead.hasAttribute("theater")) {
            this.setMode(Mode.THEATER);
            return;
        }

        this.setMode(Mode.DEFAULT);
    }

    private setMode(mode: Mode) {
        if (this._mode === mode) return;
        this._mode = mode;
    }
}

export default Player;
