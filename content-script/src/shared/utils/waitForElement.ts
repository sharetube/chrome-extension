import debug from "@shared/lib/debug";
/**
 * Waits for an element to appear in the DOM.
 * @param selector - The CSS selector of the element to wait for.
 * @param timeout - The maximum time to wait in milliseconds (default is 10000ms).
 * @param retries - The number of times to retry before giving up (default is 3).
 * @returns A promise that resolves with the element if found, or null if not found within the timeout.
 */

const waitForElement = (
    selector: string,
    timeout = 10000,
    retries = 3
): Promise<Element | null> =>
    new Promise(resolve => {
        const attempt = (retryCount: number) => {
            const element = document.querySelector(selector);
            if (element) return resolve(element);

            const observer = new MutationObserver(() => {
                const element = document.querySelector(selector);
                if (element) {
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
                    debug.warn(`Retrying... (${retries - retryCount + 1})`);
                    attempt(retryCount - 1);
                } else {
                    debug.error(
                        `Element "${selector}" not found after ${timeout}ms`
                    );
                    resolve(null);
                }
            }, timeout);
        };

        attempt(retries);
    });

export default waitForElement;
