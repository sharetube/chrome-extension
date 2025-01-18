import { AdminProvider } from "@shared/Context/Admin/Admin";
import { getVideoUrlFromLink } from "@shared/api/getVideoUrlFromLink";
import waitForElement from "@shared/lib/waitForElement";
import ContextItem from "@widgets/ContextItem/ContextItem";
import Popup from "@widgets/Popup/Popup";
import React from "react";
import { createRoot } from "react-dom/client";

// Render popup
waitForElement("#end")
    .then(elem => {
        const popupContainer = document.createElement("div");
        popupContainer.id = "st-popup-container";
        popupContainer.className = "sharetube";

        createRoot(popupContainer).render(<Popup />);
        elem.prepend(popupContainer);
    })
    .catch(error => console.error("ST: Failed to render popup", error));

// Context item renderer
const contextMenuContainer = document.createElement("div");
contextMenuContainer.id = "st-context-menu";
contextMenuContainer.className = "sharetube";
contextMenuContainer.style.minWidth = "149px";

const videoUrlFromThumbnail = (e: Element): string => {
    const thumbnail = e.querySelector("a#thumbnail");
    if (!thumbnail) return "";

    return getVideoUrlFromLink((thumbnail as HTMLAnchorElement).href);
};

const videoUrlFromLocation = (): string => {
    return getVideoUrlFromLink(window.location.href);
};

const handleClick = (e: MouseEvent) => {
    const tagNames = [
        "ytd-compact-video-renderer",
        "ytd-rich-item-renderer",
        "ytd-playlist-video-renderer",
        "ytd-grid-video-renderer",
        "ytd-video-renderer",
        "ytd-watch-metadata",
        "ytd-playlist-panel-video-renderer",
    ];

    let enteredIf: boolean = false;

    const dropdowns = Array.from(
        document.querySelector("ytd-popup-container")!.querySelectorAll("tp-yt-iron-dropdown"),
    );
    const dropdown = dropdowns.find(e => !(e as HTMLElement).id);
    const listbox = dropdown?.querySelector("tp-yt-paper-listbox");

    const removeRender = () => {
        if (listbox) {
            const contextMenu = listbox.querySelector("#st-context-menu");
            if (contextMenu) {
                listbox.removeChild(contextMenu);
            }
        }
    };
    const callback = () => {
        removeRender();
        document.body.click();
    };

    for (const tagName of tagNames) {
        const elem = (e.target as HTMLElement).closest(tagName);

        if (elem) {
            enteredIf = true;

            const url = videoUrlFromThumbnail(elem) || videoUrlFromLocation();

            createRoot(contextMenuContainer).render(
                <AdminProvider>
                    <ContextItem videoUrl={url} callback={callback} />
                </AdminProvider>,
            );

            if (listbox) {
                listbox.prepend(contextMenuContainer);
            }

            break;
        }
    }

    if (!enteredIf) {
        removeRender();
    }
};

document.addEventListener("click", handleClick);
