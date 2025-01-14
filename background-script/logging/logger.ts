import { DebugModeStorage } from "./debugModeStorage";
import Logger from "shared/logger";

export class BGLogger extends Logger {
    private static instance: BGLogger;

    constructor() {
        super();
        DebugModeStorage.getInstance()
            .get()
            .then(debugMode => {
                this.setEnabled(debugMode);
            });
    }

    public static getInstance(): BGLogger {
        return (BGLogger.instance ??= new BGLogger());
    }
}
