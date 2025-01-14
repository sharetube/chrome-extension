import { BackgroundMessagingClient } from "./clients/ExtensionClient";
import ServerClient from "./clients/ServerClient";
import { BGLogger } from "./logging/logger";
import { ProfileStorage } from "./profileStorage";
import { globalState } from "./state";
import { TabStorage } from "./tabStorage";
import { setTargetPrimaryTabId } from "./targetPrimaryTabId";
import { ExtensionMessageType } from "types/extensionMessage";
import browser from "webextension-polyfill";

const server = ServerClient.getInstance();
const tabStorage = TabStorage.getInstance();
const logger = BGLogger.getInstance();
const bgMessagingClient = BackgroundMessagingClient.getInstance();
const profileStorage = ProfileStorage.getInstance();

const domainRegex = /^https:\/\/(www\.)?(youtu\.be|youtube\.com)/;
const inviteLinkRegex = /^https:\/\/(www\.)?(youtu\.be|youtube\.com)\/st\/(.+)$/;
const roomIdRegex = /^[a-zA-Z0-9.-]{8}$/;

const handleTab = async (tabId: number, url: string) => {
    const inviteLinkMatch = url.match(inviteLinkRegex);
    if (!inviteLinkMatch) return;

    const showErrorPage = () => {
        browser.tabs.update(tabId, {
            url: browser.runtime.getURL("/pages/error.html"),
        });
    };

    const roomId = inviteLinkMatch[3];
    const roomIdMatch = roomId.match(roomIdRegex);
    if (!roomIdMatch) {
        showErrorPage();
        return;
    }

    const primaryTabId = await tabStorage.getPrimaryTab();
    if (primaryTabId) {
        if (primaryTabId === tabId) {
            server.close();
        } else {
            browser.tabs.update(primaryTabId, { active: true });
            browser.tabs.remove(tabId);
            return;
        }
    } else {
        // show loading screen
        browser.tabs.update(tabId, {
            url: browser.runtime.getURL("/pages/loading.html"),
        });
    }

    setTargetPrimaryTabId(tabId);
    const profile = await profileStorage.get();
    server.joinRoom(profile, roomId).catch(() => {
        showErrorPage();
    });
};

async function clearPrimaryTab() {
    server.close();
    await tabStorage.unsetPrimaryTab();
    bgMessagingClient.broadcastMessage(ExtensionMessageType.PRIMARY_TAB_UNSET);
}

export async function getPrimaryTabIdOrUnset(): Promise<number | null> {
    const primaryTabId = await tabStorage.getPrimaryTab();
    if (!primaryTabId) return null;

    return new Promise(resolve => {
        browser.tabs
            .get(primaryTabId)
            .then(() => resolve(primaryTabId))
            .catch(async () => {
                tabStorage.removeTab(primaryTabId);
                await clearPrimaryTab();
                resolve(null);
            });
    });
}

browser.webNavigation.onBeforeNavigate.addListener(
    details => {
        if (details.url) handleTab(details.tabId, details.url);
    },
    { url: [{ hostSuffix: "youtu.be" }, { hostSuffix: "youtube.com" }] },
);

browser.tabs.onRemoved.addListener(async tabId => {
    logger.log("tab removed", { tabdId: tabId });
    getPrimaryTabIdOrUnset();
});

let ignoreNextTabUpdate = false;
browser.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    if (!changeInfo.url) {
        return;
    }

    const primaryTabId = await getPrimaryTabIdOrUnset();
    if (primaryTabId !== tabId) {
        return;
    }
    logger.log("tab updated", { tabId, url: changeInfo.url });

    if (ignoreNextTabUpdate) {
        ignoreNextTabUpdate = false;
        return;
    }

    if (
        !tab.url?.match(domainRegex) ||
        (changeInfo.url !== `https://www.youtube.com/st/${globalState.room.id}` &&
            changeInfo.url !==
                `https://www.youtube.com/watch?v=${globalState.room.player.video_url}` &&
            changeInfo.url !==
                `https://www.youtube.com/watch?v=${globalState.room.player.video_url}`)
    ) {
        clearPrimaryTab();
        return;
    }

    ignoreNextTabUpdate = true;
    bgMessagingClient.sendMessageToPrimaryTab(
        ExtensionMessageType.UPDATE_URL,
        `/st/${globalState.room.id}`,
    );
});
