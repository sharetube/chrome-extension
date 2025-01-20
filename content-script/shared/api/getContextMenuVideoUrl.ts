export const getContextMenuVideoUrl = (): Promise<string> => {
    return new Promise((resolve, reject) => {
        const eventListener = (event: MessageEvent) => {
            const { type, payload } = event.data;
            if (type === "CONTEXT_MENU_VIDEO") {
                window.removeEventListener("message", eventListener);
                if (payload.videoUrl) {
                    resolve(payload.videoUrl);
                } else {
                    reject("videoUrl is empty");
                }
            }
        };

        window.addEventListener("message", eventListener);
        window.postMessage({ type: "GET_CONTEXT_MENU_VIDEO" }, "*");
    });
};
