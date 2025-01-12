import { BaseMessagingClient } from "../../../shared/baseExtensionClient";
import { log } from "shared/log";
import {
    ExtensionMessage,
    ExtensionMessagePayloadMap,
    ExtensionMessageType,
} from "types/extensionMessage";
import browser from "webextension-polyfill";

export class ContentScriptMessagingClient extends BaseMessagingClient {
    public constructor() {
        super();
    }

    public static async sendMessage<T extends ExtensionMessageType>(
        type: T,
        payload?: ExtensionMessagePayloadMap[T],
    ): Promise<any> {
        const message: ExtensionMessage<T> = { type, payload };
        try {
            log("sending message to bg worker", message);
            const response = await browser.runtime.sendMessage(message);
            return response;
        } catch (error) {
            log("Error sending message:", error);
            throw error;
        }
    }
}
