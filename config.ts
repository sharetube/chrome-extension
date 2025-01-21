type Config = {
    debug: boolean;
    api: {
        baseUrl: string;
    };
};

const config: Config = {
    debug: true,
    api: {
        // baseUrl: "go-game-api.online",
        baseUrl: "localhost",
    },
};

export default config;
