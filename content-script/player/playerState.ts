import Player, { PlayerInstance } from "./player";
import State from "./types/State";
import StateWithTimestamp from "./types/StateWithTimestamp";

class PlayerState {
    private playerInstance: PlayerInstance;

    constructor(playerInstance: PlayerInstance) {
        this.playerInstance = playerInstance;
    }

    private calculateState(state: StateWithTimestamp): State {
        const time = Date.now();
        const deltaTime = time - state.timestamp;
        const currentTime =
            state.currentTime + (deltaTime * state.playbackRate) / 1000;
        return {
            isPlaying: state.isPlaying,
            currentTime: currentTime,
            playbackRate: state.playbackRate,
        };
    }

    // public methods

    public get state(): StateWithTimestamp {
        const p = this.playerInstance.player;
        return {
            isPlaying: !p!.paused,
            currentTime: p!.currentTime,
            playbackRate: p!.playbackRate,
            timestamp: Date.now(),
        };
    }

    public pause(): StateWithTimestamp {
        const p = this.playerInstance.player;
        p!.pause();
        return this.state;
    }

    public play(): void {
        const p = this.playerInstance.player;
        p!.play();
    }

    public seek(time: number): void {
        const p = this.playerInstance.player;
        p!.currentTime = time;
    }

    public setPlaybackRate(rate: number): void {
        const p = this.playerInstance.player;
        p!.playbackRate = rate;
    }

    public setState(state: StateWithTimestamp): void {
        const newState = this.calculateState(state);
        const p = this.playerInstance.player;
        if (newState.isPlaying) {
            p!.play();
        } else {
            p!.pause();
        }
        p!.currentTime = newState.currentTime;
        p!.playbackRate = newState.playbackRate;
    }
}

export default PlayerState;
export type { State, StateWithTimestamp };
