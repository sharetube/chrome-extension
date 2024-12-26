import { ContentScriptMessagingClient } from "@shared/client/client";
import { ExtensionMessageType } from "types/extensionMessage";
import { PlayerState } from "types/player";

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
    private _e: HTMLElement;
    private _p: HTMLVideoElement;

    private _mode: Modes = Modes.Default;
    private _muted: boolean = true;
    private _setting_state: boolean = false;
    private _loading: boolean = false;
    private _ad_showing: boolean = true;

    private _ContentScriptMessagingClient: ContentScriptMessagingClient;
    private _observer: MutationObserver | null = null;

    public constructor(e: HTMLElement, p: HTMLVideoElement) {
        this._e = e;
        this._p = p;
        this._ContentScriptMessagingClient = new ContentScriptMessagingClient();

        this.observeElement();
        this.handleStateMessages();
        this.addEventListeners();

        this.sendMute();
    }

    private addEventListeners() {
        // Mute handle
        this._p.addEventListener("volumechange", this.handleMute.bind(this));
        // State handle
        this._p.addEventListener("play", this.sendState.bind(this));
        this._p.addEventListener("pause", this.sendState.bind(this));
        this._p.addEventListener("seeked", this.sendState.bind(this));
        this._p.addEventListener("ratechange", this.sendState.bind(this));
        // Loading handle
        this._p.addEventListener("waiting", this.handleWaiting.bind(this));
        this._p.addEventListener("playing", this.handlePlaying.bind(this));
    }

    // Loading handle

    private handleWaiting() {
        if (!this._loading) {
            this._loading = true;
            this.handleOnline();
        }
    }

    private handlePlaying() {
        if (this._loading) {
            this._loading = false;
            this.handleOnline();
        }
    }

    // Mute

    private sendMute() {
        ContentScriptMessagingClient.sendMessage(ExtensionMessageType.UPDATE_MUTED, this._muted);
    }

    private handleMute() {
        if (this._p.muted !== this._muted) {
            return;
        } else {
            this._muted = this._p.muted;
            this.sendMute();
        }
    }

    // State

    public set state(state: PlayerState) {
        this._setting_state = true;

        const { updated_at, is_playing, current_time, playback_rate } = state;
        const ct =
            current_time / 1e6 +
            (Math.round(Date.now() / 1000 - updated_at) * playback_rate) / 1000;

        this._p[is_playing ? "play" : "pause"]();
        this._p.currentTime = ct;
        this._p.playbackRate = playback_rate;

        this._setting_state = false;
    }

    public get state(): PlayerState {
        return {
            updated_at: Date.now() / 1000,
            current_time: Math.round(this._p.currentTime * 1e6),
            playback_rate: this._p.playbackRate,
            is_playing: !this._p.paused,
        };
    }

    private sendState() {
        if (this._ad_showing || this._setting_state) {
            return;
        } else {
            this._setting_state = true;
            ContentScriptMessagingClient.sendMessage(
                ExtensionMessageType.UPDATE_PLAYER_STATE,
                this.state!,
            );
        }
    }

    private handleStateMessages() {
        this._ContentScriptMessagingClient.addHandler(
            ExtensionMessageType.PLAYER_VIDEO_UPDATED,
            (videoId: string) => {
                this.video = videoId;
            },
        );

        this._ContentScriptMessagingClient.addHandler(
            ExtensionMessageType.PLAYER_STATE_UPDATED,
            (state: PlayerState) => {
                if (this._ad_showing || this._loading || this._setting_state) {
                    return;
                } else {
                    this.state = state;
                }
            },
        );
    }

    // Set video

    private set video(videoId: string) {
        window.postMessage({ type: "SKIP", data: videoId }, "*");
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

    // Online handle

    private handleOnline(): void {
        if (this._loading || this._ad_showing) {
            ContentScriptMessagingClient.sendMessage(ExtensionMessageType.UPDATE_READY, false);
        }
        if (!this._loading && !this._ad_showing) {
            ContentScriptMessagingClient.sendMessage(ExtensionMessageType.UPDATE_READY, true);
        }
    }
}

export default Player;
