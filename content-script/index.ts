import { ExtensionMessageType } from "../types/extensionMessage.ts";
import "./app/styles/global.css";
import { ContentScriptMessagingClient } from "./shared/client/client.ts";
import "./tabs/All/All.tsx";

ContentScriptMessagingClient.sendMessage(ExtensionMessageType.IS_PRIMARY_TAB).then(response => {
    console.log("isPrimaryTab", response);
    response && import("./tabs/Player/Player.tsx");
});
