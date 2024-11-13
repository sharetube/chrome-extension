import React from "react";
import ReactDOM from "react-dom";

// Global styles
import "./app/global.css";

// Utils
import log from "@shared/lib/log";
import waitForElement from "@shared/utils/waitForElement";
import waitAdEnd from "@shared/utils/video/waitAdEnd";
import addEvents from "@shared/utils/video/addEvents";

// Types
import player from "@shared/types/video/player";

// Widgets
import Search from "@widgets/ui/Search/Search";
import Panel from "@widgets/ui/Panel/Panel";

// Add event listeners to player after the ad ends
Promise.all([
    waitForElement("video.video-stream.html5-main-video"),
    waitAdEnd(),
])
    .then(([elem]) => addEvents(elem as player))
    .catch(error => log("Failed to add events to player", error));

// Render main panel
waitForElement("#secondary")
    .then(elem => ReactDOM.render(<Panel />, elem))
    .catch(error => log("Failed to render main panel", error));

// Render search
waitForElement("#center")
    .then(elem => ReactDOM.render(<Search />, elem))
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
