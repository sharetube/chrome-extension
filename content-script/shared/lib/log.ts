/**
 * Handle debug log
 */
const log = (...args: any[]): void => {
    import.meta.env.DEBUG && console.log(...args);
};

export default log;
