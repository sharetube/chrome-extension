// eslint-disable-next-line @typescript-eslint/no-explicit-any
type logObject = Omit<{ [key: string]: any }, "timestamp" | "message">;

export type { logObject };
