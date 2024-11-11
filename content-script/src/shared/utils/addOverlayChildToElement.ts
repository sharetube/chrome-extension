/**
 *
 * @param element Parent element to add the overlay to
 * @param overlayClass Overlay class name
 * @param zIndex Overlay element z-index (default: 2100)
 */
const addOverlayChildToElement = (
    element: HTMLElement,
    overlayClass: string,
    zIndex = 2100,
) => {
    if (!element.querySelector(overlayClass)) {
        const overlay = document.createElement("div");
        overlay.className = overlayClass;
        overlay.style.position = "absolute";
        overlay.style.top = "0";
        overlay.style.right = "0";
        overlay.style.bottom = "0";
        overlay.style.left = "0";
        overlay.style.zIndex = zIndex.toString();
        overlay.style.cursor = "pointer";
        overlay.style.backgroundColor = "red";
        element.style.position = "relative";
        element.prepend(overlay);
    }
};

export default addOverlayChildToElement;
