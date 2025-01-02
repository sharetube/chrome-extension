import { log } from "../../shared/log";
import { ContentScriptMessagingClient } from "@shared/client/client";
import debounce from "lodash.debounce";
import { ExtensionMessageType } from "types/extensionMessage";
import { PlayerStateType } from "types/player.type";

//! Вынести
enum Modes {
    Default = "default",
    Theater = "theater",
    Full = "full",
    Mini = "mini",
}

interface MastheadElement extends HTMLElement {
    theater: boolean;
}

class Player {
    private _e: HTMLElement; // todo: rename
    private _player: HTMLVideoElement;

    // todo: move initialization to constructor
    private _mode: Modes = Modes.Default;
    private _muted: boolean | null = null;
    private _isReady: boolean = false;
    private _adShowing: boolean = false;
    private _isDataLoaded: boolean = false;
    private _ignoreSeekingCount: number = 0;
    private _ignorePlayCount: number = 0;
    private _ignorePlayingCount: number = 0;
    private _ignorePauseCount: number = 0;

    private _contentScriptMessagingClient: ContentScriptMessagingClient;

    public constructor(e: HTMLElement, p: HTMLVideoElement) {
        this._e = e;
        this._player = p;
        this._contentScriptMessagingClient = new ContentScriptMessagingClient();

        this.observeElement();
        this.handleStateMessages();
        this.addEventListeners();

        this.sendMute();
    }

    private addEventListeners() {
        // Mute handle
        this._player.addEventListener("volumechange", this.handleMute.bind(this));
        // State handle
        this._player.addEventListener("play", this.handlePlay.bind(this));
        this._player.addEventListener("pause", this.handlePause.bind(this));
        this._player.addEventListener("seeking", this.handleSeeking.bind(this));
        this._player.addEventListener("ratechange", this.handleRatechange.bind(this));
        // Loading handle
        this._player.addEventListener("waiting", this.handleWaiting.bind(this));
        this._player.addEventListener("playing", this.handlePlaying.bind(this));
        this._player.addEventListener("loadeddata", this.handleLoadedData.bind(this));
        this._player.addEventListener("ended", this.handleEnded.bind(this));

        this._player.addEventListener("canplay", () => this.handleCanplay.bind(this));
        // this._p.addEventListener("canplaythrough", () => log("canplaythrough"));
        this._player.addEventListener("emptied", () => log("emptied"));
        this._player.addEventListener("error", () => log("error"));
        this._player.addEventListener("seeked", () => this.handleSeeked.bind(this));

        document.addEventListener("keydown", event => {
            switch (event.key) {
                case "ArrowRight":
                    this.handleRightArrowKey();
            }
        });
    }

    private setActualState() {
        ContentScriptMessagingClient.sendMessage(ExtensionMessageType.GET_PLAYER_STATE).then(
            (state: PlayerStateType) => {
                log("fetched player state", state);
                this.setState(state);
            },
        );
    }

    private debouncedUpdateIsReady = debounce(() => {
        log("sending update ready", this._isReady);
        ContentScriptMessagingClient.sendMessage(ExtensionMessageType.UPDATE_READY, this._isReady);
    }, 200);

    private debounceUpdateIsReady(value: boolean): void {
        log("debounced update ready", value, this._isReady);
        if (this._isReady === value) return;
        this._isReady = value;
        this.debouncedUpdateIsReady();
    }

    private handleRightArrowKey() {
        log(
            "ArrowRight: video diration, current time",
            this._player.duration,
            this._player.currentTime,
        );
        if (this._player.duration - this._player.currentTime < 5) {
            ContentScriptMessagingClient.sendMessage(ExtensionMessageType.SKIP_CURRENT_VIDEO);
        }
    }

    // Handlers
    private handleWaiting() {
        log("waiting");
        this.debounceUpdateIsReady(false);
    }

    private handleCanplay() {
        log("canplay");

        this.setActualState();
        this.debounceUpdateIsReady(true);
    }

    private handlePlaying() {
        log("playing");
        if (this._ignorePlayingCount > 0) {
            log("playing ignored");
            this._ignorePlayingCount--;
            return;
        }

        this.setActualState();
        this.debounceUpdateIsReady(true);
    }

    private handleSeeked() {
        log("seeked");
        this.setActualState();
        this.debounceUpdateIsReady(true);
    }

    private handleEnded() {
        log("ended");
        ContentScriptMessagingClient.sendMessage(ExtensionMessageType.SKIP_CURRENT_VIDEO);
    }

