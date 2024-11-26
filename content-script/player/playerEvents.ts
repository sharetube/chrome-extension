import Player from "./player";

class PlayerEvents {
    private readonly playerInstance: Player;

    constructor(player: HTMLVideoElement) {
        this.playerInstance = Player.getInstance();
        this.playerInstance.player = player;
        this._init();
    }

    private _init() {}
}

export default PlayerEvents;
