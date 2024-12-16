import manifest from "./manifest.json";
import { crx } from "@crxjs/vite-plugin";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
    plugins: [react(), crx({ manifest }), tsconfigPaths()],
    resolve: {
        alias: {
            "@app": "/content-script/app/",
            "@shared": "/content-script/shared",
            "@widgets": "/content-script/widgets",
            "@entities": "/content-script/entities",
            "@tabs": "/content-script/tabs",
            "@player": "/content-script/player",
            constants: "/constants",
            types: "/types",
        },
    },
    assetsInclude: ["**/*.png"],
    build: {
        terserOptions: {
            format: {
                comments: false,
            },
        },
    },
});
