import { BackgroundMessagingClient } from "./api/ExtensionClient";
import { ExtensionMessageType } from "types/extensionMessage";

type TabId = number;
const messagingClient = BackgroundMessagingClient.getInstance();
const regex = /^https:\/\/(www\.)?youtu\.be\/st\/([a-zA-Z0-9.-]{8})$/;

const setPrimaryTab = (tabId: TabId) => {
    chrome.storage.local.set({ "st-primary-tab": tabId }, notifyTabsPrimaryTabSet);
};

const getPrimaryTab = (): Promise<number | null> =>
    chrome.storage.local
        .get("st-primary-tab")
        .then(result => (chrome.runtime.lastError ? null : result["st-primary-tab"] || null));

const clearPrimaryTab = () =>
    chrome.storage.local.remove("st-primary-tab", notifyTabsPrimaryTabUnset);

const notifyTabsPrimaryTabSet = () =>
    messagingClient.broadcastMessage(ExtensionMessageType.PRIMARY_TAB_SET, null);

const notifyTabsPrimaryTabUnset = () =>
    messagingClient.broadcastMessage(ExtensionMessageType.PRIMARY_TAB_UNSET, null);

const handleTab = (tabId: number, url: string) => {
    if (regex.test(url)) {
        getPrimaryTab().then(primaryTabId => {
            if (primaryTabId) {
                chrome.tabs.update(primaryTabId, { active: true });
                chrome.tabs.onUpdated.addListener(function listener(updatedTabId, changeInfo) {
                    if (updatedTabId === tabId && changeInfo.status === "complete") {
                        chrome.tabs.remove(tabId, () =>
                            chrome.tabs.onUpdated.removeListener(listener),
                        );
                    }
                });
            } else {
                setPrimaryTab(tabId);
            }
        });
    } else {
        console.log("Not a join link");
        chrome.tabs.update(tabId, { url: `https://www.youtube.com/watch?v=2jNLSmbs8L0` });
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
    chrome.tabs.create({ url: `https://youtube.com/watch?v=${videoId}` }, tab => {
        if (tab.id) setPrimaryTab(tab.id);
        notifyTabsPrimaryTabSet();
    });
};

chrome.tabs.onRemoved.addListener(tabId => {
    getPrimaryTab().then(primaryTabId => {
        if (primaryTabId === tabId) clearPrimaryTab();
    });
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
