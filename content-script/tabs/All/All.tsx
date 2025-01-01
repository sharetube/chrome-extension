import waitForElement from "@shared/lib/waitForElement";
import ContextItem from "@widgets/ContextItem/ContextItem";
import Popup from "@widgets/Popup/Popup";
import ReactDOM from "react-dom";

// Render popup
waitForElement("#end")
    .then(elem => {
        const container = document.createElement("div");
        elem?.prepend(container);
        ReactDOM.render(<Popup />, container);
    })
    .catch(error => console.error("ST: Failed to render popup", error));

// Modify context menus
waitForElement("ytd-popup-container")
    .then(elem => {
        const container = document.createElement("div");
        container.id = "st-context-menu";
        container.style.minWidth = "149px";

        ReactDOM.render(<ContextItem />, container);

        const handlePopupMutation = (mutations: MutationRecord[], observer: MutationObserver) => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node instanceof HTMLElement && node.tagName === "TP-YT-IRON-DROPDOWN") {
                        const listboxElem = node.querySelector("tp-yt-paper-listbox");

                        listboxElem!.prepend(container);
                        observer.disconnect();

                        new MutationObserver(mutations => {
                            mutations.forEach(mutation => {
                                mutation.removedNodes.forEach(node => {
                                    if (
                                        node instanceof HTMLElement &&
                                        node.id === "st-context-menu"
                                    ) {
                                        listboxElem?.prepend(container);
                                    }
                                });
                            });
                        }).observe(listboxElem!, { childList: true });
                    }
                });
            });
        };

        new MutationObserver(handlePopupMutation).observe(elem!, { childList: true });
    })
    .catch(error => console.error("ST: Failed to select 'ytd-popup-container.ytd-app'", error));
