import { ExtensionMessageType } from "../types/extensionMessage.ts";
import "./app/styles/global.css";
import { ContentScriptMessagingClient } from "./shared/client/client.ts";
import "./tabs/All/All.tsx";

ContentScriptMessagingClient.getInstance()
    .sendMessage(ExtensionMessageType.IS_PRIMARY_TAB, null)
    .then(response => {
        if (response) {
            import("./tabs/Player/Player.tsx");
        }
    });
