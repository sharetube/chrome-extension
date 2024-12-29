import manifest from "./manifest.json";
import { crx } from "@crxjs/vite-plugin";
import react from "@vitejs/plugin-react";
import fs from "fs";
import { resolve } from "path";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

function manifestWorldMainFix(buildDir: string) {
    return {
        name: "manifest-world-main-fix",
        closeBundle() {
            const extPath = resolve(__dirname, buildDir);
            const manifestPath = `${extPath}/manifest.json`;
            const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));

            for (let i = 0; i < manifest.content_scripts.length; i++) {
                const contentScript = manifest.content_scripts[i];
                if (contentScript.world == "MAIN") {
                    for (let j = 0; j < contentScript.js.length; j++) {
                        const loaderFilePath = contentScript.js[j];
                        const loader = fs.readFileSync(`${extPath}/${loaderFilePath}`, "utf-8");

                        const contentScriptPathRegex = /chrome\.runtime\.getURL\("([^"]+)"\)/;
                        const match = loader.match(contentScriptPathRegex);

                        const contentScriptPath = match[1];
                        manifest.content_scripts[i].js[j] = contentScriptPath;
                        fs.unlinkSync(`${extPath}/${loaderFilePath}`);
                    }
                }
            }

            fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
        },
    };
}

const outDir = "dist";

export default defineConfig({
    plugins: [
        react(),
        crx({ manifest }),
        tsconfigPaths(),
        { ...manifestWorldMainFix(outDir), enforce: "post" },
    ],
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
        outDir: outDir,
    },
});
