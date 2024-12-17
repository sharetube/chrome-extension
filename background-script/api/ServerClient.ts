abstract class ServerClientBase {
    protected _socket: WebSocket;

    constructor(url: string) {
        this._socket = new WebSocket(url);
    }
}

class ServerClient extends ServerClientBase {
    private static instance: ServerClient;

    private constructor(url: string) {
        super(url);
    }

    public static getInstance(url: string): ServerClient {
        if (!ServerClient.instance) {
            ServerClient.instance = new ServerClient(url);
        }
        return ServerClient.instance;
    }
}

export default ServerClient;
