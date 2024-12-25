import manifest from "./manifest.json";
import { crx } from "@crxjs/vite-plugin";
import react from "@vitejs/plugin-react";
import fs from "fs";
import { resolve } from "path";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

function modifyManifest() {
    return {
        name: "modify-manifest",
        closeBundle() {
            const manifestPath = resolve(__dirname, "dist", "manifest.json");
            const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));

            const newObject = {
                js: ["assets/setVideo.js"],
                matches: ["https://*.youtube.com/*"],
                run_at: "document_start",
                world: "MAIN",
            };

            manifest.content_scripts.push(newObject);

            fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
        },
    };
}

export default defineConfig({
    plugins: [react(), crx({ manifest }), tsconfigPaths(), modifyManifest()],
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
            config: "config.ts",
        },
    },
    assetsInclude: ["**/*.png"],
    build: {
        rollupOptions: {
            input: {
                custom: resolve(__dirname, "scripts/setVideo.ts"),
            },
            output: {
                entryFileNames: "assets/setVideo.js",
            },
        },
        outDir: "dist",
    },
});
