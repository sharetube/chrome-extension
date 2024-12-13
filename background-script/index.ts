const regex = /^https:\/\/youtu\.be\/st\/([a-zA-Z0-9.-]+)\/([a-zA-Z0-9]{8})$/;
console.log(regex.test('https://youtu.be/st/dedkov.space/asdFF12s'));

function handleTab(tabId: number, url: string) {
    console.log('handle');
    console.log(url);
    console.log(regex.test(url));
    if (regex.test(url)) {
        console.log(tabId);
        chrome.tabs.remove(tabId, () => {
            chrome.tabs.create({url: 'https://example.com'});
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
