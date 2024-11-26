type PlayerType = HTMLVideoElement | null;

class Player {
    private static instance: Player;

    private _player: PlayerType = null;
    private _is_admin: boolean = false;

    private constructor() {}

    public static getInstance(): Player {
        if (!Player.instance) {
            Player.instance = new Player();
        }
        return Player.instance;
    }

    public set player(player: PlayerType) {
        this._player = player;
    }

    public get player(): PlayerType {
        return this._player;
    }

    public set admin(is_admin: boolean) {
        this._is_admin = is_admin;
    }

    public get admin(): boolean {
        return this._is_admin;
    }
}

export interface PlayerInstance {
    player: PlayerType;
    admin: boolean;
}

export default Player;
