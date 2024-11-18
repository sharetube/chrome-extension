import log from "@shared/lib/log";
/**
 * Observe the yt fullscreen mode changing
 */

import Document from "../types/document";

// Handles the fullscreen change event
const handleFullscreen = () => {
    if (
        (document as Document).fullscreenElement ||
        (document as Document).webkitFullscreenElement ||
        (document as Document).mozFullScreenElement ||
        (document as Document).msFullscreenElement
    ) {
        log("Fullscreen mode is active");
    } else {
        log("Fullscreen mode is inactive");
    }
};

// Adds all fullscreen change event listeners to the document
const addFullscreenListeners = () => {
    document.addEventListener("fullscreenchange", handleFullscreen);
    document.addEventListener("webkitfullscreenchange", handleFullscreen);
    document.addEventListener("mozfullscreenchange", handleFullscreen);
    document.addEventListener("msfullscreenchange", handleFullscreen);

    handleFullscreen();
};

export default addFullscreenListeners;
