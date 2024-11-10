type DebugMethods = {
    log: (...args: any[]) => void;
    warn: (...args: any[]) => void;
    error: (...args: any[]) => void;
};

const debug: { state: boolean | null } & DebugMethods = {
    state: null,
    log: (...args: any[]) => debug.state && console.log(...args),
    warn: (...args: any[]) => debug.state && console.warn(...args),
    error: (...args: any[]) => debug.state && console.error(...args),
};

export default debug;
