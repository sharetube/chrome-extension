// Types
import state from "@shared/types/video/state";
import player from "@shared/types/video/player";

/**
 * Returns the current state of the video player.
 */
const getState = (player: player): state => ({
    isPlayed: !player.paused,
    time: player.currentTime,
    speed: player.playbackRate,
});

export default getState;
