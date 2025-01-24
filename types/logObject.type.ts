// biome-ignore lint/suspicious/noExplicitAny: <explanation>
type logObject = Omit<{ [key: string]: any }, "timestamp" | "message">;

export type { logObject };
