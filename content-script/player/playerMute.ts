import Player from "./player";
import Callback from "./types/Callback";

class PlayerMute {
    private readonly playerInstance: Player;
    private readonly callback: Callback<boolean> = () => {};
    private mutedState: boolean = false;
    private isAdmin: boolean;

    constructor(playerInstance: Player) {
        this.playerInstance = playerInstance;
        this.isAdmin = this.playerInstance.admin;
        this.init();
    }

    private init(): void {
        this.updateMuteState();
        this.addListeners();
    }

    private updateMuteState(): void {
        const player = this.playerInstance.player;
        this.resolveMuteState(player!.muted);
    }

    private addListeners(): void {
        const player = this.playerInstance.player;
        player!.addEventListener("volumechange", () => {
            this.resolveMuteState(player!.muted);
        });
    }

    private resolveMuteState(muted: boolean): void {
        if (muted === this.mutedState) return;
        this.mutedState = muted;
        this.callback(muted);
    }

    // public methods

    public get muted(): boolean {
        return this.mutedState;
    }
}

export default PlayerMute;
