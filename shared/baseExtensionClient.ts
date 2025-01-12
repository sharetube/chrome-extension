import {
    ExtensionMessage,
    ExtensionMessagePayloadMap,
    ExtensionMessageType,
} from "../types/extensionMessage";
import { log } from "./log";
import browser from "webextension-polyfill";

type MessageHandler<T extends ExtensionMessageType> = (
    payload: ExtensionMessagePayloadMap[T],
    sender: chrome.runtime.MessageSender,
) => any;

export abstract class BaseMessagingClient {
    protected handlers: Map<ExtensionMessageType, MessageHandler<any>>;

    protected constructor() {
        this.handlers = new Map();
        this.initMessageListener();
    }

    protected initMessageListener(): void {
        browser.runtime.onMessage.addListener((message: any, sender: any, sendResponse) => {
            this.handleMessage(message, sender).then(sendResponse);
            return true;
        });
    }

    protected async handleMessage(
        message: ExtensionMessage<ExtensionMessageType>,
        sender: chrome.runtime.MessageSender,
    ): Promise<any> {
        const handler = this.handlers.get(message.type);
        if (handler) {
            log(`handling incoming message: type: ${message.type}, payload: `, message.payload);
            return handler(message.payload, sender);
        }
    }

    public addHandler<T extends ExtensionMessageType>(type: T, handler: MessageHandler<T>): void {
        this.handlers.set(type, handler);
    }

    public removeHandler<T extends ExtensionMessageType>(type: T): void {
        this.handlers.delete(type);
    }
}
