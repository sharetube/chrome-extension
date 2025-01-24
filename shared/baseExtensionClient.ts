import browser from "webextension-polyfill";
import type {
	ExtensionMessage,
	ExtensionMessagePayloadMap,
	ExtensionMessageType,
} from "../types/extensionMessage";

type MessageHandler<T extends ExtensionMessageType> = (
	payload: ExtensionMessagePayloadMap[T],
	sender: browser.Runtime.MessageSender,
) => any;

export abstract class BaseMessagingClient {
	protected handlers: Map<ExtensionMessageType, MessageHandler<any>>;

	constructor() {
		this.handlers = new Map();
		this.initMessageListener();
	}

	protected initMessageListener(): void {
		browser.runtime.onMessage.addListener(
			(message: any, sender: browser.Runtime.MessageSender, sendResponse) => {
				this.handleMessage(message, sender).then(sendResponse);
				return true;
			},
		);
	}

	protected async handleMessage(
		message: ExtensionMessage<ExtensionMessageType>,
		sender: browser.Runtime.MessageSender,
	): Promise<any> {
		const handler = this.handlers.get(message.type);
		if (handler) {
			return handler(message.payload, sender);
		}
	}

	public addHandler<T extends ExtensionMessageType>(
		type: T,
		handler: MessageHandler<T>,
	): void {
		this.handlers.set(type, handler);
	}

	public removeHandler<T extends ExtensionMessageType>(type: T): void {
		this.handlers.delete(type);
	}
}
