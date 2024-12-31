export class PrimaryTabStorage {
    private static _instance: PrimaryTabStorage;
    private _primaryTabId: number | null = null;
    private readonly STORAGE_KEY = "st-primary-tab";

    public static getInstance(): PrimaryTabStorage {
        if (!PrimaryTabStorage._instance) {
            PrimaryTabStorage._instance = new PrimaryTabStorage();
        }
        return PrimaryTabStorage._instance;
    }

    public set(tabId: number): Promise<void> {
        if (this._primaryTabId === tabId) return Promise.resolve();
        this._primaryTabId = tabId;
        return chrome.storage.local.set({ [this.STORAGE_KEY]: tabId });
    }

    private checkIfTabExists(tabId: number): Promise<boolean> {
        return chrome.tabs
            .get(tabId)
            .then(() => true)
            .catch(() => false);
    }

    public async get(): Promise<number | null> {
        const primaryTabId =
            (await chrome.storage.local.get(this.STORAGE_KEY))[this.STORAGE_KEY] || null;
        if (!primaryTabId) return null;

        if (!(await this.checkIfTabExists(primaryTabId))) {
            this.unset();
            return null;
        }

        return primaryTabId;
    }

    public unset(): Promise<void> {
        return new Promise((resolve, reject) => {
            chrome.storage.local
                .remove(this.STORAGE_KEY)
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
