export class TabStorage {
    private static _instance: TabStorage;
    private readonly PRIMARY_TAB_STORAGE_KEY = "st-primary-tab";
    private readonly TABS_STORAGE_KEY = "st-tabs";

    public static getInstance(): TabStorage {
        return (TabStorage._instance ??= new TabStorage());
    }

    public async addTab(tabId: number): Promise<void> {
        const tabs = await this.getTabs();
        console.log("Adding tab", tabId, tabs);
        if (!tabs.includes(tabId)) {
            tabs.push(tabId);
            return chrome.storage.local.set({ [this.TABS_STORAGE_KEY]: tabs });
        }
    }

    public async removeTab(tabId: number): Promise<void> {
        const tabs = await this.getTabs();
        console.log("Removing tab", tabId, tabs);
        const newTabs = tabs.filter(t => t !== tabId);
        console.log("New tabs", newTabs);
        return chrome.storage.local.set({ [this.TABS_STORAGE_KEY]: newTabs });
    }

    public async tabExists(tabId: number): Promise<boolean> {
        return this.getTabs().then(tabs => tabs.includes(tabId));
    }

    public async getTabs(): Promise<number[]> {
        const tabs = await chrome.storage.local.get(this.TABS_STORAGE_KEY);
        console.log("get tabs", tabs);
        return tabs[this.TABS_STORAGE_KEY] || [];
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
