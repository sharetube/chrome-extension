window.addEventListener("message", event => {
    const { type } = event.data;
    if (type == "GET_CONTEXT_MENU_VIDEO") {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const videoUrl = (document.body.querySelector("ytd-menu-popup-renderer") as any).data;
        event.source?.postMessage(
            {
                type: "CONTEXT_MENU_VIDEO",
                payload: {
                    videoUrl:
                        videoUrl.items[2].menuServiceItemRenderer.serviceEndpoint
                            .addToPlaylistServiceEndpoint.videoId || null,
                },
            },
            {
                targetOrigin: event.origin,
            },
        );
    }
});
