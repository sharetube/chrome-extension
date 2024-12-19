import config from "config";
import type { profile } from "types/profile";
import {
    FromServerMessagePayloadMap,
    FromServerMessageType,
    ToServerMessagePayloadMap,
    ToServerMessageType,
} from "types/serverMessage";

const { baseUrl } = config.api;

const buildQueryParams = (params: Record<string, any>): string =>
    Object.entries(params)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join("&");

type MessageHandler<T extends FromServerMessageType> = (
    payload: FromServerMessagePayloadMap[T],
) => void;

class ServerClient {
    private static instance: ServerClient;
    private _ws: WebSocket | null = null;
    private _handlers: Map<FromServerMessageType, MessageHandler<any>> = new Map();

    private constructor() {}

    public static getInstance(): ServerClient {
        return (ServerClient.instance ??= new ServerClient());
    }

    public create(profile: profile, videoUrl: string) {
        const params = {
            username: profile.username,
            color: profile.color,
            "video-url": videoUrl,
            ...(profile.avatar_url && { "avatar-url": profile.avatar_url }),
        };

        const url = `${baseUrl}/api/v1/room/create/ws?${buildQueryParams(params)}`;

        this.init(url);
    }

    public join(profile: profile, room_id: string) {
        const params = {
            username: profile.username,
            color: profile.color,
            ...(profile.avatar_url && { "avatar-url": profile.avatar_url }),
        };

        const url = `${baseUrl}/api/v1/room/${room_id}/join/ws?${buildQueryParams(params)}`;

        this.init(url);
    }

    public send<T extends ToServerMessageType>(type: T, payload: ToServerMessagePayloadMap[T]) {
        this._ws && this._ws.send(JSON.stringify({ type: type, payload: payload }));
        console.log(JSON.stringify(payload));
    }

    // https://developer.chrome.com/docs/extensions/how-to/web-platform/websockets
    private keepAlive() {
        const keepAliveIntervalId = setInterval(() => {
            const ws = this._ws;
            if (ws) {
                this.send(ToServerMessageType.ALIVE, null);
            } else {
                clearInterval(keepAliveIntervalId);
            }
        }, 20 * 1000);
    }

    public close() {
        this._ws?.close();
    }

    private init(url: string) {
        this._ws = new WebSocket(`wss://${url}`);
        this.keepAlive();
        this._ws.onmessage = (message: any) => {
            const data = JSON.parse(message.data);
            console.log("onmessage", data);
            const handler = this._handlers.get(data.type);
            handler && handler(data.payload);
        };
        this._ws.onerror = (err: any) => {
            console.log(err);
        };
        this._ws.onclose = (err: any) => {
            console.log(err);
        };
    }

    public addHandler<T extends FromServerMessageType>(type: T, handler: MessageHandler<T>): void {
        this._handlers.set(type, handler);
    }
}

export default ServerClient;
