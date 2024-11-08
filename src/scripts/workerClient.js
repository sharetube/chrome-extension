const worker = chrome.runtime.connect({ name: "ws-connection" });
function createRoom() {
    console.log("Creating room");
    worker.postMessage({ type: "createRoom" });
}

function addVideo(data) {
    console.log("Adding video:", data);
    worker.postMessage({ type: "addVideo", data });
}
