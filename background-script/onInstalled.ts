import { PrimaryTabStorage } from "./primaryTabStorage";
import { ProfileStorage } from "./profileStorage";

chrome.runtime.onInstalled.addListener(details => {
    console.log("onInstalled", details);
    PrimaryTabStorage.getInstance().remove();
    ProfileStorage.getInstance().get();
});
