import getAutoplay from "@player/get/autoplay";
import addFullscreenListeners from "@player/listeners/fullScreen";
import onPlay from "@player/listeners/onPlay";
import addTheaterListeners from "@player/listeners/theaterScreen";
import setAutoplay from "@player/set/autoplay";
import pause from "@player/set/pause";
import { AdminProvider } from "@shared/Context/Admin/Admin";
// Debug
import log from "@shared/lib/log";
// Utils
import waitForElement from "@shared/lib/waitForElement";
import player from "@shared/types/video/player";
import addEvents from "@shared/utils/video/addEvents";
import waitAdEnd from "@shared/utils/video/waitAdEnd";
import Panel from "@widgets/Panel/Panel";
// Widgets
import Search from "@widgets/Search/Search";
import ReactDOM from "react-dom";

function PrimaryTab() {
    // Add event listeners to player after the ad ends
    Promise.all([
        waitForElement("video.video-stream.html5-main-video"),
        waitAdEnd(),
    ])
        .then(([elem]) => {
            addEvents(elem as player);
            pause(elem as player);
            onPlay(elem as player);
        })
        .catch(error => log("Failed to add events to player", error));

    // Render main panel
    waitForElement("#secondary", 10000, 10)
        .then(elem =>
            ReactDOM.render(
                <AdminProvider>
                    <Panel />
                </AdminProvider>,
                elem,
            ),
        )
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

    /**
     * Remove unnecessary elements
     */
    // Remove voice search button
    waitForElement("#voice-search-button", 10000, 1)
        .then(elem => elem?.remove())
        .catch(error => log("Failed to remove voice search button", error));

    // Because clip button must be removed
    waitForElement("#flexible-item-buttons", 10000, 1)
        .then(elem => elem?.remove())
        .catch(error => log("Failed to remove clip button", error));

    // Add event listeners
    //! TESTING
    addFullscreenListeners();
    addTheaterListeners();
}

export default PrimaryTab;
