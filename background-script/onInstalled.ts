import DevMode from "./devMode";
import { ProfileStorage } from "./profileStorage";
import { TabStorage } from "./tabStorage";

chrome.runtime.onInstalled.addListener(details => {
    DevMode.log("onInstalled", details);
    TabStorage.getInstance().unsetPrimaryTab();
    ProfileStorage.getInstance().get();
    chrome.action.openPopup();
});
