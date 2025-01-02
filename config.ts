type Config = {
    debug: boolean;
    api: {
        baseUrl: string;
    };
};

const config: Config = {
    debug: true,
    api: {
        // baseUrl: "localhost",
        baseUrl: "go-game-api.online",
    },
};

export default config;
