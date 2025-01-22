import browser from "webextension-polyfill";
import { BGLogger } from "./logging/logger";
import { ProfileStorage } from "./profileStorage";
import { TabStorage } from "./tabStorage";

browser.runtime.onInstalled.addListener((details) => {
	BGLogger.getInstance().log("onInstalled", details);
	TabStorage.getInstance().unsetPrimaryTab();
	ProfileStorage.getInstance().get();

	//? browser.action?.openPopup();
});
