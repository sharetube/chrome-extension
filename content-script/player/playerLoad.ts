import Player from "./player";
import Callback from "./types/Callback";

class PlayerLoad {
    private readonly playerInstance: Player;
    private _callback: Callback<boolean> = () => {};
    protected _loading: boolean = false;

    constructor(PlayerInstance: Player) {
        this.playerInstance = PlayerInstance;
        this._addListeners();
    }

    private _waitForAdToEnd = (): Promise<void> =>
        new Promise(resolve => {
            const checkAdAndElement = () => {
                const adEnded = !document.querySelector(".ad-showing");
                if (adEnded) {
                    resolve();
                } else {
                    requestAnimationFrame(checkAdAndElement);
                }
            };
            checkAdAndElement();
        });

    private _waitForPlayerToBeReady = (): Promise<void> =>
        new Promise(resolve => {
            const checkReadyState = () => {
                const player = this.playerInstance.player;
                if (player!.readyState === HTMLMediaElement.HAVE_ENOUGH_DATA) {
                    resolve();
                } else {
                    requestAnimationFrame(checkReadyState);
                }
            };
            checkReadyState();
        });

    private _addListeners() {
        const player = this.playerInstance.player;

        player!.addEventListener("waiting", () => {
            this._resolve(true);
        });

        player!.addEventListener("playing", () => {
            this._resolve(false);
        });
    }

    private _resolve(status: boolean) {
        if (status === this._loading) return;
        this._loading = status;
        this._callback(status);
    }

    public set callback(f: Callback<boolean>) {
        this._callback = f;
    }

    public ready = (): Promise<void[]> => {
        return Promise.all([
            this._waitForAdToEnd(),
            this._waitForPlayerToBeReady(),
        ]);
    };
}

export default PlayerLoad;
