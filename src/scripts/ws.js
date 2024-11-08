const port = chrome.runtime.connect({ name: "ws-connection" });

const state = {
    roomId: null,
    videos: [],
    videoId: null,
    members: [],
    creatorId: null,
};

port.onMessage.addListener(message => {
    switch (message.type) {
        case "wsConnected":
            break;

        case "wsDisconnected":
            break;

        case "wsMessage":
            console.log("Received message:", message.data);
            switch (message.data.type) {
                case "update":
                    state.roomId = message.data.data.id;
                    //   updateRoomId(state.roomId);
                    state.videos = message.data.data.videos;
                    //   updateVideoList(state.videos);
                    // state.videoId = message.data.data.videoId;
                    state.members = message.data.data.members;
                    state.creatorId = message.data.data.creator_id;
                    console.log("Updated state:", state);
                    break;
            }
            break;
    }
});

function joinRoom(roomId) {
    console.log("Joining room:", roomId);
    port.postMessage({
        type: "joinRoom",
        data: { roomId },
    });
}

function createRoom(data) {
    console.log("Creating room:", data);
    port.postMessage({ type: "createRoom" });
}

function addVideo(data) {
    console.log("Adding video:", data);
    port.postMessage({ type: "addVideo", data });
}
