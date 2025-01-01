import config from "config";
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

            console.log("ws connecting to ", url);
            this._ws = new WebSocket(url);

            this._ws.addEventListener("error", event => {
                this._ws?.close();
                console.log("WS ERROR", event);
                reject(new Error("ws error"));
            });

            this._ws.addEventListener("close", event => {
                this.clearKeepAlive();
                console.log("WS CLOSED", event);
                reject(new Error("ws closed"));
            });

            this._ws?.addEventListener("open", () => {
                this.keepAlive();
                this._ws?.addEventListener("message", ({ data }) => {
                    try {
                        const { type, payload } = JSON.parse(data);
                        console.log(`FROM WS: type: ${type}, payload:`, payload);
                        this._handlers.get(type)?.(payload);
                    } catch (error) {
                        console.error("WS ERROR: Parsing message:", error);
                    }
                });

                console.log("ws connected");
                resolve();
            });
        });
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
        const params = this.buildParams(profile);
        console.log("ws joining room with params:", params);
        return this.init(
            `wss://${baseUrl}/api/v1/ws/room/${room_id}/join?${buildQueryParams(params)}`,
        );
    }

    public send<T extends ToServerMessageType>(type: T, payload: ToServerMessagePayloadMap[T]) {
        if (!this._ws || this._ws.readyState !== WebSocket.OPEN) return;
        const message = JSON.stringify({ type, payload });
        this._ws?.send(message);
        console.log("TO WS:", { type, payload });
    }

    public close() {
        this._ws?.close();
    }

    public addHandler<T extends FromServerMessageType>(type: T, handler: MessageHandler<T>): void {
        this._handlers.set(type, handler);
    }
}

export default ServerClient;
