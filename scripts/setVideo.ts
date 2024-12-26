const skip = (videoId: string) => {
    const e = document.body.querySelector("ytd-compact-video-renderer");
    if (e) {
        const t = e.querySelector("ytd-thumbnail");
        if (t) {
            const a = t.querySelector("a");
            if (a) {
                console.log(a);
                console.log((a as any).data.watchEndpoint.videoId);
                (a as any).data.watchEndpoint.videoId = videoId;
                console.log((a as any).data.watchEndpoint.videoId);
                a.click();
            }
        }
    }
};

window.addEventListener("message", event => {
    console.log("EVENT CATCH WINDOW");
    const { type, data } = event.data;
    if (type === "SKIP") {
        console.log("SKIP");
        skip(data);
    }
});
