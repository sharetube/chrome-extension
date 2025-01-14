import { ContentScriptMessagingClient } from "@shared/client/client";
import { CSLogger } from "@shared/logging/logger";
import { ExtensionMessageType } from "types/extensionMessage";

function callOncePerInterval(func: () => void, delay: number) {
    let isAllowed = true;

    return () => {
        if (isAllowed) {
            func();
            isAllowed = false;

            setTimeout(() => {
                isAllowed = true; // Reset the state after the delay
            }, delay);
        }
    };
}
const throttledFireCopyLinkNotification = callOncePerInterval(() => {
    (
        document.querySelector(
            "yt-copy-link-renderer yt-button-renderer .yt-spec-touch-feedback-shape",
        ) as HTMLElement
    ).click();
}, 3500);

const copyLink = () => {
    //? store roomId locally
    ContentScriptMessagingClient.sendMessage(ExtensionMessageType.GET_ROOM_ID).then(payload => {
        const link = `https://youtu.be/st/${payload}`;
        throttledFireCopyLinkNotification();
        navigator.clipboard.writeText(link);
        CSLogger.getInstance().log("link copied", { link });
    });
};

export default copyLink;
