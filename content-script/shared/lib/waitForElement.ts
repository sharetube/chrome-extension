const waitForElement = (
    selector: string,
    timeout = 10000,
    retries = 3,
): Promise<HTMLElement | null> =>
    new Promise(resolve => {
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
                    console.log("Retrying...", retryCount);
                    attempt(retryCount - 1);
                } else {
                    resolve(null);
                }
            }, timeout);
        };

        attempt(retries);
    });

export default waitForElement;
