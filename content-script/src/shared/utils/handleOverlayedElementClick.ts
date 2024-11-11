/**
 * Handles click events on elements with the specified overlay class.
 * @param {MouseEvent} e - The click event.
 * @param {string} overlayClass - The class name of the overlay.
 */
const handleElementClick = (e: MouseEvent, overlayClass: string): void => {
    const target = e.target as HTMLElement;
    if (target.classList.contains(overlayClass)) {
        const link =
            target.parentElement?.querySelector<HTMLAnchorElement>("a");
        if (link) {
            const href = link.getAttribute("href");
            if (href) {
                window.open(href, "_blank");
            }
        }
    }
};

export default handleElementClick;
