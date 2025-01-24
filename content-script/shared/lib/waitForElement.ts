const waitForElement = (
	selector: string,
	parent = document.documentElement,
	timeout = 200,
	retries = 50,
): Promise<HTMLElement> =>
	new Promise((resolve, reject) => {
		const attempt = (retryCount: number) => {
			const element = parent.querySelector(selector);
			if (element instanceof HTMLElement) return resolve(element);

			const observer = new MutationObserver(() => {
				const element = parent.querySelector(selector);
				if (element instanceof HTMLElement) {
					clearTimeout(timeoutId);
					observer.disconnect();
					resolve(element);
				}
			});

			observer.observe(parent, {
				childList: true,
				subtree: true,
			});

			const timeoutId = setTimeout(() => {
				observer.disconnect();
				if (retryCount > 0) {
					attempt(retryCount - 1);
				} else {
					reject(`Failed to find element with selector: ${selector}`);
				}
			}, timeout);
		};

		attempt(retries);
	});

export default waitForElement;
