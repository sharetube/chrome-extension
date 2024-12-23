type VE = HTMLVideoElement;

interface IAdmin extends Subject<boolean> {
    set is_admin(is_admin: boolean);
    get is_admin(): boolean;
}

class Admin implements IAdmin {
    private static _instance: Admin;
    private _observers: Observer<boolean>[] = [];
    private constructor() {}
    public static getInstance(): Admin {
        return (Admin._instance ??= new Admin());
    }

    private _is_admin: boolean = false;

    public set is_admin(is_admin: boolean) {
        if (is_admin === this._is_admin) return;
        this.notifyObservers(is_admin);
        this._is_admin = is_admin;
    }

    public get is_admin(): boolean {
        return this._is_admin;
    }

    public addObserver(observer: Observer<boolean>): void {
        this._observers.push(observer);
    }

    public removeObserver(observer: Observer<boolean>): void {
        const index = this._observers.indexOf(observer);
        if (index > -1) {
            this._observers.splice(index, 1);
        }
    }

    private notifyObservers(data: boolean): void {
        for (const observer of this._observers) {
            observer.update(data);
        }
    }
}

export { Admin };

interface IPlayer {
    set player(player: VE);
    get player(): VE | null;
}

class Player implements IPlayer {
    private static _instance: Player;
    private constructor() {}
    public static getInstance(): Player {
        return (Player._instance ??= new Player());
    }

    private _player: VE | null = null;

    public set player(player: VE) {
        this._player = player;
    }

    public get player(): VE | null {
        return this._player;
    }
}

export type { IPlayer };
export { Player };

class Mute implements Subject<boolean> {
    private _player: VE | null = null;
    private _is_muted: boolean = false;
    private _observers: Observer<boolean>[] = [];
    public constructor(player: VE) {
        this._player = player;
        this.init();
        this._is_muted = this._player!.muted;
    }

    private init() {
        this.addListeners();
    }

    private addListeners() {
        this._player!.addEventListener("volumechange", () => {
            this.is_mute = this._player!.muted;
        });
    }

    private set is_mute(is_muted: boolean) {
        if (is_muted === this._is_muted) return;
        this._is_muted = is_muted;
        this.notifyObservers(is_muted);
    }

    public get mute(): boolean {
        return this._player!.muted;
    }

    public addObserver(observer: Observer<boolean>): void {
        this._observers.push(observer);
    }

    public removeObserver(observer: Observer<boolean>): void {
        const index = this._observers.indexOf(observer);
        if (index > -1) {
            this._observers.splice(index, 1);
        }
    }

    private notifyObservers(data: boolean): void {
        for (const observer of this._observers) {
            observer.update(data);
        }
    }

    public initNotifyObservers(): void {
        this.notifyObservers(this._player!.muted);
    }
}

export { Mute };

class Play implements Subject<boolean> {
    private _player: VE | null = null;
    private _is_playing: boolean = false;
    private _observers: Observer<boolean>[] = [];
    public constructor(player: VE) {
        this._player = player;
        this.init();
    }

    private init() {
        this.addListeners();
    }

    private addListeners() {
        this._player!.addEventListener("play", () => {
            this.is_playing = true;
        });

        this._player!.addEventListener("pause", () => {
            this.is_playing = false;
        });
    }

    private set is_playing(is_play: boolean) {
        if (is_play === this._is_playing) return;
        this._is_playing = is_play;
        this.notifyObservers(is_play);
    }

    public addObserver(observer: Observer<boolean>): void {
        this._observers.push(observer);
    }

    public removeObserver(observer: Observer<boolean>): void {
        const index = this._observers.indexOf(observer);
        if (index > -1) {
            this._observers.splice(index, 1);
        }
    }

    private notifyObservers(data: boolean): void {
        for (const observer of this._observers) {
            observer.update(data);
        }
    }
}

export { Play };

class PlaybackRate implements Subject<number> {
    private _player: VE | null = null;
    private _playbackRate: number = 1;
    private _observers: Observer<number>[] = [];
    public constructor(player: VE) {
        this._player = player;
        this.init();
    }

    private init() {
        this.addListeners();
    }

    private addListeners(): void {
        this._player!.addEventListener("ratechange", () => {
            this.playbackRate = this._player!.playbackRate;
        });
    }

    private set playbackRate(playbackRate: number) {
        if (playbackRate === this._playbackRate) return;
        this._playbackRate = playbackRate;
        this.notifyObservers(playbackRate);
    }

    public addObserver(observer: Observer<number>): void {
        this._observers.push(observer);
    }

    public removeObserver(observer: Observer<number>): void {
        const index = this._observers.indexOf(observer);
        if (index > -1) {
            this._observers.splice(index, 1);
        }
    }

    private notifyObservers(data: number): void {
        for (const observer of this._observers) {
            observer.update(data);
        }
    }
}

export { PlaybackRate };

class Seeked implements Subject<number> {
    private _player: VE | null = null;
    private _time: number = 1;
    private _observers: Observer<number>[] = [];
    public constructor(player: VE) {
        this._player = player;
        this.init();
    }

