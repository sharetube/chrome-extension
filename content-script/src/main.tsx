import React from "react";
// Global styles
import "@app/styles/global.css";
// Tabs
import PrimaryTab from "@tabs/Primary/Primary";
import waitForElement from "@shared/utils/waitForElement";

PrimaryTab();

waitForElement("#img").then(element => {
    const srcValue = element!.getAttribute("src");
    console.log(srcValue);
});

(function checkAvatarUrl() {
    const ytInitialData = (window as any).ytInitialData;
    if (
        ytInitialData &&
        ytInitialData.topbar &&
        ytInitialData.topbar.desktopTopbarRenderer
    ) {
        try {
            const avatarUrl =
                ytInitialData.topbar.desktopTopbarRenderer.topbarButtons[2]
                    .topbarMenuButtonRenderer.avatar.thumbnails[0].url;
            console.log(avatarUrl);
        } catch (error) {
            console.error("Failed to retrieve avatar URL:", error);
        }
    } else {
        setTimeout(checkAvatarUrl, 100); // Retry after 100ms
    }
})();
