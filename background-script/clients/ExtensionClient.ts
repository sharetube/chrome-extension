import { BaseMessagingClient } from "../../shared/baseExtensionClient";
import { TabStorage } from "background-script/tabStorage";
import {
    ExtensionMessage,
    ExtensionMessagePayloadMap,
    ExtensionMessageType,
} from "types/extensionMessage";

export class BackgroundMessagingClient extends BaseMessagingClient {
    private static _instance: BackgroundMessagingClient;
    private _tabStorage: TabStorage;

    constructor() {
        super();
        this._tabStorage = TabStorage.getInstance();
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
        const primaryTabId = await this._tabStorage.getPrimaryTab();
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
        this._tabStorage.getTabs().forEach(tabId => {
            chrome.tabs.sendMessage(tabId, message);
        });
    }
}