    private handleLoadedData() {
        log("loaded data");
        this._isDataLoaded = true;
        this.setActualState();
        this.debounceUpdateIsReady(true);
    }

    private handlePause() {
        log("pause");
        if (this._ignorePauseCount > 0) {
            log("pause ignored");
            this._ignorePauseCount--;
            return;
        }

        this.handleStateChanged();
    }

    private handlePlay() {
        log("play");
        if (!this._isDataLoaded) {
            log("play ignored because data not loaded");
            return;
        }

        if (this._ignorePlayCount > 0) {
            log("play ignored");
            this._ignorePlayCount--;
            // this.setActualState();
            return;
        }

        this._ignorePlayingCount++;
        this.handleStateChanged();
    }

    private handleSeeking() {
        log("seeking");
        if (this._ignoreSeekingCount > 0) {
            log("seeking ignored");
            this._ignoreSeekingCount--;
            return;
        }

        this._ignorePlayCount++;
        this.handleStateChanged();
    }

    private handleRatechange() {
        log("ratechange");
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

    // State
    public setState(state: PlayerStateType) {
        let ct;
        if (state.is_playing) {
            ct =
                Math.round(
                    state.current_time +
                        (Date.now() * 1e3 - state.updated_at) * state.playback_rate,
                ) / 1e6;
        } else {
            ct = state.current_time / 1e6;
        }

        if (state.is_playing && !this.getIsPLaying()) {
            log("ignore play count ++", this._ignorePlayCount);
            this._ignorePlayCount++;
        } else if (!state.is_playing && this.getIsPLaying()) {
            log("ignore pause count ++", this._ignorePauseCount);
            // this._ignorePauseCount++;
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

    public getIsPLaying(): boolean {
        return !this._player.paused;
    }

    public getState(): PlayerStateType {
        const s = {
            updated_at: Date.now() * 1e3,
            current_time: Math.round(this._player.currentTime * 1e6),
            playback_rate: this._player.playbackRate,
            is_playing: this.getIsPLaying(),
        };
        log("get state returned: ", s);
        return s;
    }

    private handleStateChanged() {
        if (!this._isReady) return;

        ContentScriptMessagingClient.sendMessage(
            ExtensionMessageType.UPDATE_PLAYER_STATE,
            this.getState(),
        );
    }

    private handleStateMessages() {
        this._contentScriptMessagingClient.addHandler(
            ExtensionMessageType.PLAYER_VIDEO_UPDATED,
            (videoUrl: string) => {
                log("received video updated", videoUrl);
                this._ignorePlayCount++;
                log("ignore play count ++", this._ignorePlayCount);
                this.updateVideo(videoUrl);
            },
        );

        this._contentScriptMessagingClient.addHandler(
            ExtensionMessageType.PLAYER_STATE_UPDATED,
            (state: PlayerStateType) => {
                log("received player state updated", state);
                this.setState(state);
            },
        );
    }

    private updateVideo(videoUrl: string) {
        window.postMessage({ type: "SKIP", payload: videoUrl }, "*");
    }

    private observeElement(): void {
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if (mutation.type === "attributes" && mutation.attributeName === "class") {
                    this.handleAdChanged(this._e.classList);
                    this.handleModeChanged(this._e.classList);
                }
            });
        });

        observer.observe(this._e, {
            attributes: true,
            attributeFilter: ["class"],
        });
    }

    // Ad showing
    private handleAdChanged(cl: DOMTokenList): void {
        const adShowing = cl.contains("ad-showing");
        if (this._adShowing === adShowing) return;
        this.debounceUpdateIsReady(!adShowing);
    }

    // Player mode
    private handleModeChanged(cl: DOMTokenList): void {
        const classNames = Array.from(cl);
        const c = (className: string) => classNames.includes(className);

        if (c("ytp-modern-miniplayer")) {
            this.setMode(Modes.Mini);
            return;
        }

        if (c("ytp-fullscreen") && c("ytp-big-mode")) {
            this.setMode(Modes.Full);
            return;
        }

        const masthead = document.querySelector(
            "#content > #masthead-container > #masthead",
        ) as MastheadElement | null;

        if (masthead && masthead.hasAttribute("theater")) {
            this.setMode(Modes.Theater);
            return;
        }

        this.setMode(Modes.Default);
    }

    private setMode(mode: Modes) {
        if (this._mode === mode) return;
        this._mode = mode;
    }
}

export default Player;
