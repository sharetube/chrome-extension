type TabId = number;

const setPrimaryTab = (tabId: TabId) => {
    chrome.storage.local.set({'st-primary-tab': tabId}, () => {
        notifyTabsPrimaryTabSet();
    });
};

const getPrimaryTab = (): Promise<TabId> => {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get('st-primary-tab', result => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
            } else {
                resolve(result['st-primary-tab']);
            }
        });
    });
};

const clearPrimaryTab = () => {
    chrome.storage.local.remove('st-primary-tab', () => {
        notifyTabsPrimaryTabUnset();
    });
};

const checkPrimaryTabExists = async (): Promise<boolean> => {
    try {
        const tabId = await getPrimaryTab();
        return tabId !== undefined;
    } catch (error) {
        return false;
    }
};

const tabsRequestingPrimaryTab: number[] = [];

const notifyTabsPrimaryTabSet = () => {
    tabsRequestingPrimaryTab.forEach(tabId => {
        chrome.tabs.sendMessage(tabId, {action: 'primaryTabSet'});
    });
};

const notifyTabsPrimaryTabUnset = () => {
    tabsRequestingPrimaryTab.forEach(tabId => {
        chrome.tabs.sendMessage(tabId, {action: 'primaryTabUnset'});
    });
};

// Join link regex
const regex = /^https:\/\/youtu\.be\/st\/([a-zA-Z0-9.-]{8})$/;

function handleTab(tabId: number, url: string) {
    if (regex.test(url)) {
        checkPrimaryTabExists()
            .then(exists => {
                if (exists) {
                    getPrimaryTab().then(primaryTabId => {
                        if (primaryTabId !== undefined) {
                            chrome.tabs.update(primaryTabId, {active: true});
                            chrome.tabs.onUpdated.addListener(
                                function listener(updatedTabId, changeInfo) {
                                    if (
                                        updatedTabId === tabId &&
                                        changeInfo.status === 'complete'
                                    ) {
                                        chrome.tabs.remove(tabId, () => {
                                            chrome.tabs.onUpdated.removeListener(listener);
                                        });
                                    }
                                },
                            );
                        }
                    });
                } else {
                    chrome.tabs.update(tabId, {url: `https://www.youtube.com/watch?v=2jNLSmbs8L0`});
                    setPrimaryTab(tabId);
                }
            })
            .catch(error => {
                console.error('Error checking primary tab existence:', error);
            });
    }
}

chrome.webNavigation.onBeforeNavigate.addListener(
    details => {
        if (details.url) {
            handleTab(details.tabId, details.url);
        }
    },
    {url: [{hostSuffix: 'youtu.be'}]},
);

function createTab(videoId: string) {
    chrome.tabs.create({url: `https://youtube.com/watch?v=${videoId}`}, tab => {
        if (tab.id) setPrimaryTab(tab.id);
        notifyTabsPrimaryTabSet();
    });
}

chrome.tabs.onRemoved.addListener(tabId => {
    getPrimaryTab().then(primaryTabId => {
        if (primaryTabId === tabId) {
            clearPrimaryTab();
        }
    });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'checkPrimaryTabExists') {
        if (sender.tab && sender.tab.id !== undefined) {
            tabsRequestingPrimaryTab.push(sender.tab.id);
        }
        checkPrimaryTabExists().then(exists => {
            sendResponse({exists});
        });
        return true;
    } else if (message.action === 'createNewTab') {
        const videoId = message.videoId;
        createTab(videoId);
        return true;
    } else if (message.action === 'moveToPrimaryTab') {
        getPrimaryTab().then(primaryTabId => {
            if (primaryTabId !== undefined) {
                chrome.tabs.update(primaryTabId, {active: true});
            }
        });
        return true;
    } else if (message.action === 'isPrimaryTab') {
        if (sender.tab) {
            getPrimaryTab().then(primaryTabId => {
                sendResponse({isPrimary: primaryTabId === sender!.tab!.id});
            });
        } else {
            sendResponse({isPrimary: false});
        }
        return true;
    }
});
