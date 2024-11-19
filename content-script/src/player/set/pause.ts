import log from "@shared/lib/log";

const pause = (player: HTMLVideoElement) => {
    player.pause();
    log("Player paused");
};

export default pause;
