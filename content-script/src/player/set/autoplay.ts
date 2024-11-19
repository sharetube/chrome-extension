import log from "@shared/lib/log";

declare var yt: any;

const setAutoplay = (value: boolean): void => {
    yt.player.utils.videoElement_.autoplay = value;
    log("Autoplay set to:", value);
};

export default setAutoplay;
