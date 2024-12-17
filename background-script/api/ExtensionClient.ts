import { BaseMessagingClient } from "../../shared/baseExtensionClient";
import {
    ExtensionMessage,
    ExtensionMessagePayloadMap,
    ExtensionMessageType,
} from "types/extensionMessage";

export class BackgroundMessagingClient extends BaseMessagingClient {
    private static _instance: BackgroundMessagingClient;
    private _tabIds: Set<number> = new Set();
    private _primaryTabId: number = 0;

    private constructor() {
        super();
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
    }

    public broadcastMessage<T extends ExtensionMessageType>(
        type: T,
        payload: ExtensionMessagePayloadMap[T],
    ): void {
        const message: ExtensionMessage<T> = { type, payload };
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

    public get tabIds(): Set<number> {
        return this._tabIds;
    }

    public get primaryTab(): number {
        return this._primaryTabId;
    }

    public set primaryTab(tabId: number) {
        this._primaryTabId = tabId;
    }
}
