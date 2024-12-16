type VE = HTMLVideoElement;

interface IAdminProvider {
    is_admin: boolean;
}

class AdminProvider implements IAdminProvider {
    private static _instance: AdminProvider;
    private _is_admin: boolean = false;

    private constructor() {}

    public static get instance(): AdminProvider {
        if (!this._instance) {
            this._instance = new AdminProvider();
        }
        return this._instance;
    }

    public get is_admin(): boolean {
        return this._is_admin;
    }

    public set is_admin(value: boolean) {
        this._is_admin = value;
    }
}

interface PlayerState {
    isPlaying: boolean;
    currentTime: number;
    playbackRate: number;
    timestamp: number;
}

class Player {
    private readonly _player: VE;

    constructor(element: VE) {
        this._player = element;
        this.init();
    }

    private calculateState({
        isPlaying,
        currentTime,
        playbackRate,
        timestamp,
    }: PlayerState): Omit<PlayerState, "timestamp"> {
        const deltaTime = (Date.now() - timestamp) / 1000;
        return {
            isPlaying,
            currentTime: currentTime + deltaTime * playbackRate,
            playbackRate,
        };
    }

    private get state(): PlayerState {
        const { paused: isPlaying, currentTime, playbackRate } = this._player!;
        return { isPlaying, currentTime, playbackRate, timestamp: Date.now() };
    }

    private set state(state: PlayerState) {
        const { isPlaying, currentTime, playbackRate } = this.calculateState(state);
        isPlaying ? this._player!.play() : this._player!.pause();
        Object.assign(this._player!, { currentTime, playbackRate });
    }

    private init() {
        this.addEventListeners();
    }

    private addEventListeners() {
        ["play", "pause", "ratechange", "qualitychange"].forEach(event =>
            this._player.addEventListener(event, () => this.sendState(this.state)),
        );
    }

    private sendState(state: PlayerState) {
        if (false) return;
        console.log(state);
    }
}
