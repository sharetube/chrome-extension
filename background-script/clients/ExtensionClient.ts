import { BaseMessagingClient } from "../../shared/baseExtensionClient";
import { PrimaryTabStorage } from "background-script/primaryTabStorage";
import {
    ExtensionMessage,
    ExtensionMessagePayloadMap,
    ExtensionMessageType,
} from "types/extensionMessage";

export class BackgroundMessagingClient extends BaseMessagingClient {
    private static _instance: BackgroundMessagingClient;
    private _tabIds: Set<number> = new Set();
    private _primatyTabStorage: PrimaryTabStorage;

    constructor() {
        super();
        this._primatyTabStorage = PrimaryTabStorage.getInstance();
    }

    public static getInstance(): BackgroundMessagingClient {
        return (BackgroundMessagingClient._instance ??= new BackgroundMessagingClient());
    }

    public sendMessage<T extends ExtensionMessageType>(
        tabId: number,
        type: T,
        payload: ExtensionMessagePayloadMap[T],
    ): void {
        const message: ExtensionMessage<T> = { type, payload };
        chrome.tabs.sendMessage(tabId, message);
        console.log(`sending message to tab ${tabId}`, message);
    }

    public async sendMessageToPrimaryTab<T extends ExtensionMessageType>(
        type: T,
        payload: ExtensionMessagePayloadMap[T],
    ): Promise<void> {
        const primaryTabId = await this._primatyTabStorage.get();
        if (!primaryTabId) {
            console.error("Error trying send to primary tab: no primary tab found");
            return;
        }

        const message: ExtensionMessage<T> = { type, payload };
        console.log("sending message to primary tab", message);
        chrome.tabs.sendMessage(primaryTabId, message);
    }

    public broadcastMessage<T extends ExtensionMessageType>(
        type: T,
        payload?: ExtensionMessagePayloadMap[T],
    ): void {
        const message: ExtensionMessage<T> = { type, payload };
        console.log("broadcasting message to all tabs", message);
        this._tabIds.forEach(tabId => {
            chrome.tabs.sendMessage(tabId, message);
        });
    }

    public addTab(tabId: number): void {
        this._tabIds.add(tabId);
    }

    public removeTab(tabId: number): void {
        this._tabIds.delete(tabId);
    }

    public tabExists(tabId: number): boolean {
        return this._tabIds.has(tabId);
    }
}
