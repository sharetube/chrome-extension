import type {
	ExtensionMessage,
	ExtensionMessagePayloadMap,
	ExtensionMessageType,
} from "types/extensionMessage";
import browser from "webextension-polyfill";
import { BaseMessagingClient } from "../../../shared/baseExtensionClient";

export class ContentScriptMessagingClient extends BaseMessagingClient {
	public static async sendMessage<T extends ExtensionMessageType>(
		type: T,
		payload?: ExtensionMessagePayloadMap[T],
	): Promise<any> {
		const message: ExtensionMessage<T> = { type, payload };
		const response = await browser.runtime.sendMessage(message);
		return response;
	}
}
