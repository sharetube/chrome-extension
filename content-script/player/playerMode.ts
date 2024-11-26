import waitForElement from "@shared/lib/waitForElement";

import Callback from "./types/Callback";
import Modes from "./types/Modes";

interface MastheadElement extends HTMLElement {
    theater: boolean;
}

class PlayerMode {
    private _callback: Callback<Modes>;

    private _mode: Modes | null = null;

    private _observer: MutationObserver | null = null;

    constructor(f: Callback<Modes>) {
        this._init();
        this._callback = f;
    }

    private _init() {
        this._observeElement();
    }

    private _observeElement() {
        waitForElement(".html5-video-player").then(element => {
            this._observer = new MutationObserver(mutations => {
                mutations.forEach(mutation => {
                    if (
                        mutation.type === "attributes" &&
                        mutation.attributeName === "class"
                    ) {
                        this._getModeFromClassList(element!.classList);
                    }
                });
            });

            this._observer.observe(element!, {
                attributes: true,
                attributeFilter: ["class"],
            });
        });
    }

    private _getModeFromClassList(classList: DOMTokenList): void {
        const c = (className: string) => classList.contains(className);

        if (c("ytp-modern-miniplayer")) {
            this._resolve(Modes.Mini);
            return;
        }

        if (c("ytp-fullscreen") && c("ytp-big-mode")) {
            this._resolve(Modes.Full);
            return;
        }

        const masthead = document.querySelector(
            "#content > #masthead-container > #masthead",
        ) as MastheadElement | null;

        if (masthead && masthead.hasAttribute("theater")) {
            this._resolve(Modes.Theater);
            return;
        }

        this._resolve(Modes.Default);
    }

    private _resolve(mode: Modes) {
        if (this._mode === mode) return;
        this._callback(mode);
        this._mode = mode;
    }
}

export default PlayerMode;
