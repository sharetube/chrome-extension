import React from "react";
import { createRoot } from "react-dom/client";

// Global styles
import "@shared/styles/global.css";

// Utils
import render from "@shared/lib/render";
import error from "@shared/lib/error";
import waitForElement from "@shared/utils/waitForElement";

// Components
import Playlist from "@widgets/ui/Playlist/Playlist";
import Popup from "@widgets/ui/Popup/Popup";

//! Debug
console.log("Hello from content script");

// Render playlist
waitForElement("#secondary-inner")
    .then(elem => render(elem, <Playlist />))
    .catch(error => error("Failed to render playlist", error));
