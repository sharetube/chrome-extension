import { BaseMessagingClient } from "../../../shared/baseExtensionClient";
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
        payload: ExtensionMessagePayloadMap[T],
    ): Promise<any> {
        const message: ExtensionMessage<T> = { type, payload };
        return new Promise(resolve => {
            chrome.runtime.sendMessage(message, (response: any) => {
                resolve(response);
            });
        });
    }
}
