/**
 * Handle debug log
 */
import config from "config";

const log = (...args: any[]): void => {
    config.debug && console.log(...args);
};

export default log;
