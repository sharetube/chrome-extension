// // Types
// import player from "@player/types/old/player";
// import log from "@shared/lib/log";

// import getState from "./getState";

// // TODO: Create API method and remove this function
// const sendState = (player: player): void => {
//     const state = getState(player);
//     log(state);
// };

// /**
//  * Adds event listeners to the video player.
//  */
// const addEvents = (player: player): void => {
//     const events = ["play", "pause"];
//     events.forEach(event => {
//         player.addEventListener(event, () => {
//             sendState(player);
//         });
//     });

//     // Change the speed of the video
//     player.addEventListener("ratechange", () => {
//         if (!player.played) {
//             sendState(player);
//         }
//     });

//     // Mute and unmute the video
//     let isMute: boolean | null = null;
//     player.addEventListener("volumechange", () => {
//         if (player.muted && !isMute) {
//             log("Muted"); // TODO: Create API method and remove this console.log
//             isMute = true;
//         }
//         if (isMute !== false && !player.muted) {
//             log("Unmuted"); // TODO: Create API method and remove this console.log
//             isMute = false;
//         }
//     });
// };

// export default addEvents;
