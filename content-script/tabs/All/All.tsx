import { AdminProvider } from "@shared/Context/Admin/Admin";
import waitForElement from "@shared/lib/waitForElement";
import ContextItem from "@widgets/ContextItem/ContextItem";
import Popup from "@widgets/Popup/Popup";
import React from "react";
import { createRoot } from "react-dom/client";

// Render popup
waitForElement("#end")
	.then((elem) => {
		const popupContainer = document.createElement("div");
		popupContainer.id = "st-popup-container";
		popupContainer.className = "sharetube";

		createRoot(popupContainer).render(<Popup />);
		elem.prepend(popupContainer);
	})
	.catch((error) => console.error("ST: Failed to render popup", error));

// Context item renderer
const contextMenuContainer = document.createElement("div");
contextMenuContainer.id = "st-context-menu";
contextMenuContainer.className = "sharetube";
contextMenuContainer.style.minWidth = "149px";

let listbox: Element | undefined;
let ignoreNextChange = false;

function removeRender() {
	if (listbox?.firstElementChild?.id !== "st-context-menu") return;

	const contextMenu = document.querySelector(
		"tp-yt-paper-listbox #st-context-menu",
	);

	ignoreNextChange = true;
	contextMenu?.parentElement?.removeChild(contextMenu);
}

function closeContextMenu() {
	document.body.click();
}

function renderContextMenu() {
	if (listbox?.firstElementChild?.id === "st-context-menu") return;

	createRoot(contextMenuContainer).render(
		<AdminProvider>
			<ContextItem removeFn={removeRender} closeFn={closeContextMenu} />
		</AdminProvider>,
	);

	listbox?.prepend(contextMenuContainer);
}

function initListBoxListener() {
	if (!listbox) return;

	const observer = new MutationObserver((mutations) => {
		if (ignoreNextChange) {
			ignoreNextChange = false;
			return;
		}

		for (const mutation of mutations) {
			if (mutation.type === "childList") {
				renderContextMenu();
			}
			break;
		}
	});

	observer.observe(listbox, {
		childList: true,
		subtree: false,
	});
}

waitForElement("ytd-popup-container").then((elem) => {
	const observer = new MutationObserver((mutations) => {
		for (const mutation of mutations) {
			if (mutation.type === "childList") {
				listbox = document.querySelector("tp-yt-paper-listbox") || undefined;
				initListBoxListener();
				observer.disconnect();

				break;
			}
		}
	});

	observer.observe(elem, {
		childList: true,
		subtree: false,
	});
});
