import addOverlayChildToElement from "./addOverlayChildToElement";

/**
 * Add overlay to all elements matching the selector
 * @param selector Selector to find elements
 * @param overlayClass Overlay class name
 * @param zIndex Overlay element z-index (default: 2100)
 */
const addOverlayToElements = (
    selector: string,
    overlayClass: string,
    zIndex: number,
): void => {
    document.querySelectorAll<HTMLElement>(selector).forEach(element => {
        addOverlayChildToElement(element, overlayClass, zIndex);
    });
};

export default addOverlayToElements;
