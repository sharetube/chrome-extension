module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        "./content-script/src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            animation: {
                "spin-slow": "spin 20s linear infinite",
            },
            colors: {
                primary: "red",
                "playlist-header-background":
                    "var(--st-playlist-header-background)",
            },
        },
    },
    plugins: [],
};
