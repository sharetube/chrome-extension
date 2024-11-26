import "@app/styles/global.css";
import AllTab from "@tabs/All";
import PrimaryTab from "@tabs/Primary";
import React from "react";

PrimaryTab();
AllTab();

// window.addEventListener(
//     "keydown",
//     function (event) {
//         switch (event.key) {
//             case "ArrowUp":
//             case "ArrowDown":
//             case "ArrowLeft":
//             case "ArrowRight":
//             // Focus adding video input
//             case "/":
//             // Player mode
//             case "i":
//             case "f":
//             case "t":
//             // Mute
//             case "m":
//             // Play functional
//             case "k":
//             case "Spacebar":
//             case " ":
//             // Subtitles
//             case "c":
//                 // Comment
//                 null;
//                 break;
//             default:
//                 event.stopImmediatePropagation();
//         }
//     },
//     true,
// );
