// // Create a connection to the background script
// const worker = chrome.runtime.connect();

// const invitedRoomId = new URLSearchParams(window.location.search).get(
//     "room-id"
// );

// if (invitedRoomId) {
//     worker.postMessage({
//         type: "joinRoom",
//         data: { roomId: invitedRoomId },
//     });
// }

// //! FIX THIS ARTEM's SHIT
// Promise.all([
//     createElement(
//         "#secondary-inner",
//         "/src/templates/playlist.html",
//         ".st-playlist"
//     )
//     createElement(".st-playlist", "/src/templates/popup.html", ".st-popup"),
// ]).then(() => {
//     const createRoomButton = document.querySelector(
//         "#st-create-room__button"
//     );
//     createRoomButton.addEventListener("click", () => {
//         worker.postMessage({ type: "createRoom" });
//     });

//     const copyLinkButton = document.querySelector("#st-copy-link__button");
//     copyLinkButton.addEventListener("click", () => {
//         navigator.clipboard.writeText(
//             `https://www.youtube.com/?room-id=${copyLinkButton.dataset.roomId}`
//         );
//     });

//     worker.onMessage.addListener(msg => {
//         switch (msg.type) {
//             case "init":
//                 copyLinkButton.dataset.roomId = msg.data.id;
//                 copyLinkButton.style.display = "block";
//                 break;
//         }
//     });
// });
