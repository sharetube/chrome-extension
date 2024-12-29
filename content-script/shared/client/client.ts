import { BaseMessagingClient } from "../../../shared/baseExtensionClient";
import { log } from "shared/log";
import {
    ExtensionMessage,
    ExtensionMessagePayloadMap,
    ExtensionMessageType,
} from "types/extensionMessage";

export class ContentScriptMessagingClient extends BaseMessagingClient {
    public constructor() {
        super();
    }

    public static async sendMessage<T extends ExtensionMessageType>(
        type: T,
        payload?: ExtensionMessagePayloadMap[T],
    ): Promise<any> {
        const message: ExtensionMessage<T> = { type, payload };
        return new Promise(resolve => {
            log("sending message to bg worker", message);
            chrome.runtime.sendMessage(message, (response: any) => {
                resolve(response);
            });
        });
    }
}
