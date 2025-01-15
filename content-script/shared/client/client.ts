import { BaseMessagingClient } from "../../../shared/baseExtensionClient";
// import { CsLogger } from "@shared/logging/logger";
import {
    ExtensionMessage,
    ExtensionMessagePayloadMap,
    ExtensionMessageType,
} from "types/extensionMessage";
// import { logObject } from "types/logObject.type";
import browser from "webextension-polyfill";

// const logger = CsLogger.getInstance();
export class ContentScriptMessagingClient extends BaseMessagingClient {
    public constructor() {
        super();
    }

    public static async sendMessage<T extends ExtensionMessageType>(
        type: T,
        payload?: ExtensionMessagePayloadMap[T],
    ): Promise<any> {
        const message: ExtensionMessage<T> = { type, payload };
        const response = await browser.runtime.sendMessage(message);
        return response;
    }
}
