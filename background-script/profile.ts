import { BackgroundMessagingClient } from "./ExtensionClient";
import { updateProfile } from "./server";
import { defaultProfile } from "constants/defaultProfile";
import { ExtensionMessageType } from "types/extensionMessage";
import type { profile } from "types/profile";

const messagingClient = BackgroundMessagingClient.getInstance();
const profileKey = "st-profile";

export const setUserProfile = (profile: profile) => {
    chrome.storage.sync.set({ [profileKey]: profile }, () => {
        updateProfile(profile);
        if (chrome.runtime.lastError)
            console.error("Error setting profile:", chrome.runtime.lastError);
    });
};

export const getUserProfile = (): Promise<profile> =>
    new Promise(resolve => {
        chrome.storage.sync.get(profileKey, result => {
            resolve(!chrome.runtime.lastError && result[profileKey] ? result[profileKey] : null);
        });
    });

chrome.runtime.onInstalled.addListener(async () => {
    const profile = await getUserProfile();
    if (!profile) setUserProfile(defaultProfile);
});

const notifyTabsProfileUpdated = (profile: profile) =>
    messagingClient.broadcastMessage(ExtensionMessageType.PROFILE_UPDATED, profile);

messagingClient.addHandler(ExtensionMessageType.UPDATE_PROFILE, message => {
    setUserProfile(message);
    notifyTabsProfileUpdated(message);
});

messagingClient.addHandler(
    ExtensionMessageType.GET_PROFILE,
    (_, sender): Promise<profile | null> => {
        if (sender.tab?.id !== undefined) messagingClient.addTab(sender.tab.id);
        return getUserProfile();
    },
);
