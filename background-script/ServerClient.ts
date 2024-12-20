import config from "config";
import type { profile } from "types/profile";
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

const buildQueryParams = (params: Record<string, any>): string =>
    Object.entries(params)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join("&");

class ServerClient {
    private static instance: ServerClient;
    private _ws: WebSocket | null;
    private _handlers: Map<FromServerMessageType, MessageHandler<any>>;

    private constructor() {
        this._handlers = new Map();
        this._ws = null;
    }

    public static getInstance(): ServerClient {
        return (ServerClient.instance ??= new ServerClient());
    }

    // https://developer.chrome.com/docs/extensions/how-to/web-platform/websockets
    private keepAlive() {
        const keepAliveIntervalId = setInterval(() => {
            if (this._ws) {
                this.send(ToServerMessageType.ALIVE, null);
            } else {
                clearInterval(keepAliveIntervalId);
            }
        }, 20 * 1000);
    }

    private init(url: string) {
        this._ws = new WebSocket(`wss://${url}`);
        if (
            this._ws.readyState !== WebSocket.OPEN &&
            this._ws.readyState !== WebSocket.CONNECTING
        ) {
            if (
                this._ws.readyState !== WebSocket.CLOSED &&
                this._ws.readyState !== WebSocket.CLOSING
            )
                this._ws.close();
            this._ws = null;
            return;
        }
        this._ws.onerror = event => {
            console.log("WebSocket error:", event);
        };
        this._ws.onclose = event => {
            console.log("WebSocket closed:", event);
        };
        this._ws.onopen = () => {
            console.log("Open");
            this.keepAlive();
            if (this._ws) {
                this._ws.onmessage = ({ data }) => {
                    const { type, payload } = JSON.parse(data);
                    console.log("WebSocket onmessage", { type, payload });
                    this._handlers.get(type)?.(payload);
                };
            }
        };
    }

    private buildParams({ username, color, avatar_url }: profile, extraParams: object = {}) {
        return {
            username,
            color,
            ...(avatar_url && { "avatar-url": avatar_url }),
            ...extraParams,
        };
    }

    public create(profile: profile, videoUrl: string) {
        const params = this.buildParams(profile, { "video-url": videoUrl });
        this.init(`${baseUrl}/api/v1/room/create/ws?${buildQueryParams(params)}`);
    }

    public join(profile: profile, room_id: string) {
        const params = this.buildParams(profile);
        this.init(`${baseUrl}/api/v1/room/${room_id}/join/ws?${buildQueryParams(params)}`);
    }

    public send<T extends ToServerMessageType>(type: T, payload: ToServerMessagePayloadMap[T]) {
        console.log(this._ws, "send");
        const message = JSON.stringify({ type, payload });
        this._ws?.send(message);
        console.log(message);
    }

    public close() {
        if (this._ws) this._ws.close();
    }

    public addHandler<T extends FromServerMessageType>(type: T, handler: MessageHandler<T>): void {
        this._handlers.set(type, handler);
    }
}

export default ServerClient;
