import { defaultUser } from "../constants/defaultUser";
import type { user } from "types/user";

// Function to set default user profile
const setDefaultUserProfile = (callback?: () => void) => {
    chrome.storage.sync.set({ "st-profile": defaultUser }, () => {
        if (chrome.runtime.lastError) {
            console.error("Error setting default profile:", chrome.runtime.lastError);
        } else {
            console.log("Default profile set");
            if (callback) callback();
        }
    });
};

// Function to get user profile
const getUserProfile = (callback: (profile: user | null) => void) => {
    chrome.storage.sync.get("st-profile", items => {
        if (chrome.runtime.lastError) {
            console.error("Error getting profile:", chrome.runtime.lastError);
            callback(null);
        } else {
            const data = items as { "st-profile"?: user };
            if (!data["st-profile"]) {
                setDefaultUserProfile(() => callback(defaultUser));
            } else {
                callback(data["st-profile"]);
            }
        }
    });
};

// Set defaultUser when the extension is installed or updated, if the profile is missing
chrome.runtime.onInstalled.addListener(() => {
    getUserProfile(profile => {
        if (!profile) {
            setDefaultUserProfile();
        }
    });
});

const tabsRequestingProfile: number[] = [];

const notifyTabsProfileUpdated = () => {
    tabsRequestingProfile.forEach(tabId => {
        chrome.tabs.sendMessage(tabId, { action: "profile_updated" });
    });
};

// Message handlers
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch (message.action) {
        case "updateProfile":
            const profile: user = message.data;
            notifyTabsProfileUpdated();
            chrome.storage.sync.set({ "st-profile": profile }, () => {
                if (chrome.runtime.lastError) {
                    sendResponse({ success: false, error: chrome.runtime.lastError });
                } else {
                    sendResponse({ success: true });
                }
            });
            break;
        case "getProfile":
            if (sender.tab && sender.tab.id !== undefined) {
                tabsRequestingProfile.push(sender.tab.id);
            }
            getUserProfile(profile => {
                if (profile) {
                    console.log("Profile data retrieved:", profile);
                    sendResponse({ success: true, data: profile });
                } else {
                    sendResponse({ success: false, error: "Error getting profile" });
                }
            });
            break;
        default:
            console.error("unknown message.action: ", message.action);
            break;
    }
});
