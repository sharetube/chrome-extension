import { ContentScriptMessagingClient } from "@shared/client/client";
import waitForElement from "@shared/lib/waitForElement";
import ContextItem from "@widgets/ContextItem/ContextItem";
import Popup from "@widgets/Popup/Popup";
import ReactDOM from "react-dom";
import { ExtensionMessageType } from "types/extensionMessage";

// Render popup
waitForElement("#end")
    .then(elem => {
        const container = document.createElement("div");
        container.id = "st-popup-container";
        elem.prepend(container);
        ReactDOM.render(<Popup />, container);
    })
    .catch(error => console.error("ST: Failed to render popup", error));

// Modify context menus
const container = document.createElement("div");
container.id = "st-context-menu";
container.style.minWidth = "149px";

ReactDOM.render(<ContextItem />, container);

window.addEventListener("message", event => {
    const { type } = event.data;
    // todo: add to constants
    if (type === "CONTEXT") {
        const dropdown = Array.from(document.body.querySelectorAll("tp-yt-iron-dropdown")).find(
            d => !d.id,
        );

        const listboxElem = dropdown?.querySelector("tp-yt-paper-listbox");
        listboxElem!.prepend(container);
    }
});

const contentScriptMessageClient = new ContentScriptMessagingClient();
contentScriptMessageClient.addHandler(ExtensionMessageType.GO_TO_VIDEO, (videoId: string) => {
    window.postMessage({ type: "SKIP", payload: videoId }, "*");
});
