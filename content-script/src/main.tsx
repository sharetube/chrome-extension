import React from "react";
import { createRoot } from "react-dom/client";

// Global styles
import "@shared/styles/global.css";

// Utils
import waitForElement from "@shared/utils/waitForElement";

// Components
import Playlist from "@widgets/Playlist/Playlist";

console.log("Hello from content script");

waitForElement("#secondary-inner")
    .then(elem => {
        const playlist = document.createElement("div");
        playlist.id = "root";

        elem!.prepend(playlist);

        const root = createRoot(playlist);

        root.render(<Playlist />);
    })
    .catch(error => {
        console.error("Error waiting for body", error);
    });
