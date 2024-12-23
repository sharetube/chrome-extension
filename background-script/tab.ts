import { BackgroundMessagingClient } from "./clients/ExtensionClient";
import ServerClient from "./clients/ServerClient";
import { getUserProfile } from "./profile";
import { ExtensionMessageType } from "types/extensionMessage";

const server = ServerClient.getInstance();

type TabId = number;
const messagingClient = BackgroundMessagingClient.getInstance();
const inviteLinkRegex = /^https:\/\/(www\.)?youtu\.be\/st\/([a-zA-Z0-9.-]{8})$/;

export const setPrimaryTab = (tabId: TabId) => {
    messagingClient.primaryTab = tabId;
    chrome.storage.local.set({ "st-primary-tab": tabId }, notifyTabsPrimaryTabSet);
};

export const getPrimaryTab = (): Promise<number | null> =>
    chrome.storage.local
        .get("st-primary-tab")
        .then(result => (chrome.runtime.lastError ? null : result["st-primary-tab"] || null))
        .catch(err => {
            console.error("Error getting primary tab:", err);
            return null;
        });

export const clearPrimaryTab = () => {
    server.close();
    chrome.storage.local.remove("st-primary-tab", () => {
        if (chrome.runtime.lastError) {
            console.error("Error removing primary tab:", chrome.runtime.lastError);
        } else {
            notifyTabsPrimaryTabUnset();
        }
    });
};

export const notifyTabsPrimaryTabSet = () =>
    messagingClient.broadcastMessage(ExtensionMessageType.PRIMARY_TAB_SET, null);

export const notifyTabsPrimaryTabUnset = () => {
    try {
        messagingClient.broadcastMessage(ExtensionMessageType.PRIMARY_TAB_UNSET, null);
    } catch (error) {
        console.error("Error broadcasting PRIMARY_TAB_UNSET message:", error);
    }
};

const handleTab = async (tabId: number, url: string) => {
    const match = url.match(inviteLinkRegex);
    if (!match || match[2].length !== 8) return;

    const primaryTabId = await getPrimaryTab();
    if (primaryTabId) {
        chrome.tabs.update(primaryTabId, { active: true });
        chrome.tabs.remove(tabId);
    } else {
        const profile = await getUserProfile();
        server.join(profile, match[2]);
        setPrimaryTab(tabId);
    }
};

chrome.webNavigation.onBeforeNavigate.addListener(
    details => {
        if (details.url) handleTab(details.tabId, details.url);
    },
    { url: [{ hostSuffix: "youtu.be" }] },
);

const createTab = (videoId: string) => {
    getUserProfile().then(profile => {
        server.create(profile, videoId);
    });
};

chrome.tabs.onRemoved.addListener(tabId => {
    getPrimaryTab()
        .then(primaryTabId => {
            if (primaryTabId === tabId) clearPrimaryTab();
        })
        .catch(err => console.log(err));
});

messagingClient.addHandler(ExtensionMessageType.SWITCH_TO_PRIMARY_TAB, () => {
    getPrimaryTab().then(primaryTabId => {
        if (primaryTabId) chrome.tabs.update(primaryTabId, { active: true });
    });
});

messagingClient.addHandler(
    ExtensionMessageType.IS_PRIMARY_TAB,
    (_, sender): Promise<boolean> =>
        getPrimaryTab().then(primaryTabId => {
            if (sender.tab?.id !== undefined) {
                messagingClient.addTab(sender.tab.id);
                return primaryTabId === sender.tab?.id;
            }
            return false;
        }),
);

messagingClient.addHandler(
    ExtensionMessageType.CHECK_PRIMARY_TAB_EXISTS,
    (_, sender): Promise<boolean> =>
        getPrimaryTab().then(primaryTabId => {
            if (sender.tab?.id !== undefined) {
                messagingClient.addTab(sender.tab.id);
                return primaryTabId !== null;
            }
            return false;
        }),
);

messagingClient.addHandler(ExtensionMessageType.CREATE_ROOM, payload => createTab(payload.videoId));
