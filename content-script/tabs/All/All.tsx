import { AdminProvider } from "@shared/Context/Admin/Admin";
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

    const dropdown = document.querySelector("ytd-popup-container tp-yt-iron-dropdown");
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

            createRoot(contextMenuContainer).render(
                <AdminProvider>
                    <ContextItem callback={callback} />
                </AdminProvider>,
            );

            listbox?.prepend(contextMenuContainer);
            break;
        }
    }

    if (!enteredIf) {
        removeRender();
    }
};

document.addEventListener("click", handleClick);

// let listbox: Element | undefined;

// function removeRender() {
//     const contextMenu = document.querySelector("tp-yt-paper-listbox #st-context-menu");
//     contextMenu?.parentElement?.removeChild(contextMenu);
// }

// function renderContextMenu() {
//     if (listbox?.firstElementChild?.id === "st-context-menu") return;

//     getContextMenuVideoUrl().then(() => {
//         console.log("rendered");
//         createRoot(contextMenuContainer).render(
//             <AdminProvider>
//                 <ContextItem callback={removeRender} />
//             </AdminProvider>,
//         );

//         listbox?.prepend(contextMenuContainer);
//     });
// }

// const debouncedRenderContextMenu = debounce(renderContextMenu, 100);

// function initListBoxListener() {
//     if (!listbox) return;

//     const observer = new MutationObserver(mutations => {
//         for (const mutation of mutations) {
//             if (mutation.type === "childList") {
//                 console.log("Listbox Children were modified!");
//                 debouncedRenderContextMenu();
//             }
//         }
//     });

//     observer.observe(listbox, {
//         childList: true,
//         subtree: false,
//     });
// }

// waitForElement("ytd-popup-container").then(elem => {
//     console.log(elem);

//     const observer = new MutationObserver(mutations => {
//         for (const mutation of mutations) {
//             if (mutation.type === "childList") {
//                 console.log("Children were modified!");

//                 listbox = document.querySelector("tp-yt-paper-listbox")!;
//                 initListBoxListener();
//                 observer.disconnect();
//                 break;
//             }
//         }
//     });

//     observer.observe(elem, {
//         childList: true,
//         subtree: false,
//     });
// });