    private init() {
        this.addListeners();
    }

    private set time(time: number) {
        if (this._time === time) return;
        this._time = time;
        this.notifyObservers(time);
    }

    private addListeners(): void {
        this._player!.addEventListener("seeked", () => {
            this.time = this._player!.currentTime;
        });
    }

    public addObserver(observer: Observer<number>): void {
        this._observers.push(observer);
    }

    public removeObserver(observer: Observer<number>): void {
        const index = this._observers.indexOf(observer);
        if (index > -1) {
            this._observers.splice(index, 1);
        }
    }

    private notifyObservers(data: number): void {
        for (const observer of this._observers) {
            observer.update(data);
        }
    }
}

export { Seeked };

interface PlayerState {
    isPlaying: boolean;
    currentTime: number;
    playbackRate: number;
}

interface PlayerStateWithTimestamp extends PlayerState {
    timestamp: number;
}

class State {
    private _player: VE | null;

    public constructor(player: VE) {
        this._player = player;
    }

    private calculateState(state: PlayerStateWithTimestamp): PlayerState {
        const time = Date.now();
        const deltaTime = time - state.timestamp;
        const currentTime = state.currentTime + (deltaTime * state.playbackRate) / 1000;
        return {
            isPlaying: state.isPlaying,
            currentTime: currentTime,
            playbackRate: state.playbackRate,
        };
    }

    public get state(): PlayerStateWithTimestamp {
        const p = this._player;
        const state = {
            isPlaying: !p!.paused,
            currentTime: p!.currentTime,
            playbackRate: p!.playbackRate,
            timestamp: Date.now(),
        };

        return state;
    }

    public set state(state: PlayerStateWithTimestamp) {
        const p = this._player;
        const newState = this.calculateState(state);
        if (newState.isPlaying) {
            p!.play();
        } else {
            p!.pause();
        }
        p!.currentTime = newState.currentTime;
        p!.playbackRate = newState.playbackRate;
    }
}

export { State };

class SendPlayerState implements Observer<boolean> {
    private _player: VE | null = null;
    private _state: PlayerStateWithTimestamp | {} = {};

    private State: State | null = null;

    constructor(player: VE) {
        this._player = player;
        this.State = new State(this._player);
    }

    public update() {
        console.log(this.State!.state);
    }
}

export { SendPlayerState };

class SendPlayerStateManager {
    private _player: VE | null = null;

    constructor(player: IPlayer) {
        this._player = player.player;
        const seeked = new Seeked(this._player!);
        const playbackRate = new PlaybackRate(this._player!);
        const play = new Play(this._player!);
        const sendState = new SendPlayerState(this._player!);

        play.addObserver(sendState);
        seeked.addObserver(sendState);
        playbackRate.addObserver(sendState);
    }
}

export { SendPlayerStateManager };

interface Observer<T> {
    update(data: T): void;
}

interface Subject<T> {
    addObserver(observer: Observer<T>): void;
    removeObserver(observer: Observer<T>): void;
}

export type { Observer, Subject };

class ObserveElementClasslist implements Subject<DOMTokenList> {
    private _element: HTMLElement | null = null;
    private _observer: MutationObserver | null = null;
    private observers: Observer<DOMTokenList>[] = [];

    public constructor(element: HTMLElement) {
        this._element = element;
        this.observeElement();
    }

    public addObserver(observer: Observer<DOMTokenList>): void {
        this.observers.push(observer);
    }

    public removeObserver(observer: Observer<DOMTokenList>): void {
        const index = this.observers.indexOf(observer);
        if (index > -1) {
            this.observers.splice(index, 1);
        }
    }

    private notifyObservers(data: DOMTokenList): void {
        for (const observer of this.observers) {
            observer.update(data);
        }
    }

    private observeElement() {
        const element = this._element;
        this._observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if (mutation.type === "attributes" && mutation.attributeName === "class") {
                    this.notifyObservers(element!.classList);
                }
            });
        });

        this._observer.observe(element!, {
            attributes: true,
            attributeFilter: ["class"],
        });
    }
}

export { ObserveElementClasslist };

enum Modes {
    Default = "default",
    Theater = "theater",
    Full = "full",
    Mini = "mini",
}

interface MastheadElement extends HTMLElement {
    theater: boolean;
}

interface ModeObserver<T> {
    modeUpdate(data: T): void;
}

interface ModeSubject<T> {
    addObserver(observer: ModeObserver<T>): void;
    removeObserver(observer: ModeObserver<T>): void;
}

interface IMode extends Observer<DOMTokenList>, ModeSubject<Modes> {
    addObserver(observer: ModeObserver<Modes>): void;
    removeObserver(observer: ModeObserver<Modes>): void;
    update(classList: DOMTokenList): void;
}

class Mode implements IMode {
    private static instance: Mode;
    private _mode: Modes = Modes.Default;
    private observers: ModeObserver<Modes>[] = [];

