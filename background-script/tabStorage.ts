export class TabStorage {
    private static _instance: TabStorage;
    private readonly PRIMARY_TAB_STORAGE_KEY = "st-primary-tab";
    private _tabs: Set<number>;

    constructor() {
        this._tabs = new Set();
    }

    public static getInstance(): TabStorage {
        return (TabStorage._instance ??= new TabStorage());
    }

    public addTab(tabId: number): void {
        if (!this._tabs.has(tabId)) this._tabs.add(tabId);
    }

    public removeTab(tabId: number): void {
        this._tabs.delete(tabId);
    }

    public tabExists(tabId: number): boolean {
        return this._tabs.has(tabId);
    }

    public getTabs(): Set<number> {
        return this._tabs;
    }

    public setPrimaryTab(tabId: number): Promise<void> {
        console.log("Setting primary tab", tabId);
        return chrome.storage.local.set({ [this.PRIMARY_TAB_STORAGE_KEY]: tabId });
    }

    public async getPrimaryTab(): Promise<number | null> {
        const primaryTabId =
            (await chrome.storage.local.get(this.PRIMARY_TAB_STORAGE_KEY))[
                this.PRIMARY_TAB_STORAGE_KEY
            ] || null;
        if (!primaryTabId) return null;

        return primaryTabId;
    }

    public unsetPrimaryTab(): Promise<void> {
        return new Promise((resolve, reject) => {
            chrome.storage.local
                .remove(this.PRIMARY_TAB_STORAGE_KEY)
                .then(() => {
                    if (chrome.runtime.lastError) {
                        console.error("Error removing primary tab:", chrome.runtime.lastError);
                        reject(chrome.runtime.lastError);
                    }
                    console.log("Primary tab removed");
                    resolve();
                })
                .catch(err => {
                    console.error("Error removing primary tab:", err);
                    reject(err);
                });
        });
    }
}
