const updateVideoUrl = (videoUrl: string) => {
    const r = document.body.querySelector("ytd-compact-video-renderer");
    if (r) {
        const t = r.querySelector("ytd-thumbnail");
        if (t) {
            const a = t.querySelector("a");
            if (a) {
                a.data.watchEndpoint.videoId = videoUrl;
                a.data.commandMetadata.webCommandMetadata.url = `/watch?v=${videoUrl}`;
                a.click();
            }
        }
    }
};

window.addEventListener("message", event => {
    console.log("EVENT CATCH WINDOW");
    const { type, payload } = event.data;
    // todo: add to constants
    if (type === "SKIP") {
        console.log("SKIP");
        updateVideoUrl(payload);
    }
});
