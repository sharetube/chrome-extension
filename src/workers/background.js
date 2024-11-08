let ws = null;
let primaryTab = null;
let secondTabs = new Set();
let debugState = false;

let color = "FFF";
let username = Math.random().toString(36).substring(2, 15);
console.log(username);

function initWsEvents() {
    ws.onmessage = event => {
        let msg = JSON.parse(event.data);
        console.log("Recieved message:", msg);
        switch (msg.type) {
            case "init":
                primaryTab.postMessage({
                    type: "init",
                    data: msg.data,
                });
                break;
            case "update":
                // primaryTab.postMessage({
                //     type: "wsMessage",
                //     data: msg,
                // });
                break;
            default:
                break;
        }
        // primaryTab.postMessage({
        //     type: "wsMessage",
        //     data: ,
        // });
    };

    // ws.onopen = () => {
    //     connections.forEach(port => {
    //         port.postMessage({ type: "wsConnected" });
    //     });
    // };

    ws.onclose = () => {
        secondTabs.forEach(port => {
            port.postMessage({ type: "wsDisconnected" });
        });
        ws = null;
    };
}

// handle new tab created.
chrome.runtime.onConnect.addListener(tab => {
    if (primaryTab) {
        secondTabs.add(tab);
    } else {
        primaryTab = tab;
    }

    tab.onMessage.addListener(msg => {
        switch (msg.type) {
            case "createRoom":
                if (!ws || ws.readyState === WebSocket.CLOSED) {
                    ws = new WebSocket(
                        `ws://localhost:8080/ws?username=${username}&color=FFF`
                    );
                    initWsEvents();
                }
                break;
            case "joinRoom":
                if (!ws || ws.readyState === WebSocket.CLOSED) {
                    console.log("Joining room:", msg.data);
                    ws = new WebSocket(
                        `ws://localhost:8080/ws/${msg.data.roomId}?username=${username}&color=${color}`
                    );
                    initWsEvents();
                }
                break;
            case "disconnect":
                if (ws) {
                    ws.close();
                    ws = null;
                }
                break;
            case "addVideo":
                if (ws && ws.readyState === WebSocket.OPEN) {
                    ws.send(
                        JSON.stringify({ action: "add_video", data: msg.data })
                    );
                }
                break;
            case "toggleDebugMode":
                debugState = !debugState;
                tab.postMessage({
                    type: "debugModeChanged",
                    data: debugState,
                });
        }
    });

    tab.onDisconnect.addListener(() => {
        if (secondTabs.size === 0) {
            ws.close();
            ws = null;
        } else {
            secondTabs.delete(tab);
        }
    });
});
