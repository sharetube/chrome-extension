let targetPrimaryTabId: number | null = null;

export function takeTargetPrimaryTabId(): number | null {
    const targetPrimaryTabIdBuf = targetPrimaryTabId;
    targetPrimaryTabId = null;
    return targetPrimaryTabIdBuf;
}

export function setTargetPrimaryTabId(tabId: number) {
    targetPrimaryTabId = tabId;
}
