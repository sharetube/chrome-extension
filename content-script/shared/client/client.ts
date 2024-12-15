import { BaseMessagingClient } from "../../../shared/baseClient";
import {
    ExtensionMessage,
    ExtensionMessagePayloadMap,
    ExtensionMessageType,
} from "types/extensionMessage";

export class ContentScriptMessagingClient extends BaseMessagingClient {
    private static _instance: ContentScriptMessagingClient;

    private constructor() {
        super();
    }

    public static getInstance(): ContentScriptMessagingClient {
        return (ContentScriptMessagingClient._instance ??= new ContentScriptMessagingClient());
    }

    public async sendMessage<T extends ExtensionMessageType>(
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
