/**
 * Observe yt theater mode changing
 */

import waitForElement from "@shared/lib/waitForElement";
import log from "@shared/lib/log";

const balancer = (() => {
    let lastState: boolean | null = null;

    return (hasChildren: boolean) => {
        if (lastState !== hasChildren) {
            lastState = hasChildren;
            if (hasChildren) {
                log("Theater mode is inactive");
            } else {
                log("Theater mode is active");
            }
        }
    };
})();

const addTheaterListeners = () => {
    waitForElement("#player-container-inner")
        .then(elem => {
            const observer = new MutationObserver(mutations => {
                mutations.forEach(mutation => {
                    if (mutation.type === "childList") {
                        const childCount = elem!.children.length;
                        balancer(childCount > 0);
                    }
                });
            });

            observer.observe(elem!, { childList: true, subtree: true });
        })
        .catch(error => log("Theater mode error", error));
};

export default addTheaterListeners;
