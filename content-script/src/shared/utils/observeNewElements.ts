import addOverlayChildToElement from "./addOverlayChildToElement";

/**
 * Observes the DOM for new elements matching the given selectors and applies an overlay to them.
 *
 * @param {Array<{ selector: string, overlayClass: string, zIndex: number }>} selectors - An array of objects containing selector, overlayClass, and zIndex.
 */
const observeNewElements = (
    selectors: { selector: string; overlayClass: string; zIndex: number }[],
): void => {
    const observer = new MutationObserver((mutations: MutationRecord[]) => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === 1) {
                    selectors.forEach(({ selector, overlayClass, zIndex }) => {
                        if ((node as Element).matches(selector)) {
                            addOverlayChildToElement(
                                node as HTMLElement,
                                overlayClass,
                                zIndex,
                            );
                        }
                    });
                }
            });
        });
    });

    observer.observe(document.documentElement, {
        childList: true,
        subtree: true,
    });
};

export default observeNewElements;
