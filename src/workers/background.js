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

    tab.onMessage.addListener((msg, sender, sendResponse) => {
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
        }
    });

    tab.onDisconnect.addListener(() => {
        if (secondTabs.size === 0) {
            primaryTab = null;
            ws = null;
            ws.close();
        } else {
            secondTabs.delete(tab);
        }
    });
});

chrome.runtime.onMessage.addListener((msg, _, sendResponse) => {
    switch (msg.type) {
        case "getDebugMode":
            sendResponse(debugState);
            break;
        case "toggleDebugMode":
            debugState = !debugState;
            sendResponse(debugState);
            break;
        default:
            break;
    }
});
