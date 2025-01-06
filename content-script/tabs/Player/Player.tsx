import Player from "@player/player";
import { AdminProvider } from "@shared/Context/Admin/Admin";
import waitForElement from "@shared/lib/waitForElement";
import Panel from "@widgets/Panel/Panel";
import Search from "@widgets/Search/Search";
import React from "react";
import ReactDOM from "react-dom/client";

waitForElement(".html5-video-player")
    .then(e => {
        waitForElement("video")
            .then(p => {
                console.log("Player found");
                new Player(e as HTMLElement, p as HTMLVideoElement);
            })
            .catch(error => console.log("Failed select video element", error));
    })
    .catch(error => console.log("Failed select player element", error));

//Remove autoplay button from player
waitForElement(".ytp-autonav-toggle-button-container").then(elem => {
    elem!.parentElement!.style.display = "none";
});

// Remove next button from player
waitForElement(".ytp-next-button.ytp-button")
    .then(elem => {
        elem!.style.display = "none";
    })
    .catch(error => console.log("Failed to remove next button", error));

// Because clip button must be removed
waitForElement("#flexible-item-buttons")
    .then(elem => {
        elem!.style.display = "none";
    })
    .catch(error => console.log("Failed to remove clip button", error));

// Remove clip button
waitForElement("yt-button-shape#button-shape")
    .then(elem => {
        elem!.style.display = "none";
    })
    .catch(error => console.log("Failed to shape button", error));

// Render main panel
waitForElement("#secondary-inner")
    .then(elem => {
        Object.assign(elem!.style, { transform: "scale(0)" });
        const container = document.createElement("div");
        elem?.parentElement?.prepend(container);

        const root = ReactDOM.createRoot(container);
        root.render(
            <AdminProvider>
                <Panel />
            </AdminProvider>,
        );
    })
    .catch(error => console.log("Failed to render main panel", error));

// Render search
waitForElement("#center")
    .then(elem => {
        const root = ReactDOM.createRoot(elem!);
        root.render(
            <AdminProvider>
                <Search />
            </AdminProvider>,
        );
    })
    .catch(error => console.log("Failed to render input", error));

// Remove voice search button
waitForElement("#voice-search-button")
    .then(elem => elem?.remove())
    .catch(error => console.log("Failed to remove voice search button", error));
