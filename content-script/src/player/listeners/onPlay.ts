import pause from "@player/set/pause";
import log from "@shared/lib/log";
import player from "@shared/types/video/player";

const onPlay = (player: player): void => {
    player.addEventListener("play", () => {
        log("Video is playing");
        pause(player);
    });
};

export default onPlay;
