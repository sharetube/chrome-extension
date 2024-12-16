import { BackgroundMessagingClient } from "./client";
import { defaultUser } from "constants/defaultUser";
import { ExtensionMessageType } from "types/extensionMessage";
import type { user } from "types/user";

const messagingClient = BackgroundMessagingClient.getInstance();
const profileKey = "st-profile";

const setUserProfile = (profile: user) => {
    chrome.storage.sync.set({ [profileKey]: profile }, () => {
        if (chrome.runtime.lastError)
            console.error("Error setting profile:", chrome.runtime.lastError);
    });
};

const getUserProfile = (): Promise<user | null> =>
    new Promise(resolve => {
        chrome.storage.sync.get(profileKey, result => {
            resolve(!chrome.runtime.lastError && result[profileKey] ? result[profileKey] : null);
        });
    });

chrome.runtime.onInstalled.addListener(async () => {
    const profile = await getUserProfile();
    if (!profile) setUserProfile(defaultUser);
});

const notifyTabsProfileUpdated = (profile: user) =>
    messagingClient.broadcastMessage(ExtensionMessageType.PROFILE_UPDATED, profile);

messagingClient.addHandler(ExtensionMessageType.UPDATE_PROFILE, message => {
    setUserProfile(message);
    notifyTabsProfileUpdated(message);
});

messagingClient.addHandler(ExtensionMessageType.GET_PROFILE, (_, sender): Promise<user | null> => {
    if (sender.tab?.id !== undefined) messagingClient.addTab(sender.tab.id);
    return getUserProfile();
});
