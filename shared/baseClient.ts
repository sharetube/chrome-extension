import {
    ExtensionMessage,
    ExtensionMessagePayloadMap,
    ExtensionMessageType,
} from "../types/extensionMessage";

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
        chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
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
            return handler(message.payload, sender);
        }
        console.error("No handler found for message type: ", message.type);
    }

    public addHandler<T extends ExtensionMessageType>(type: T, handler: MessageHandler<T>): void {
        this.handlers.set(type, handler);
    }
}