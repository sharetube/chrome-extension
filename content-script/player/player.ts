import { ContentScriptMessagingClient } from "@shared/client/client";
import { ExtensionMessageType } from "types/extensionMessage";
import { PlayerElement, PlayerState } from "types/player";

interface WatchEndpoint {
    videoId: string;
}

interface A extends HTMLAnchorElement {
    data: { watchEndpoint: WatchEndpoint };
}

class Player {
    private _p: PlayerElement;
    private _ContentScriptMessagingClient: ContentScriptMessagingClient;

    public constructor(player: PlayerElement) {
        this._p = player;
        this._ContentScriptMessagingClient = new ContentScriptMessagingClient();
        this.init();
    }

    private init() {
        this._ContentScriptMessagingClient.addHandler(
            ExtensionMessageType.PLAYER_VIDEO_UPDATED,
            (videoId: string) => this.setVideo(videoId),
        );

        this._ContentScriptMessagingClient.addHandler(
            ExtensionMessageType.PLAYER_STATE_UPDATED,
            (state: PlayerState) => (this.state = state),
        );
    }

    private setVideo(videoId: string) {
        window.postMessage({ type: "SKIP", data: videoId }, "*");
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

export default Player;
