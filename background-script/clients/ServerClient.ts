import { globalState } from "background-script/state";
import config from "config";
import { connectToWS } from "pkg/ws/ws";
import { ProfileType } from "types/profile.type";
import {
    FromServerMessagePayloadMap,
    FromServerMessageType,
    ToServerMessagePayloadMap,
    ToServerMessageType,
} from "types/serverMessage";

const { baseUrl } = config.api;

type MessageHandler<T extends FromServerMessageType> = (
    payload: FromServerMessagePayloadMap[T],
) => void;

const buildQueryParams = (params: Record<string, string>): string =>
    Object.entries(params)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join("&");

class ServerClient {
    private static instance: ServerClient;
    private ws: WebSocket | null;
    // todo: remove any
    private handlers: Map<FromServerMessageType, MessageHandler<any>>;
    private keepAliveTimeout: NodeJS.Timeout | null;
    private KEEP_ALIVE_INTERVAL: number = 25 * 1000;

    private constructor() {
        this.handlers = new Map();
        this.ws = null;
        this.keepAliveTimeout = null;
    }

    public static getInstance(): ServerClient {
        return (ServerClient.instance ??= new ServerClient());
    }

    private async init(url: string): Promise<void> {
        return new Promise((resolve, reject) => {
            if (this.ws) reject(new Error("ws already open"));

            connectToWS(url).then(ws => {
                this.ws = ws;
                this.addListeners();
                this.startKeepAlive();
                resolve();
            });
        });
    }

    private addListeners() {
        if (!this.ws) return;
        this.ws.onerror = event => {
            console.log("WS ERROR", event);
            this.close();
        };

        this.ws.onclose = event => {
            console.log("WS CLOSED", event);
            this.close();
        };

        this.ws.onmessage = ({ data }) => {
            this.startKeepAlive();
            try {
                const { type, payload } = JSON.parse(data);
                console.log(`FROM WS: type: ${type}, payload:`, payload);
                this.handlers.get(type)?.(payload);
            } catch (error) {
                console.error("WS ERROR: Parsing message:", error);
            }
        };
    }

    private removeListeners() {
        if (!this.ws) return;

        this.ws.onerror = null;
        this.ws.onclose = null;
        this.ws.onmessage = null;
    }

    private buildParams(profile: ProfileType, extraParams: object = {}) {
        return {
            username: profile.username,
            color: profile.color,
            ...(profile.avatar_url && { "avatar-url": profile.avatar_url }),
            ...extraParams,
        };
    }

    public createRoom(profile: ProfileType, videoUrl: string): Promise<void> {
        const params = this.buildParams(profile, { "video-url": videoUrl });
        console.log("ws creating room with params:", params);
        // todo: implement WSConnectionURLBuilder
        return this.init(`wss://${baseUrl}/api/v1/ws/room/create?${buildQueryParams(params)}`);
    }

    public joinRoom(profile: ProfileType, room_id: string): Promise<void> {
        const params = this.buildParams(profile, globalState.jwt ? { jwt: globalState.jwt } : {});
        console.log("ws joining room with params:", params);
        return this.init(
            `wss://${baseUrl}/api/v1/ws/room/${room_id}/join?${buildQueryParams(params)}`,
        );
    }

    public send<T extends ToServerMessageType>(type: T, payload?: ToServerMessagePayloadMap[T]) {
        if (!this.ws) return;
        const message = JSON.stringify({ type, payload });
        this.startKeepAlive();
        this.ws.send(message);
        console.log("TO WS:", { type, payload });
    }

    public close() {
        if (!this.ws) return;

        this.stopKeepAlive();
        this.removeListeners();
        this.ws.close();
        this.ws = null;
        console.log("WS CLOSED");
    }

    public addHandler<T extends FromServerMessageType>(type: T, handler: MessageHandler<T>): void {
        this.handlers.set(type, handler);
    }

    // https://developer.chrome.com/docs/extensions/how-to/web-platform/websockets
    private startKeepAlive() {
        this.stopKeepAlive();
        this.keepAliveTimeout = setTimeout(
            () => this.send(ToServerMessageType.ALIVE),
            this.KEEP_ALIVE_INTERVAL,
        );
    }

    private stopKeepAlive() {
        if (!this.keepAliveTimeout) return;
        clearTimeout(this.keepAliveTimeout);
        this.keepAliveTimeout = null;
    }
}

export default ServerClient;
