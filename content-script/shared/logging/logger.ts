import { ContentScriptMessagingClient } from "@shared/client/client";
import Logger from "shared/logger";
import { ExtensionMessageType } from "types/extensionMessage";

export class CSLogger extends Logger {
    private static instance: CSLogger;

    constructor() {
        super();
        ContentScriptMessagingClient.sendMessage(ExtensionMessageType.GET_DEVMODE).then(
            debugMode => {
                this.setEnabled(debugMode);
            },
        );

        const contentScriptMessagingClient = new ContentScriptMessagingClient();

        contentScriptMessagingClient.addHandler(
            ExtensionMessageType.DEVMODE_UPDATED,
            (devMode: boolean) => {
                this.setEnabled(devMode);
            },
        );
    }

    public static getInstance(): CSLogger {
        return (CSLogger.instance ??= new CSLogger());
    }
}
