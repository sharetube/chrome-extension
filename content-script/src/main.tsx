import React from "react";
import ReactDOM from "react-dom";

// Global styles
import "@shared/styles/global.css";

// Utils
import log from "@shared/lib/log";
import waitForElement from "@shared/utils/waitForElement";
import waitAdEnd from "@shared/utils/video/waitAdEnd";
import addEvents from "@shared/utils/video/addEvents";

// Types
import player from "@shared/types/video/player";

// Components
import Playlist from "@widgets/ui/Playlist/Playlist";

// Add event listeners to player after the ad ends
Promise.all([
    waitForElement("video.video-stream.html5-main-video"),
    waitAdEnd(),
])
    .then(([elem]) => addEvents(elem as player))
    .catch(error => log("Failed to add events to player", error));

// Render playlist
waitForElement("#secondary-inner")
    .then(elem => ReactDOM.render(<Playlist />, elem))
    .catch(error => log("Failed to render playlist", error));

// Remove comments
waitForElement("ytd-item-section-renderer")
    .then(elem => ReactDOM.render(<></>, elem))
    .catch(error => log("Failed to render comments", error));
