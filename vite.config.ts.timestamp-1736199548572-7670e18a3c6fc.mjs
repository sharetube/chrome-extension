// manifest.json
var manifest_default = {
  manifest_version: 3,
  version: "0.4.0",
  version_name: "0.4.0 beta (Oly)",
  name: "ShareTube",
  short_name: "ST",
  description: "A browser extension thats lets you watch yotube videos with friends in real-time! ",
  permissions: ["storage", "activeTab", "tabs", "scripting", "webNavigation"],
  minimum_chrome_version: "116",
  icons: {
    "16": "assets/icon16.png",
    "32": "assets/icon32.png",
    "48": "assets/icon48.png",
    "128": "assets/icon128.png"
  },
  background: {
    service_worker: "./background-script/index.ts"
  },
  content_scripts: [
    {
      matches: ["https://*.youtube.com/*"],
      js: ["content-script/index.ts"],
      run_at: "document_start"
    },
    {
      js: ["scripts/setVideo.ts"],
      matches: ["https://*.youtube.com/*"],
      world: "MAIN",
      run_at: "document_start"
    },
    {
      js: ["scripts/contextMenu.ts"],
      matches: ["https://*.youtube.com/*"],
      world: "MAIN",
      run_at: "document_start"
    }
  ],
  web_accessible_resources: [
    {
      matches: [],
      resources: ["pages/error.html", "pages/loading.html", "pages/cat-sleep.gif"],
      use_dynamic_url: false
    }
  ]
};

