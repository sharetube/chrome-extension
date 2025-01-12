import { ProfileStorage } from "./profileStorage";
import { TabStorage } from "./tabStorage";
import browser from "webextension-polyfill";

browser.runtime.onInstalled.addListener(details => {
    console.log("onInstalled", details);
    TabStorage.getInstance().unsetPrimaryTab();
    ProfileStorage.getInstance().get();
});
