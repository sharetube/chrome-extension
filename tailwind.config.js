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
                "background-primary": "var(--st-background-primary)",
                "background-secondary": "var(--st-background-secondary)",
                "text-primary": "var(--st-text-primary)",
                "text-secondary": "var(--st-text-secondary)",
                "spec-outline": "var(--st-spec-outline)",
                "spec-badge-chip-background":
                    "var(--st-spec-badge-chip-background)",
                "icon-shape-color": "var(--st-icon-shape-color)",
            },
            fontFamily: {
                primary: "var(--st-font-primary)",
                secondary: "var(--st-font-secondary)",
            },
        },
    },
    plugins: [],
};
