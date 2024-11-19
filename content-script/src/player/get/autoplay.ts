import log from "@shared/lib/log";

declare var window: any;

const getAutoplay = (): boolean => {
    log("Autoplay is:", window.yt.player.utils.videoElement_.autoplay);
    return window.yt.player.utils.videoElement_.autoplay;
};

export default getAutoplay;
