let ws = null;
let connections = new Set();

let color = "FFF";
let username = Math.random().toString(36).substring(2, 15);
console.log(username);

function initEvents(ws) {
    ws.onmessage = event => {
        console.log(event);
        connections.forEach(port => {
            port.postMessage({
                type: "wsMessage",
                data: JSON.parse(event.data),
            });
        });
    };

    ws.onopen = () => {
        connections.forEach(port => {
            port.postMessage({ type: "wsConnected" });
        });
    };

    ws.onclose = () => {
        connections.forEach(port => {
            port.postMessage({ type: "wsDisconnected" });
        });
        ws = null;
    };
}

chrome.runtime.onConnect.addListener(port => {
    connections.add(port);

    port.onMessage.addListener(msg => {
        switch (msg.type) {
            case "createRoom":
                if (!ws || ws.readyState === WebSocket.CLOSED) {
                    ws = new WebSocket(
                        `ws://localhost:8080/ws?username=${username}&color=FFF`
                    );
                    initEvents(ws);
                }
                break;
            case "joinRoom":
                if (!ws || ws.readyState === WebSocket.CLOSED) {
                    console.log("Joining room:", msg.data);
                    ws = new WebSocket(
                        `ws://localhost:8080/ws/${msg.data.roomId}?username=${username}&color=${color}`
                    );
                    initEvents(ws);
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

    port.onDisconnect.addListener(() => {
        connections.delete(port);
        if (connections.size === 0 && ws) {
            console.log("Disconnecting WebSocket");
            ws.close();
            ws = null;
        }
    });
});
