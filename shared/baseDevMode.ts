import { logObject } from "types/logObject.type";

abstract class BaseDevMode {
    protected static enabled: boolean = false;

    public static log(msg: string | null = null, obj: logObject): void {
        if (this.enabled) {
            console.log({ message: msg, timestamp: Date.now(), ...obj });
        }
    }
}

export default BaseDevMode;
