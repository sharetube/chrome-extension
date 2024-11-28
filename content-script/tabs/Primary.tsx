import {
    Ad,
    Load,
    LoadManager,
    Mode,
    Modes,
    Mute,
    ObserveElementClasslist,
    Player,
    SendPlayerStateManager,
} from "@player/player";
import { AdminProvider } from "@shared/Context/Admin/Admin";
import log from "@shared/lib/log";
import waitForElement from "@shared/lib/waitForElement";
import Panel from "@widgets/Panel/Panel";
import Search from "@widgets/Search/Search";
import ReactDOM from "react-dom";

function PrimaryTab() {
    waitForElement(".html5-video-player").then(elem => {
        waitForElement("video.video-stream.html5-main-video").then(p => {
            const player = p as HTMLVideoElement;
            const PlayerInstance = Player.getInstance();
            PlayerInstance.player = player;

            const oe = new ObserveElementClasslist(elem as HTMLVideoElement);

            const m = Mode.getInstance();

            const ad = Ad.getInstance();
            const l = new Load(player);

            oe.addObserver(ad);
            oe.addObserver(m);

            class gg {
                modeUpdate(data: Modes) {
                    log("Mode", data);
                }
            }
            const zz = new gg();
            m.addObserver(zz);

            const lm = LoadManager.getInstance();

            ad.addObserver(lm);
            l.addObserver(lm);

            class y {
                update(data: boolean) {
                    log("Loading", data);
                }
            }

            const yn = new y();

            lm.addObserver(yn);
            console.log(m.mode);

            const gh = new SendPlayerStateManager(PlayerInstance);
            const gz = new Mute(player);

            class tt {
                update(data: boolean) {
                    log("Mute", data);
                }
            }

            const jj = new tt();

            gz.addObserver(jj);
            gz.initNotifyObservers();
        });
    });

    //Remove autoplay button from player
    waitForElement(".ytp-autonav-toggle-button-container", 10000, 10).then(
        elem => {
            elem!.parentElement!.remove();
        },
    );

    // Remove next button from player
    waitForElement(".ytp-next-button.ytp-button", 10000, 1)
        .then(elem => {
            elem!.remove();
        })
        .catch(error => log("Failed to remove next button", error));

    // Because clip button must be removed
    // TODO: Fix this
    waitForElement("#flexible-item-buttons", 10000, 1)
        .then(elem => elem?.remove())
        .catch(error => log("Failed to remove clip button", error));

    // Render main panel
    waitForElement("#secondary-inner", 10000, 10)
        .then(elem => {
            elem!.style.transform = "scale(0)";
            elem!.style.zIndex = "-1";
            const container = document.createElement("div");
            const parent = elem?.parentElement;
            parent?.prepend(container);

            ReactDOM.render(
                <AdminProvider>
                    <Panel />
                </AdminProvider>,
                container,
            );
        })
        .catch(error => log("Failed to render main panel", error));

    // Render search
    waitForElement("#center", 10000, 10)
        .then(elem =>
            ReactDOM.render(
                <AdminProvider>
                    <Search />
                </AdminProvider>,
                elem,
            ),
        )
        .catch(error => log("Failed to render input", error));

    // Remove voice search button
    waitForElement("#voice-search-button", 10000, 1)
        .then(elem => elem?.remove())
        .catch(error => log("Failed to remove voice search button", error));
}

export default PrimaryTab;
