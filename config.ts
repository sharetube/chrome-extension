type Config = {
    debug: boolean;
    api: {
        baseUrl: string;
    };
};

const config: Config = {
    debug: true,
    api: {
        baseUrl: "ebc8-62-60-236-208.ngrok-free.app",
    },
};

export default config;