// vite.config.ts
import { crx } from "file:///mnt/c/Users/skewbik/sharetube/chrome-extension/node_modules/@crxjs/vite-plugin/dist/index.mjs";
import react from "file:///mnt/c/Users/skewbik/sharetube/chrome-extension/node_modules/@vitejs/plugin-react/dist/index.mjs";
import fs from "fs";
import { resolve } from "path";
import { defineConfig } from "file:///mnt/c/Users/skewbik/sharetube/chrome-extension/node_modules/vite/dist/node/index.js";
import tsconfigPaths from "file:///mnt/c/Users/skewbik/sharetube/chrome-extension/node_modules/vite-tsconfig-paths/dist/index.js";
var __vite_injected_original_dirname = "/mnt/c/Users/skewbik/sharetube/chrome-extension";
function manifestWorldMainFix(buildDir) {
  return {
    name: "manifest-world-main-fix",
    closeBundle() {
      const extPath = resolve(__vite_injected_original_dirname, buildDir);
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
    }
  };
}
var outDir = "dist";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    crx({ manifest: manifest_default }),
    tsconfigPaths(),
    { ...manifestWorldMainFix(outDir), enforce: "post" }
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
      config: "config.ts"
    }
  },
  assetsInclude: ["**/*.png"],
  build: {
    outDir
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsibWFuaWZlc3QuanNvbiIsICJ2aXRlLmNvbmZpZy50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsie1xuICBcIm1hbmlmZXN0X3ZlcnNpb25cIjogMyxcbiAgXCJ2ZXJzaW9uXCI6IFwiMC40LjBcIixcbiAgXCJ2ZXJzaW9uX25hbWVcIjogXCIwLjQuMCBiZXRhIChPbHkpXCIsXG4gIFwibmFtZVwiOiBcIlNoYXJlVHViZVwiLFxuICBcInNob3J0X25hbWVcIjogXCJTVFwiLFxuICBcImRlc2NyaXB0aW9uXCI6IFwiQSBicm93c2VyIGV4dGVuc2lvbiB0aGF0cyBsZXRzIHlvdSB3YXRjaCB5b3R1YmUgdmlkZW9zIHdpdGggZnJpZW5kcyBpbiByZWFsLXRpbWUhIFwiLFxuICBcInBlcm1pc3Npb25zXCI6IFtcInN0b3JhZ2VcIiwgXCJhY3RpdmVUYWJcIiwgXCJ0YWJzXCIsIFwic2NyaXB0aW5nXCIsIFwid2ViTmF2aWdhdGlvblwiXSxcbiAgXCJtaW5pbXVtX2Nocm9tZV92ZXJzaW9uXCI6IFwiMTE2XCIsXG4gIFwiaWNvbnNcIjoge1xuICAgIFwiMTZcIjogXCJhc3NldHMvaWNvbjE2LnBuZ1wiLFxuICAgIFwiMzJcIjogXCJhc3NldHMvaWNvbjMyLnBuZ1wiLFxuICAgIFwiNDhcIjogXCJhc3NldHMvaWNvbjQ4LnBuZ1wiLFxuICAgIFwiMTI4XCI6IFwiYXNzZXRzL2ljb24xMjgucG5nXCJcbiAgfSxcbiAgXCJiYWNrZ3JvdW5kXCI6IHtcbiAgICBcInNlcnZpY2Vfd29ya2VyXCI6IFwiLi9iYWNrZ3JvdW5kLXNjcmlwdC9pbmRleC50c1wiXG4gIH0sXG4gIFwiY29udGVudF9zY3JpcHRzXCI6IFtcbiAgICB7XG4gICAgICBcIm1hdGNoZXNcIjogW1wiaHR0cHM6Ly8qLnlvdXR1YmUuY29tLypcIl0sXG4gICAgICBcImpzXCI6IFtcImNvbnRlbnQtc2NyaXB0L2luZGV4LnRzXCJdLFxuICAgICAgXCJydW5fYXRcIjogXCJkb2N1bWVudF9zdGFydFwiXG4gICAgfSxcbiAgICB7XG4gICAgICBcImpzXCI6IFtcInNjcmlwdHMvc2V0VmlkZW8udHNcIl0sXG4gICAgICBcIm1hdGNoZXNcIjogW1wiaHR0cHM6Ly8qLnlvdXR1YmUuY29tLypcIl0sXG4gICAgICBcIndvcmxkXCI6IFwiTUFJTlwiLFxuICAgICAgXCJydW5fYXRcIjogXCJkb2N1bWVudF9zdGFydFwiXG4gICAgfSxcbiAgICB7XG4gICAgICBcImpzXCI6IFtcInNjcmlwdHMvY29udGV4dE1lbnUudHNcIl0sXG4gICAgICBcIm1hdGNoZXNcIjogW1wiaHR0cHM6Ly8qLnlvdXR1YmUuY29tLypcIl0sXG4gICAgICBcIndvcmxkXCI6IFwiTUFJTlwiLFxuICAgICAgXCJydW5fYXRcIjogXCJkb2N1bWVudF9zdGFydFwiXG4gICAgfVxuICBdLFxuICBcIndlYl9hY2Nlc3NpYmxlX3Jlc291cmNlc1wiOiBbXG4gICAge1xuICAgICAgXCJtYXRjaGVzXCI6IFtdLFxuICAgICAgXCJyZXNvdXJjZXNcIjogW1wicGFnZXMvZXJyb3IuaHRtbFwiLCBcInBhZ2VzL2xvYWRpbmcuaHRtbFwiLCBcInBhZ2VzL2NhdC1zbGVlcC5naWZcIl0sXG4gICAgICBcInVzZV9keW5hbWljX3VybFwiOiBmYWxzZVxuICAgIH1cbiAgXVxufVxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvbW50L2MvVXNlcnMvc2tld2Jpay9zaGFyZXR1YmUvY2hyb21lLWV4dGVuc2lvblwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL21udC9jL1VzZXJzL3NrZXdiaWsvc2hhcmV0dWJlL2Nocm9tZS1leHRlbnNpb24vdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL21udC9jL1VzZXJzL3NrZXdiaWsvc2hhcmV0dWJlL2Nocm9tZS1leHRlbnNpb24vdml0ZS5jb25maWcudHNcIjtpbXBvcnQgbWFuaWZlc3QgZnJvbSBcIi4vbWFuaWZlc3QuanNvblwiO1xuaW1wb3J0IHsgY3J4IH0gZnJvbSBcIkBjcnhqcy92aXRlLXBsdWdpblwiO1xuaW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdFwiO1xuaW1wb3J0IGZzIGZyb20gXCJmc1wiO1xuaW1wb3J0IHsgcmVzb2x2ZSB9IGZyb20gXCJwYXRoXCI7XG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xuaW1wb3J0IHRzY29uZmlnUGF0aHMgZnJvbSBcInZpdGUtdHNjb25maWctcGF0aHNcIjtcblxuZnVuY3Rpb24gbWFuaWZlc3RXb3JsZE1haW5GaXgoYnVpbGREaXI6IHN0cmluZykge1xuICAgIHJldHVybiB7XG4gICAgICAgIG5hbWU6IFwibWFuaWZlc3Qtd29ybGQtbWFpbi1maXhcIixcbiAgICAgICAgY2xvc2VCdW5kbGUoKSB7XG4gICAgICAgICAgICBjb25zdCBleHRQYXRoID0gcmVzb2x2ZShfX2Rpcm5hbWUsIGJ1aWxkRGlyKTtcbiAgICAgICAgICAgIGNvbnN0IG1hbmlmZXN0UGF0aCA9IGAke2V4dFBhdGh9L21hbmlmZXN0Lmpzb25gO1xuICAgICAgICAgICAgY29uc3QgbWFuaWZlc3QgPSBKU09OLnBhcnNlKGZzLnJlYWRGaWxlU3luYyhtYW5pZmVzdFBhdGgsIFwidXRmLThcIikpO1xuXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG1hbmlmZXN0LmNvbnRlbnRfc2NyaXB0cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGNvbnN0IGNvbnRlbnRTY3JpcHQgPSBtYW5pZmVzdC5jb250ZW50X3NjcmlwdHNbaV07XG4gICAgICAgICAgICAgICAgaWYgKGNvbnRlbnRTY3JpcHQud29ybGQgPT0gXCJNQUlOXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBjb250ZW50U2NyaXB0LmpzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBsb2FkZXJGaWxlUGF0aCA9IGNvbnRlbnRTY3JpcHQuanNbal07XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBsb2FkZXIgPSBmcy5yZWFkRmlsZVN5bmMoYCR7ZXh0UGF0aH0vJHtsb2FkZXJGaWxlUGF0aH1gLCBcInV0Zi04XCIpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBjb250ZW50U2NyaXB0UGF0aFJlZ2V4ID0gL2Nocm9tZVxcLnJ1bnRpbWVcXC5nZXRVUkxcXChcIihbXlwiXSspXCJcXCkvO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgbWF0Y2ggPSBsb2FkZXIubWF0Y2goY29udGVudFNjcmlwdFBhdGhSZWdleCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGNvbnRlbnRTY3JpcHRQYXRoID0gbWF0Y2hbMV07XG4gICAgICAgICAgICAgICAgICAgICAgICBtYW5pZmVzdC5jb250ZW50X3NjcmlwdHNbaV0uanNbal0gPSBjb250ZW50U2NyaXB0UGF0aDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZzLnVubGlua1N5bmMoYCR7ZXh0UGF0aH0vJHtsb2FkZXJGaWxlUGF0aH1gKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZnMud3JpdGVGaWxlU3luYyhtYW5pZmVzdFBhdGgsIEpTT04uc3RyaW5naWZ5KG1hbmlmZXN0LCBudWxsLCAyKSk7XG4gICAgICAgIH0sXG4gICAgfTtcbn1cblxuY29uc3Qgb3V0RGlyID0gXCJkaXN0XCI7XG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gICAgcGx1Z2luczogW1xuICAgICAgICByZWFjdCgpLFxuICAgICAgICBjcngoeyBtYW5pZmVzdCB9KSxcbiAgICAgICAgdHNjb25maWdQYXRocygpLFxuICAgICAgICB7IC4uLm1hbmlmZXN0V29ybGRNYWluRml4KG91dERpciksIGVuZm9yY2U6IFwicG9zdFwiIH0sXG4gICAgXSxcbiAgICByZXNvbHZlOiB7XG4gICAgICAgIGFsaWFzOiB7XG4gICAgICAgICAgICBcIkBhcHBcIjogXCIvY29udGVudC1zY3JpcHQvYXBwL1wiLFxuICAgICAgICAgICAgXCJAc2hhcmVkXCI6IFwiL2NvbnRlbnQtc2NyaXB0L3NoYXJlZFwiLFxuICAgICAgICAgICAgXCJAd2lkZ2V0c1wiOiBcIi9jb250ZW50LXNjcmlwdC93aWRnZXRzXCIsXG4gICAgICAgICAgICBcIkBlbnRpdGllc1wiOiBcIi9jb250ZW50LXNjcmlwdC9lbnRpdGllc1wiLFxuICAgICAgICAgICAgXCJAdGFic1wiOiBcIi9jb250ZW50LXNjcmlwdC90YWJzXCIsXG4gICAgICAgICAgICBcIkBwbGF5ZXJcIjogXCIvY29udGVudC1zY3JpcHQvcGxheWVyXCIsXG4gICAgICAgICAgICBzY3JpcHRzOiBcIi9zY3JpcHRzL1wiLFxuICAgICAgICAgICAgY29uc3RhbnRzOiBcIi9jb25zdGFudHNcIixcbiAgICAgICAgICAgIHR5cGVzOiBcIi90eXBlc1wiLFxuICAgICAgICAgICAgY29uZmlnOiBcImNvbmZpZy50c1wiLFxuICAgICAgICB9LFxuICAgIH0sXG4gICAgYXNzZXRzSW5jbHVkZTogW1wiKiovKi5wbmdcIl0sXG4gICAgYnVpbGQ6IHtcbiAgICAgICAgb3V0RGlyOiBvdXREaXIsXG4gICAgfSxcbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFBO0FBQUEsRUFDRSxrQkFBb0I7QUFBQSxFQUNwQixTQUFXO0FBQUEsRUFDWCxjQUFnQjtBQUFBLEVBQ2hCLE1BQVE7QUFBQSxFQUNSLFlBQWM7QUFBQSxFQUNkLGFBQWU7QUFBQSxFQUNmLGFBQWUsQ0FBQyxXQUFXLGFBQWEsUUFBUSxhQUFhLGVBQWU7QUFBQSxFQUM1RSx3QkFBMEI7QUFBQSxFQUMxQixPQUFTO0FBQUEsSUFDUCxNQUFNO0FBQUEsSUFDTixNQUFNO0FBQUEs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
