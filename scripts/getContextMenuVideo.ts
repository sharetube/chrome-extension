window.addEventListener("message", (event) => {
	const { type } = event.data;
	if (type === "GET_CONTEXT_MENU_VIDEO") {
		const items =
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			(document.body.querySelector("ytd-menu-popup-renderer") as any).data
				.items;
		let videoUrl = "";
		console.log(items);
		for (const item of items) {
			videoUrl =
				item.menuServiceItemRenderer?.serviceEndpoint?.signalServiceEndpoint
					?.actions[0]?.addToPlaylistCommand?.videoId;

			if (videoUrl || null) {
				console.log("videoUrl", videoUrl);
				break;
			}
		}

		event.source?.postMessage(
			{
				type: "CONTEXT_MENU_VIDEO",
				payload: { videoUrl },
			},
			{
				targetOrigin: event.origin,
			},
		);
	}
});
