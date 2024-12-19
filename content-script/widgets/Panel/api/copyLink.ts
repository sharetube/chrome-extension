import { ContentScriptMessagingClient } from "@shared/client/client";
import { ExtensionMessageType } from "types/extensionMessage";

const copyLink = () => {
    let link: string = "";
    ContentScriptMessagingClient.getInstance()
        .sendMessage(ExtensionMessageType.COPY_LINK, null)
        .then(payload => {
            link = `https://youtu.be/st/${payload}`;
            navigator.clipboard.writeText(link);
        });
};

export default copyLink;
