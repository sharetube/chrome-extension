import Player from "@player/player";
import PlayerLoad from "@player/playerLoad";
import { AdminProvider } from "@shared/Context/Admin/Admin";
import log from "@shared/lib/log";
import waitForElement from "@shared/lib/waitForElement";
import Panel from "@widgets/Panel/Panel";
import Search from "@widgets/Search/Search";
import ReactDOM from "react-dom";

import PlayerState from "../player/playerState";

function PrimaryTab() {
    waitForElement("video.video-stream.html5-main-video").then(elem => {
        const player = elem as HTMLVideoElement;

        const playerInstance = Player.getInstance();
        playerInstance.player = player;

        const playerLoad = new PlayerLoad(playerInstance);
        const playerState = new PlayerState(playerInstance);
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

    // Because clip button must be removed
    waitForElement("#flexible-item-buttons", 10000, 1)
        .then(elem => elem?.remove())
        .catch(error => log("Failed to remove clip button", error));
}

export default PrimaryTab;
