import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { createHtmlPlugin } from "vite-plugin-html";
import webExtension from "vite-plugin-web-extension";
import tsconfigPaths from "vite-tsconfig-paths";

const baseOutDir = "dist";

export default defineConfig(({ mode }) => {
	const isDev = mode === "development";
	const isProduction = !isDev;

	const browser: string = process.env.BROWSER || "chrome";
	const outDir = `${baseOutDir}/${browser}`;

	return {
		plugins: [
			createHtmlPlugin({
				minify: true,
			}),
			react(),
			webExtension({
				browser: browser,
				additionalInputs: [
					"pages/error.html",
					"pages/loading.html",
					"pages/cat-sleep.gif",
				],
			}),
			tsconfigPaths(),
		],
		resolve: {
			alias: {
				"@app": "/content-script/app/",
				"@shared": "/content-script/shared",
				"@widgets": "/content-script/widgets",
				"@entities": "/content-script/entities",
				"@tabs": "/content-script/tabs",
				"@player": "/content-script/player",
				scripts: "/scripts/",
				constants: "/constants",
				types: "/types",
				config: "config.json",
			},
		},
		assetsInclude: ["**/*.png"],
		build: {
			outDir: outDir,
			sourcemap: isDev,
			minify: isProduction,
			reportCompressedSize: isProduction,
		},
	};
});
