import Player from "@player/player";
import { AdminProvider } from "@shared/Context/Admin/Admin";
import { ContentScriptMessagingClient } from "@shared/client/client";
import waitForElement from "@shared/lib/waitForElement";
import Panel from "@widgets/Panel/Panel";
import Search from "@widgets/Search/Search";
import React from "react";
import ReactDOM from "react-dom/client";
import { ExtensionMessageType } from "types/extensionMessage";

const contentScriptMessageClient = new ContentScriptMessagingClient();
let isPrimaryTab = false;

function update() {
    ContentScriptMessagingClient.sendMessage(ExtensionMessageType.IS_PRIMARY_TAB).then(
        (res: boolean) => {
            if (isPrimaryTab === res) return;
            isPrimaryTab = res;

            if (res) {
                initPlayer();
                initSearch();
                hideAutoplayButton();
                hideNextVideoButton();
                hideBottomPanel();
                hideClipButton();
                hideVoiceSearchButton();
                showMainPanel();
            } else {
                disablePlayer();
                disableSearch();
                showAutoplayButton();
                showNextVideoButton();
                showBottomPanel();
                showClipButton();
                showVoiceSearchButton();
                hideMainPanel();
            }
        },
    );
}

contentScriptMessageClient.addHandler(ExtensionMessageType.PRIMARY_TAB_UNSET, () => {
    update();
});
update();

let player: Player | null = null;
function initPlayer() {
    waitForElement(".html5-video-player").then(e => {
        waitForElement("video").then(p => {
            console.log("Player found");
            player = new Player(e as HTMLElement, p as HTMLVideoElement);
        });
        // .catch(error => console.log("Failed select video element", error));
    });
    // .catch(error => console.log("Failed select player element", error));
}

function disablePlayer() {
    if (!player) return;
    player.clearAll();
}

function hideAutoplayButton() {
    waitForElement(".ytp-autonav-toggle-button-container").then(elem => {
        Object.assign(elem!.style, { transform: "scale(0)" });
    });
    // .then(error => console.log("Failed to remove autoplay button", error));
}

function showAutoplayButton() {
    waitForElement(".ytp-autonav-toggle-button-container").then(elem => {
        Object.assign(elem!.style, { transform: "scale(1)" });
    });
    // .then(error => console.log("Failed to remove autoplay button", error));
}

function hideNextVideoButton() {
    waitForElement(".ytp-next-button.ytp-button").then(elem => {
        Object.assign(elem!.style, { transform: "scale(0)" });
    });
    // .catch(error => console.log("Failed to remove next button", error));
}

function showNextVideoButton() {
    waitForElement(".ytp-next-button.ytp-button").then(elem => {
        Object.assign(elem!.style, { transform: "scale(1)" });
    });
    // .catch(error => console.log("Failed to remove next button", error));
}

function hideClipButton() {
    waitForElement("#flexible-item-buttons").then(elem => {
        Object.assign(elem!.style, { transform: "scale(0)" });
    });
    // .catch(error => console.log("Failed to remove clip button", error));
}

function showClipButton() {
    waitForElement("#flexible-item-buttons").then(elem => {
        Object.assign(elem!.style, { transform: "scale(1)" });
    });
    // .catch(error => console.log("Failed to remove clip button", error));
}

function hideBottomPanel() {
    waitForElement("yt-button-shape#button-shape").then(elem => {
        Object.assign(elem!.style, { transform: "scale(0)" });
    });
    // .catch(error => console.log("Failed to shape button", error));
}

function showBottomPanel() {
    waitForElement("yt-button-shape#button-shape").then(elem => {
        Object.assign(elem!.style, { transform: "scale(1)" });
    });
    // .catch(error => console.log("Failed to shape button", error));
}

function showMainPanel() {
    waitForElement("#secondary-inner").then(elem => {
        Object.assign(elem!.style, { transform: "scale(0)" });
        const container = document.createElement("div");
        elem?.parentElement?.prepend(container);

        ReactDOM.createRoot(container).render(
            <AdminProvider>
                <Panel />
            </AdminProvider>,
        );
    });
    // .catch(error => console.log("Failed to render main panel", error));
}

function hideMainPanel() {
    waitForElement("#secondary-inner").then(elem => {
        Object.assign(elem!.style, { transform: "scale(1)" });
        elem?.parentElement?.firstChild?.remove();
    });
    // .catch(error => console.log("Failed to render main panel", error));
}

// todo: fix
function initSearch() {
    waitForElement("#center").then(elem => {
        Object.assign((elem!.firstElementChild as HTMLElement).style, { transform: "scale(0)" });
        const container = document.createElement("div");
        container.style.width = "100%";
        elem!.prepend(container);

        ReactDOM.createRoot(container).render(
            <AdminProvider>
                <Search />
            </AdminProvider>,
        );
    });
    // .catch(error => console.log("Failed to render input", error));
}

function disableSearch() {
    waitForElement("#center").then(elem => {
        elem!.firstChild!.remove();
        Object.assign((elem!.firstElementChild as HTMLElement).style, { transform: "scale(1)" });
    });
}

function showVoiceSearchButton() {
    waitForElement("#voice-search-button").then(elem => {
        Object.assign(elem!.style, { transform: "scale(1)" });
    });
}

function hideVoiceSearchButton() {
    waitForElement("#voice-search-button").then(elem => {
        Object.assign(elem!.style, { transform: "scale(0)" });
    });
}
