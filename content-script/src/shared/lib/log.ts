import debug from "@app/api/debug";
/**
 * Handle debug log
 */
const log = (...args: any[]): void => {
    if (debug) console.log(...args);
};

export default log;
