//? import somehow
const waitForElement = (selector: string, timeout = 2000, retries = 3): Promise<HTMLElement> =>
    new Promise((resolve, reject) => {
        const attempt = (retryCount: number) => {
            const element = document.querySelector(selector);
            if (element instanceof HTMLElement) return resolve(element);

            const observer = new MutationObserver(() => {
                const element = document.querySelector(selector);
                if (element instanceof HTMLElement) {
                    clearTimeout(timeoutId);
                    observer.disconnect();
                    resolve(element);
                }
            });

            observer.observe(document.documentElement, {
                childList: true,
                subtree: true,
            });

            const timeoutId = setTimeout(() => {
                observer.disconnect();
                if (retryCount > 0) {
                    console.log("Retrying...", retryCount, selector);
                    attempt(retryCount - 1);
                } else {
                    reject(`Failed to find element with selector: ${selector}`);
                }
            }, timeout);
        };

        attempt(retries);
    });

const waitForRestoreFocusNode = (element: Element, timeout: number = 5000) => {
    return new Promise((resolve, reject) => {
        let resolved = false;
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if (!resolved && (element as any).__restoreFocusNode) {
                    observer.disconnect();
                    resolved = true;
                    resolve((element as any).__restoreFocusNode);
                    return;
                }
            });
        });

        observer.observe(element, {
            attributes: true,
            childList: true,
            subtree: true,
        });

        setTimeout(() => {
            if (!resolved) {
                observer.disconnect();
                reject(new Error("ST: Timeout waiting for __restoreFocusNode"));
            }
        }, timeout);
    });
};

const add = async (element: Element) => {
    try {
        const restoreFocusNode = (await waitForRestoreFocusNode(element)) as HTMLElement;
        const cRID = restoreFocusNode.closest("ytd-compact-video-renderer") as any;
        const vRID = restoreFocusNode.closest("ytd-rich-item-renderer") as any;

        if (cRID) {
            console.log(cRID);
            window.postMessage({ type: "CONTEXT" }, "*");
        }

        if (vRID) {
            console.log(vRID);
            window.postMessage({ type: "CONTEXT" }, "*");
        }
    } catch (error) {
        console.log(error);
    }
};

const addClickEventListener = (element: HTMLElement) => {
    element.addEventListener("click", () => {
        add(element);
    });
};

waitForElement("ytd-popup-container")
    .then(elem => {
        const handlePopupMutation = (mutations: MutationRecord[], observer: MutationObserver) => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node instanceof HTMLElement && node.tagName === "TP-YT-IRON-DROPDOWN") {
                        const listboxElem = node.querySelector(
                            "tp-yt-paper-listbox",
                        ) as HTMLElement;

                        add(node);
                        observer.disconnect();

                        new MutationObserver(mutations => {
                            mutations.forEach(mutation => {
                                mutation.removedNodes.forEach(node => {
                                    if (
                                        node instanceof HTMLElement &&
                                        node.id === "st-context-menu"
                                    ) {
                                        add(node!);
                                    }
                                });
                            });
                        }).observe(listboxElem!, { childList: true });
                    }
                });
            });
        };

        new MutationObserver(handlePopupMutation).observe(elem, {
            childList: true,
            attributeFilter: ["style"],
        });
    })
    .catch(error => console.error("ST: Failed to select 'ytd-popup-container.ytd-app'", error));
