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
    private _keepAliveIntervalId: NodeJS.Timeout | null;

    private constructor() {
        this._handlers = new Map();
        this._ws = null;
        this._keepAliveIntervalId = null;
    }

    public static getInstance(): ServerClient {
        return (ServerClient.instance ??= new ServerClient());
    }

    // https://developer.chrome.com/docs/extensions/how-to/web-platform/websockets
    private keepAlive() {
        this._keepAliveIntervalId = setInterval(() => {
            if (this._ws) {
                this.send(ToServerMessageType.ALIVE, null);
            } else {
                this.clearKeepAlive();
            }
        }, 20 * 1000);
    }

    private clearKeepAlive() {
        if (this._keepAliveIntervalId) {
            clearInterval(this._keepAliveIntervalId);
            this._keepAliveIntervalId = null;
        }
    }

    private init(url: string): Promise<void> {
        return new Promise((resolve, reject) => {
            if (this._ws && this._ws.readyState === WebSocket.OPEN) {
                reject(new Error("ws already open"));
            }

            this._ws = new WebSocket(`wss://${url}`);

            this._ws.addEventListener("error", event => {
                this._ws?.close();
                reject(new Error("ws error"));
            });

            this._ws.addEventListener("close", event => {
                this.clearKeepAlive();
                reject(new Error("ws closed"));
            });

            this._ws?.addEventListener("open", () => {
                this.keepAlive();
                this._ws?.addEventListener("message", ({ data }) => {
                    try {
                        const { type, payload } = JSON.parse(data);
                        console.log("FROM WS:", { type, payload });
                        this._handlers.get(type)?.(payload);
                    } catch (error) {
                        console.error("WS ERROR: Parsing message:", error);
                    }
                });
                resolve();
            });
        });
    }

    private buildParams({ username, color, avatar_url }: profile, extraParams: object = {}) {
        return {
            username,
            color,
            ...(avatar_url && { "avatar-url": avatar_url }),
            ...extraParams,
        };
    }

    public create(profile: profile, videoUrl: string): Promise<void> {
        const params = this.buildParams(profile, { "video-url": videoUrl });
        return this.init(`${baseUrl}/api/v1/ws/room/create?${buildQueryParams(params)}`);
    }

    public join(profile: profile, room_id: string): Promise<void> {
        const params = this.buildParams(profile);
        return this.init(`${baseUrl}/api/v1/ws/room/${room_id}/join?${buildQueryParams(params)}`);
    }

    public send<T extends ToServerMessageType>(type: T, payload: ToServerMessagePayloadMap[T]) {
        const message = JSON.stringify({ type, payload });
        this._ws?.send(message);
        console.log("TO WS:", { type, payload });
    }

    public close() {
        if (this._ws) this._ws.close();
    }

    public addHandler<T extends FromServerMessageType>(type: T, handler: MessageHandler<T>): void {
        this._handlers.set(type, handler);
    }
}

export default ServerClient;