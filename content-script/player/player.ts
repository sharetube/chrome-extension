import { ContentScriptMessagingClient } from "@shared/client/client";
import { ExtensionMessageType } from "types/extensionMessage";
import { PlayerElement, PlayerState } from "types/player";

class isAdmin {}

class State {
    private _p: PlayerElement;

    protected constructor(player: PlayerElement) {
        this._p = player;
    }

    public set state(state: PlayerState) {
        const { is_playing, current_time, playback_rate, updated_at } = state;

        if (!is_playing) {
            this._p.pause();
            this._p.currentTime = current_time;
            this._p.playbackRate = playback_rate;
            return;
        }

        const dt = Date.now() - updated_at;
        const ct = current_time + (dt * playback_rate) / 1000;

        this._p.playbackRate = playback_rate;
        this._p.currentTime = ct;
    }

    public get state(): PlayerState {
        return {
            playback_rate: this._p.playbackRate,
            is_playing: !this._p.paused,
            current_time: this._p.currentTime,
            updated_at: Date.now(),
        };
    }
}

type PlaylistUpdatedCallback = (msg: ExtensionMessageType.PLAYER_STATE_UPDATED) => void;

class MessageClient extends ContentScriptMessagingClient {
    private callback: PlaylistUpdatedCallback;

    public constructor(f: PlaylistUpdatedCallback) {
        super();
        this.callback = f;
    }

    public sendState(state: PlayerState): void {
        ContentScriptMessagingClient.sendMessage(ExtensionMessageType.UPDATE_PLAYER_STATE, state);
    }
}

abstract class Events {
    private _p: PlayerElement;

    protected constructor(player: PlayerElement) {
        this._p = player;
        this.init();
    }

    private init() {
        this._p.addEventListener("play", () => {
            this.update();
        });

        this._p.addEventListener("pause", () => {
            this.update();
        });

        this._p.addEventListener("seeked", () => {
            this.update();
        });

        this._p.addEventListener("ratechange", () => {
            this.update();
        });
    }

    public update(): void {}
}

class EventsManager extends Events {
    public constructor(player: PlayerElement) {
        super(player);
    }

    public update(): void {}
}
