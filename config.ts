type Config = {
    debug: boolean;
    api: {
        baseUrl: string;
    };
};

const config: Config = {
    debug: true,
    api: {
        baseUrl: "localhost",
    },
};

export default config;
