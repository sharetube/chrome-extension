function setAvatar(avatar: string) {
    chrome.storage.sync.set({ avatar });
}
