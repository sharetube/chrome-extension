import browser from "webextension-polyfill";

export class JWTStorage {
	private static instance: JWTStorage;
	private readonly JWT_STORAGE_KEY = "st-jwt";

	public static getInstance(): JWTStorage {
		return (JWTStorage.instance ??= new JWTStorage());
	}

	public set(tabId: string): Promise<void> {
		return browser.storage.local.set({ [this.JWT_STORAGE_KEY]: tabId });
	}

	public async get(): Promise<string | null> {
		const result = await browser.storage.local.get(this.JWT_STORAGE_KEY);
		const jwt = result[this.JWT_STORAGE_KEY] as string | undefined;
		if (!jwt) return null;

		return jwt;
	}

	// public async unset(): Promise<void> {
	//     const jwt = await this.get();
	//     if (!jwt) return;

	//     return browser.storage.local.remove(this.JWT_STORAGE_KEY);
	// }
}
