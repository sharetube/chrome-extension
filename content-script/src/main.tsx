import React from "react";

// Global styles
import "@shared/styles/global.css";

// Utils
import render from "@shared/lib/render";
import log from "@shared/lib/log";
import waitForElement from "@shared/utils/waitForElement";
import waitAdEnd from "@shared/utils/video/waitAdEnd";
import addEvents from "@shared/utils/video/addEvents";
// Observe
import initializeOverlay from "@shared/utils/initializeOverlay";
import observeNewElements from "@shared/utils/observeNewElements";

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
    .then(elem => render(elem, <Playlist />))
    .catch(error => log("Failed to render playlist", error));

// Define the elements to observe
const elementsToObserve = [
    {
        selector: "ytd-topbar-logo-renderer",
        overlayClass: "st-logo-icon-container",
        zIndex: 2000,
    },
    {
        selector: "ytd-compact-video-renderer",
        overlayClass: "st-compact-video-renderer",
        zIndex: 2100,
    },
    {
        selector: "ytd-comment-view-model",
        overlayClass: "st-comment-view-model",
        zIndex: 2000,
    },
    {
        selector: "ytd-video-owner-renderer",
        overlayClass: "st-video-owner-renderer",
        zIndex: 2000,
    },
    {
        selector: "ytm-shorts-lockup-view-model-v2",
        overlayClass: "st-shorts-lockup-view-model",
        zIndex: 2000,
    },
    {
        selector: "yt-lockup-view-model",
        overlayClass: "st-lockup-view-model",
        zIndex: 2000,
    },
];

// Initialize overlays for defined elements
elementsToObserve.forEach(({ selector, overlayClass, zIndex }) => {
    initializeOverlay(selector, overlayClass, zIndex);
});

// Observe new elements in the DOM
observeNewElements(elementsToObserve);
