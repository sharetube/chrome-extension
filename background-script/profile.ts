import { defaultUser } from "../constants/defaultUser";
import { ExtensionMessageType } from "../types/extensionMessage";
import { BackgroundMessagingClient } from "./client";
import type { user } from "types/user";

const messagingClient = BackgroundMessagingClient.getInstance();

const profileKey = "st-profile";

const setUserProfile = (profile: user) => {
    chrome.storage.sync.set({ "st-profile": profile }, () => {
        if (chrome.runtime.lastError) {
            console.error("Error setting profile:", chrome.runtime.lastError);
        }
    });
};

// Function to get user profile
const getUserProfile = (): Promise<user | null> => {
    return new Promise(resolve => {
        chrome.storage.sync.get(profileKey, result => {
            if (!chrome.runtime.lastError && result[profileKey]) {
                resolve(result[profileKey]);
            } else {
                resolve(null);
            }
        });
    });
};

// Set defaultUser when the extension is installed or updated, if the profile is missing
chrome.runtime.onInstalled.addListener(() => {
    getUserProfile().then(profile => {
        if (!profile) {
            setUserProfile(defaultUser);
        }
    });
});

const notifyTabsProfileUpdated = (profile: user) => {
    messagingClient.broadcastMessage(ExtensionMessageType.PROFILE_UPDATED, profile);
};

messagingClient.addHandler(ExtensionMessageType.UPDATE_PROFILE, (message, _) => {
    setUserProfile(message);
    notifyTabsProfileUpdated(message);
});

messagingClient.addHandler(ExtensionMessageType.GET_PROFILE, (_, sender): Promise<user | null> => {
    if (sender.tab?.id !== undefined) {
        messagingClient.addTab(sender.tab.id);
    }

    return getUserProfile();
});
