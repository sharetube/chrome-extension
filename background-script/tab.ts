import { BackgroundMessagingClient } from "./clients/ExtensionClient";
import ServerClient from "./clients/ServerClient";
import { PrimaryTabStorage } from "./primaryTabStorage";
import { ProfileStorage } from "./profileStorage";
import { setTargetPrimaryTabId } from "./targetPrimaryTabId";
import { ExtensionMessageType } from "types/extensionMessage";

const server = ServerClient.getInstance();

const primaryTabStorage = PrimaryTabStorage.getInstance();

const bgMessagingClient = BackgroundMessagingClient.getInstance();

const inviteLinkRegex = /^https:\/\/(www\.)?youtu\.be\/st\/(.+)$/;
const roomIdRegex = /^[a-zA-Z0-9.-]{8}$/;

export const notifyTabsPrimaryTabSet = () =>
    bgMessagingClient.broadcastMessage(ExtensionMessageType.PRIMARY_TAB_SET);

export const notifyTabsPrimaryTabUnset = () => {
    try {
        bgMessagingClient.broadcastMessage(ExtensionMessageType.PRIMARY_TAB_UNSET);
    } catch (error) {
        console.error("Error broadcasting PRIMARY_TAB_UNSET message:", error);
    }
};

const handleTab = async (tabId: number, url: string) => {
    const inviteLinkMatch = url.match(inviteLinkRegex);
    console.log("inviteLinkMatch", inviteLinkMatch);
    if (!inviteLinkMatch) return;

    const showErrorPage = () => {
        chrome.tabs.update(tabId, {
            url: chrome.runtime.getURL("/pages/error.html"),
        });
    };

    const roomId = inviteLinkMatch[2];
    const roomIdMatch = roomId.match(roomIdRegex);
    console.log("roomIdMatch", roomIdMatch);
    if (!roomIdMatch) {
        showErrorPage();
        return;
    }

    const primaryTabId = await primaryTabStorage.get();
    if (primaryTabId) {
        chrome.tabs.update(primaryTabId, { active: true });
        chrome.tabs.remove(tabId);
    } else {
        const profile = await ProfileStorage.getInstance().get();

        setTargetPrimaryTabId(tabId);
        // show loading screen
        chrome.tabs.update(tabId, {
            url: chrome.runtime.getURL("/pages/loading.html"),
        });

        server
            .joinRoom(profile, roomId)
            .then(() => {
                console.log("ws connected");
            })
            .catch(err => {
                console.log("ws error", err);
                showErrorPage();
            });
    }
};

chrome.webNavigation.onBeforeNavigate.addListener(
    details => {
        if (details.url) handleTab(details.tabId, details.url);
    },
    { url: [{ hostSuffix: "youtu.be" }, { hostSuffix: "youtube.com" }] },
);

chrome.tabs.onRemoved.addListener(tabId => {
    console.log("tab removed", tabId);
    if (bgMessagingClient.tabExists(tabId)) {
        bgMessagingClient.removeTab(tabId);
        primaryTabStorage
            .get()
            .then(primaryTabId => {
                if (primaryTabId === tabId) {
                    server.close();
                    primaryTabStorage.remove();
                }
            })
            .catch(err => console.log(err));
    }
});
