let targetPrimaryTabId: number | null = null;

export function getTargetPrimaryTabId(): number | null {
	return targetPrimaryTabId;
}

export function setTargetPrimaryTabId(tabId: number) {
	targetPrimaryTabId = tabId;
}
