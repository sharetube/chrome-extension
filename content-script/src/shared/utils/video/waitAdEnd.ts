/**
 * Wait for the ad to end and the element to be added to the DOM
 */
const waitAdEnd = (): Promise<void> =>
    new Promise(resolve => {
        const checkAdAndElement = () => {
            const adEnded = !document.querySelector(".ad-showing");
            const elementAdded = document.querySelector(
                "video.video-stream.html5-main-video",
            );

            if (adEnded && elementAdded) {
                resolve();
            } else {
                requestAnimationFrame(checkAdAndElement);
            }
        };
        checkAdAndElement();
    });

export default waitAdEnd;
