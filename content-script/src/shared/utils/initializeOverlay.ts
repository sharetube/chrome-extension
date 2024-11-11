import waitForElement from "./waitForElement";
import addOverlayChildToElements from "./addOverlayChildToElements";
import handleOverlayedElementClick from "./handleOverlayedElementClick";

/**
 * Initializes the overlay for elements matching the given selector.
 *
 * @param {string} selector - The CSS selector for the elements to which the overlay will be applied.
 * @param {string} overlayClass - The class name to be applied to the overlay.
 * @param {number} zIndex - The z-index value for the overlay.
 */
const initializeOverlay = (
    selector: string,
    overlayClass: string,
    zIndex: number,
): void => {
    waitForElement(selector).then(() => {
        addOverlayChildToElements(selector, overlayClass, zIndex);
        document.body.addEventListener("click", e =>
            handleOverlayedElementClick(e, overlayClass),
        );
    });
};

export default initializeOverlay;
