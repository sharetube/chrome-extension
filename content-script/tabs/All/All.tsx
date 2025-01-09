import { AdminProvider } from "@shared/Context/Admin/Admin";
import waitForElement from "@shared/lib/waitForElement";
import ContextItem from "@widgets/ContextItem/ContextItem";
import Popup from "@widgets/Popup/Popup";
import React from "react";
import ReactDOM from "react-dom";

// Render popup
waitForElement("#end")
    .then(elem => {
        const popupContainer = document.createElement("div");
        popupContainer.id = "st-popup-container";
        popupContainer.className = "sharetube";

        ReactDOM.render(<Popup />, popupContainer);
        elem.prepend(popupContainer);
    })
    .catch(error => console.error("ST: Failed to render popup", error));

// Context item renderer
const contextMenuContainer = document.createElement("div");
contextMenuContainer.id = "st-context-menu";
contextMenuContainer.className = "sharetube";
contextMenuContainer.style.minWidth = "149px";

const ytVideoRegex = /^https:\/\/(www\.)?(youtu\.be|youtube\.com)\/watch\?v=([^&]+)/;

const videoUrlFromThumbnail = (e: Element): string => {
    const thumbnail = e.querySelector("a#thumbnail");
    if (!thumbnail) return "";

    const match = (thumbnail as HTMLAnchorElement).href.match(ytVideoRegex);
    return match ? match[3] : "";
};

const videoUrlFromLocation = (): string => {
    const match = window.location.href.match(ytVideoRegex);
    return match ? match[3] : "";
};

const handleClick = (e: MouseEvent) => {
    const tagNames = ["ytd-compact-video-renderer", "ytd-rich-item-renderer", "ytd-watch-metadata"];

    for (const tagName of tagNames) {
        const elem = (e.target as HTMLElement).closest(tagName);
        if (elem) {
            const dropdowns = Array.from(
                document
                    .querySelector("ytd-popup-container")!
                    .querySelectorAll("tp-yt-iron-dropdown"),
            );
            const listbox = dropdowns
                .find(e => !(e as HTMLElement).id)
                ?.querySelector("tp-yt-paper-listbox");

            const url = videoUrlFromThumbnail(elem) || videoUrlFromLocation();

            ReactDOM.render(
                <AdminProvider>
                    <ContextItem videoUrl={url} />
                </AdminProvider>,
                contextMenuContainer,
            );

            listbox?.prepend(contextMenuContainer);
            break;
        }
    }
};

document.addEventListener("click", handleClick);
