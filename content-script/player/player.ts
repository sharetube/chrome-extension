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
    // todo: rename
    private _e: HTMLElement;
    private _p: HTMLVideoElement;

    private _mode: Modes = Modes.Default;
    private _muted: boolean | null = null;
    private _state_set: number = 0;
    private _waiting: boolean = false;
    private _default_unpauses_left = 2;
    private _ad_showing: boolean = true;
    private _default_waiting_handled: boolean = false;

    private _contentScriptMessagingClient: ContentScriptMessagingClient;
    private _observer: MutationObserver | null = null;

    public constructor(e: HTMLElement, p: HTMLVideoElement) {
        this._e = e;
        this._p = p;
        this._contentScriptMessagingClient = new ContentScriptMessagingClient();
        this.fetchState();

        this.observeElement();
        this.handleStateMessages();
        this.addEventListeners();

        this.sendMute();
    }

    private addEventListeners() {
        // Mute handle
        this._p.addEventListener("volumechange", this.handleMute.bind(this));
        // State handle
        this._p.addEventListener("play", this.handlePlay.bind(this));
        this._p.addEventListener("pause", this.handlePause.bind(this));
        this._p.addEventListener("seeking", this.handleSeeked.bind(this));
        this._p.addEventListener("ratechange", this.handleRatechange.bind(this));
        // Loading handle
        this._p.addEventListener("waiting", this.handleWaiting.bind(this));
        this._p.addEventListener("playing", this.handlePlaying.bind(this));
        this._p.addEventListener("loadeddata", this.handleLoadedData.bind(this));
        this._p.addEventListener("ended", this.handleEnded.bind(this));

        console.log("event listeners added");
        this._p.addEventListener("audioprocess", () => console.log("audioprocess"));
        this._p.addEventListener("canplay", () => console.log("canplay"));
        this._p.addEventListener("canplaythrough", () => console.log("canplaythrough"));
        this._p.addEventListener("complete", () => console.log("complete"));
        this._p.addEventListener("durationchange", () => console.log("durationchange"));
        this._p.addEventListener("emptied", () => console.log("emptied"));
        this._p.addEventListener("error", () => console.log("error"));
        this._p.addEventListener("loadedmetadata", () => console.log("loadedmetadata"));
        this._p.addEventListener("loadstart", () => console.log("loadstart"));
        this._p.addEventListener("playing", () => console.log("playing"));
        this._p.addEventListener("progress", () => console.log("progress"));
        this._p.addEventListener("ratechange", () => console.log("ratechange"));
        this._p.addEventListener("seeked", () => console.log("seeked"));
        this._p.addEventListener("stalled", () => console.log("stalled"));
        this._p.addEventListener("suspend", () => console.log("suspend"));
        this._p.addEventListener("timeupdate", () => console.log("timeupdate"));
    }

    private fetchState() {
        ContentScriptMessagingClient.sendMessage(ExtensionMessageType.GET_PLAYER_STATE).then(
            (state: PlayerStateType) => {
                log("fetched player state", state);
                this.state = state;
            },
        );
    }

    private debouncedWaiting = debounce((value: boolean): void => {
        this._waiting = value;
        this.handleOnline();
    }, 800);

    // Then modify your debounceWaiting method to call it
    private debounceWaiting(value: boolean): void {
        log("debounce waiting");
        this.debouncedWaiting(value);
    }

    // Loading handle

    private handleWaiting() {
        log("waiting");
        if (!this._default_waiting_handled) {
            this._default_waiting_handled = true;
            return;
        }
        this.debounceWaiting(true);
    }

    private handlePlaying() {
        log("playing");
        this.debounceWaiting(false);
    }

    private handleEnded() {
        log("ended");
        ContentScriptMessagingClient.sendMessage(ExtensionMessageType.SKIP_CURRENT_VIDEO);
    }

    private handleLoadedData() {
        log("loaded data");
        log("ready state", this._p.readyState);
        this.debounceWaiting(false);
    }

    // Mute

    private sendMute() {
        ContentScriptMessagingClient.sendMessage(ExtensionMessageType.UPDATE_MUTED, this._muted!);
    }

    private handleMute() {
        log("mute");
        if (this._p.muted === this._muted) {
            return;
        } else {
            this._muted = this._p.muted;
            this.sendMute();
        }
    }

    // State

    public set state(state: PlayerStateType) {
        let ct;
        if (!state.is_playing) {
            ct = state.current_time / 1e6;
        } else {
            ct =
                Math.round(
                    state.current_time +
                        (Date.now() * 1e3 - state.updated_at) * state.playback_rate,
                ) / 1e6;
        }

        log("setting state: previous state", this.state);

        this._state_set = 2;
        this._p[state.is_playing ? "play" : "pause"]();
        this._p.currentTime = ct;
        this._p.playbackRate = state.playback_rate;

        log("setted player state", {
            current_time: ct,
            playback_rate: state.playback_rate,
            is_playing: state.is_playing,
        });
    }

    public getIsPLaying(): boolean {
        return !this._p.paused;
    }

    public get state(): PlayerStateType {
        const s = {
            updated_at: Date.now() * 1e3,
            current_time: Math.round(this._p.currentTime * 1e6),
            playback_rate: this._p.playbackRate,
            is_playing: this.getIsPLaying(),
        };
        log("get state returned: ", s);
        return s;
    }

    private handlePlay() {
        log("play");
        if (this._default_unpauses_left > 0) {
            log(this._p.readyState);
            log("default unpause handled");
            this._default_unpauses_left--;
            // todo: dont fetch state again
            this.fetchState();
            return;
        }

        this.handleStateChanged();
    }

    private handleSeeked() {
        log("seeked");
        log("duration", this._p.duration);
        this.handleStateChanged();
    }

    private handleRatechange() {
        log("ratechange");
        this.handleStateChanged();
    }

    private handlePause() {
        log("pause");
        this.handleStateChanged();
    }

    private handleStateChanged() {
        log("state changed", this.state);
        if (this._state_set > 0) {
            log("state set if");
            this._state_set--;
            return;
        }

        if (this._ad_showing) return;

        ContentScriptMessagingClient.sendMessage(
            ExtensionMessageType.UPDATE_PLAYER_STATE,
            this.state,
        );
    }

    private handleStateMessages() {
        this._contentScriptMessagingClient.addHandler(
            ExtensionMessageType.PLAYER_VIDEO_UPDATED,
            (videoUrl: string) => {
                log("received video updated", videoUrl);
                this._default_unpauses_left = 1;
                this.video = videoUrl;
            },
        );

        this._contentScriptMessagingClient.addHandler(
            ExtensionMessageType.PLAYER_STATE_UPDATED,
            (state: PlayerStateType) => {
                log("received player state updated", state);
                if (this._ad_showing || this._waiting) {
                    return;
                } else {
                    this.state = state;
                }
            },
        );
    }

    // Set video

    private set video(videoUrl: string) {
        window.postMessage({ type: "SKIP", payload: videoUrl }, "*");
    }

    // Main observer

    private observeElement(): void {
        this._observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if (mutation.type === "attributes" && mutation.attributeName === "class") {
                    this.observeAd(this._e.classList);
                    this.observeMode(this._e.classList);
                }
            });
        });

        this._observer.observe(this._e, {
            attributes: true,
            attributeFilter: ["class"],
        });
    }

    // Ad showing

    private observeAd(cl: DOMTokenList): void {
        this.ad = cl.contains("ad-showing");
    }

    private set ad(ad: boolean) {
        if (this._ad_showing === ad) return;
        this._ad_showing = ad;
        this.handleOnline();
    }

    // Player mode

    private observeMode(cl: DOMTokenList): void {
        const classNames = Array.from(cl);
        const c = (className: string) => classNames.includes(className);

        if (c("ytp-modern-miniplayer")) {
            this.mode = Modes.Mini;
            return;
        }

        if (c("ytp-fullscreen") && c("ytp-big-mode")) {
            this.mode = Modes.Full;
            return;
        }

        const masthead = document.querySelector(
            "#content > #masthead-container > #masthead",
        ) as MastheadElement | null;

        if (masthead && masthead.hasAttribute("theater")) {
            this.mode = Modes.Theater;
            return;
        }

        this.mode = Modes.Default;
    }

    private set mode(mode: Modes) {
        if (this._mode === mode) return;
        this._mode = mode;
    }

    private handleOnline(): void {
        log("handle online");
        if (this._waiting || this._ad_showing) {
            ContentScriptMessagingClient.sendMessage(ExtensionMessageType.UPDATE_READY, false);
        } else {
            ContentScriptMessagingClient.sendMessage(ExtensionMessageType.UPDATE_READY, true);
        }
    }
}

export default Player;