    private constructor() {}

    public static getInstance(): Mode {
        if (!Mode.instance) {
            Mode.instance = new Mode();
        }
        return Mode.instance;
    }

    public addObserver(observer: ModeObserver<Modes>): void {
        this.observers.push(observer);
    }

    public removeObserver(observer: ModeObserver<Modes>): void {
        const index = this.observers.indexOf(observer);
        if (index > -1) {
            this.observers.splice(index, 1);
        }
    }

    private notifyObservers(data: Modes): void {
        console.log(data);
        for (const observer of this.observers) {
            observer.modeUpdate(data);
        }
    }

    public update(classList: DOMTokenList) {
        const c = (className: string) => classList.contains(className);
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

    public get mode(): Modes {
        return this._mode;
    }

    private set mode(modes: Modes) {
        if (this._mode === modes) return;
        this._mode = modes;
        this.notifyObservers(modes);
    }
}

export type { Modes, MastheadElement, ModeSubject, IMode };
export { Mode };

interface AdObserver {
    adUpdate(data: boolean): void;
}

interface AdSubject<T> {
    addObserver(observer: AdObserver): void;
    removeObserver(observer: AdObserver): void;
}

interface IAd extends Observer<DOMTokenList>, AdSubject<boolean> {
    ad_showing: boolean;
    addObserver(observer: AdObserver): void;
    removeObserver(observer: AdObserver): void;
    update(classList: DOMTokenList): void;
}

class Ad implements IAd {
    private static instance: Ad;
    private _ad_showing: boolean = true;
    private observers: AdObserver[] = [];

    private constructor() {}

    public static getInstance(): Ad {
        if (!Ad.instance) {
            Ad.instance = new Ad();
        }
        return Ad.instance;
    }

    public addObserver(observer: AdObserver): void {
        this.observers.push(observer);
    }

    public removeObserver(observer: AdObserver): void {
        const index = this.observers.indexOf(observer);
        if (index > -1) {
            this.observers.splice(index, 1);
        }
    }

    public update(classList: DOMTokenList) {
        const c = (className: string) => classList.contains(className);
        if (c("ad-showing")) {
            this.ad_showing = true;
        } else {
            this.ad_showing = false;
        }
    }

    public set ad_showing(ad_showing: boolean) {
        if (ad_showing === this._ad_showing) return;
        this._ad_showing = ad_showing;
        this.notifyObservers(ad_showing);
    }

    private notifyObservers(data: boolean): void {
        for (const observer of this.observers) {
            observer.adUpdate(data);
        }
    }
}

export type { IAd, AdObserver, AdSubject };
export { Ad };

type LoadObserver = Observer<boolean>;

class Load implements Subject<boolean> {
    private _load: boolean = true;
    private _player: VE | null = null;
    private _observers: Observer<boolean>[] = [];

    public constructor(elem: VE) {
        this._player = elem;
        this.init();
    }

    public addObserver(observer: Observer<boolean>): void {
        this._observers.push(observer);
    }

    public removeObserver(observer: Observer<boolean>): void {
        const index = this._observers.indexOf(observer);
        if (index > -1) {
            this._observers.splice(index, 1);
        }
    }

    private notifyObservers(data: boolean): void {
        for (const observer of this._observers) {
            observer.update(data);
        }
    }

    private set load(load: boolean) {
        if (this._load === load) return;
        this._load = load;
        this.notifyObservers(load);
    }

    private init(): void {
        const p = this._player;
        p!.addEventListener("waiting", () => {
            this.load = true;
        });
        p!.addEventListener("playing", () => {
            this.load = false;
        });
    }
}

export { Load };

class LoadManager implements AdObserver, LoadObserver, Subject<boolean> {
    private static instance: LoadManager;
    private _loading: boolean = true;
    private _ad_showing: boolean = true;
    private _observers: Observer<boolean>[] = [];
    private _last: boolean = true;

    private constructor() {}

    public static getInstance(): LoadManager {
        if (!LoadManager.instance) {
            LoadManager.instance = new LoadManager();
        }
        return LoadManager.instance;
    }

    public addObserver(observer: Observer<boolean>): void {
        this._observers.push(observer);
    }

    public removeObserver(observer: Observer<boolean>): void {
        const index = this._observers.indexOf(observer);
        if (index > -1) {
            this._observers.splice(index, 1);
        }
    }

    private notifyObservers(data: boolean): void {
        if (data === this._last) return;
        this._last = data;
        for (const observer of this._observers) {
            observer.update(data);
        }
    }

    public adUpdate(data: boolean): void {
        this._ad_showing = data;
        this.resolveLoading();
    }

    public update(data: boolean): void {
        this._loading = data;
        this.resolveLoading();
    }

    private resolveLoading(): void {
        if (this._loading || this._ad_showing) {
            this.notifyObservers(true);
        }
        if (!this._loading && !this._ad_showing) {
            this.notifyObservers(false);
        }
    }
}

export { LoadManager };
