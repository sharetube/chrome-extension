// manifest.json
var manifest_default = {
  manifest_version: 3,
  version: "1.0.0",
  version_name: "1.0.0 beta (Oly)",
  name: "ShareTube",
  short_name: "ST",
  author: "Sharetube team",
  description: "A browser extension that lets you watch yotube videos together with your friends in real-time!",
  permissions: ["storage", "tabs", "webNavigation"],
  minimum_chrome_version: "116",
  icons: {
    "16": "assets/icon16.png",
    "32": "assets/icon32.png",
    "48": "assets/icon48.png",
    "128": "assets/icon128.png"
  },
  background: {
    service_worker: "background-script/index.ts"
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
    }
  ],
  web_accessible_resources: [
    {
      matches: [],
      resources: ["pages/error.html", "pages/loading.html", "pages/cat-sleep.gif"],
      use_dynamic_url: false
    }
  ],
  browser_specific_settings: {
    gecko: {
      id: "sharetube.team@gmail.com",
      strict_min_version: "78.0"
    },
    gecko_android: {
      strict_min_version: "79.0"
    }
  }
};

// vite.config.ts
import { crx } from "file:///mnt/c/Users/skewbik/sharetube/extension/node_modules/@crxjs/vite-plugin/dist/index.mjs";
import react from "file:///mnt/c/Users/skewbik/sharetube/extension/node_modules/@vitejs/plugin-react/dist/index.mjs";
import fs from "fs";
import { resolve } from "path";
import { defineConfig } from "file:///mnt/c/Users/skewbik/sharetube/extension/node_modules/vite/dist/node/index.js";
import tsconfigPaths from "file:///mnt/c/Users/skewbik/sharetube/extension/node_modules/vite-tsconfig-paths/dist/index.js";
var __vite_injected_original_dirname = "/mnt/c/Users/skewbik/sharetube/extension";
function fixManifestOut(buildDir, browser) {
  return {
    name: "out-manifest-fix",
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
      switch (browser) {
        case "firefox":
          delete manifest.version_name;
          delete manifest.minimum_chrome_version;
          manifest.background.scripts = [manifest.background.service_worker];
          delete manifest.background.service_worker;
          manifest.web_accessible_resources.forEach((elem) => {
            delete elem.use_dynamic_url;
          });
          break;
        case "chrome":
          delete manifest.browser_specific_settings;
          break;
      }
      fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
    }
  };
}
var baseOutDir = "dist";
var vite_config_default = defineConfig(({}) => {
  const browser = process.env.BROWSER || "chrome";
  const outDir = `${baseOutDir}/${browser}`;
  return {
    plugins: [
      react(),
      crx({ manifest: manifest_default }),
      tsconfigPaths(),
      { ...fixManifestOut(outDir, browser), enforce: "post" }
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
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsibWFuaWZlc3QuanNvbiIsICJ2aXRlLmNvbmZpZy50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsie1xuICBcIm1hbmlmZXN0X3ZlcnNpb25cIjogMyxcbiAgXCJ2ZXJzaW9uXCI6IFwiMS4wLjBcIixcbiAgXCJ2ZXJzaW9uX25hbWVcIjogXCIxLjAuMCBiZXRhIChPbHkpXCIsXG4gIFwibmFtZVwiOiBcIlNoYXJlVHViZVwiLFxuICBcInNob3J0X25hbWVcIjogXCJTVFwiLFxuICBcImF1dGhvclwiOiBcIlNoYXJldHViZSB0ZWFtXCIsXG4gIFwiZGVzY3JpcHRpb25cIjogXCJBIGJyb3dzZXIgZXh0ZW5zaW9uIHRoYXQgbGV0cyB5b3Ugd2F0Y2ggeW90dWJlIHZpZGVvcyB0b2dldGhlciB3aXRoIHlvdXIgZnJpZW5kcyBpbiByZWFsLXRpbWUhXCIsXG4gIFwicGVybWlzc2lvbnNcIjogW1wic3RvcmFnZVwiLCBcInRhYnNcIiwgXCJ3ZWJOYXZpZ2F0aW9uXCJdLFxuICBcIm1pbmltdW1fY2hyb21lX3ZlcnNpb25cIjogXCIxMTZcIixcbiAgXCJpY29uc1wiOiB7XG4gICAgXCIxNlwiOiBcImFzc2V0cy9pY29uMTYucG5nXCIsXG4gICAgXCIzMlwiOiBcImFzc2V0cy9pY29uMzIucG5nXCIsXG4gICAgXCI0OFwiOiBcImFzc2V0cy9pY29uNDgucG5nXCIsXG4gICAgXCIxMjhcIjogXCJhc3NldHMvaWNvbjEyOC5wbmdcIlxuICB9LFxuICBcImJhY2tncm91bmRcIjoge1xuICAgIFwic2VydmljZV93b3JrZXJcIjogXCJiYWNrZ3JvdW5kLXNjcmlwdC9pbmRleC50c1wiXG4gIH0sXG4gIFwiY29udGVudF9zY3JpcHRzXCI6IFtcbiAgICB7XG4gICAgICBcIm1hdGNoZXNcIjogW1wiaHR0cHM6Ly8qLnlvdXR1YmUuY29tLypcIl0sXG4gICAgICBcImpzXCI6IFtcImNvbnRlbnQtc2NyaXB0L2luZGV4LnRzXCJdLFxuICAgICAgXCJydW5fYXRcIjogXCJkb2N1bWVudF9zdGFydFwiXG4gICAgfSxcbiAgICB7XG4gICAgICBcImpzXCI6IFtcInNjcmlwdHMvc2V0VmlkZW8udHNcIl0sXG4gICAgICBcIm1hdGNoZXNcIjogW1wiaHR0cHM6Ly8qLnlvdXR1YmUuY29tLypcIl0sXG4gICAgICBcIndvcmxkXCI6IFwiTUFJTlwiLFxuICAgICAgXCJydW5fYXRcIjogXCJkb2N1bWVudF9zdGFydFwiXG4gICAgfVxuICBdLFxuICBcIndlYl9hY2Nlc3NpYmxlX3Jlc291cmNlc1wiOiBbXG4gICAge1xuICAgICAgXCJtYXRjaGVzXCI6IFtdLFxuICAgICAgXCJyZXNvdXJjZXNcIjogW1wicGFnZXMvZXJyb3IuaHRtbFwiLCBcInBhZ2VzL2xvYWRpbmcuaHRtbFwiLCBcInBhZ2VzL2NhdC1zbGVlcC5naWZcIl0sXG4gICAgICBcInVzZV9keW5hbWljX3VybFwiOiBmYWxzZVxuICAgIH1cbiAgXSxcbiAgXCJicm93c2VyX3NwZWNpZmljX3NldHRpbmdzXCI6IHtcbiAgICBcImdlY2tvXCI6IHtcbiAgICAgIFwiaWRcIjogXCJzaGFyZXR1YmUudGVhbUBnbWFpbC5jb21cIixcbiAgICAgIFwic3RyaWN0X21pbl92ZXJzaW9uXCI6IFwiNzguMFwiXG4gICAgfSxcbiAgICBcImdlY2tvX2FuZHJvaWRcIjoge1xuICAgICAgXCJzdHJpY3RfbWluX3ZlcnNpb25cIjogXCI3OS4wXCJcbiAgICB9XG4gIH1cbn1cbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL21udC9jL1VzZXJzL3NrZXdiaWsvc2hhcmV0dWJlL2V4dGVuc2lvblwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL21udC9jL1VzZXJzL3NrZXdiaWsvc2hhcmV0dWJlL2V4dGVuc2lvbi92aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vbW50L2MvVXNlcnMvc2tld2Jpay9zaGFyZXR1YmUvZXh0ZW5zaW9uL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IG1hbmlmZXN0IGZyb20gXCIuL21hbmlmZXN0Lmpzb25cIjtcbmltcG9ydCB7IGNyeCB9IGZyb20gXCJAY3J4anMvdml0ZS1wbHVnaW5cIjtcbmltcG9ydCByZWFjdCBmcm9tIFwiQHZpdGVqcy9wbHVnaW4tcmVhY3RcIjtcbmltcG9ydCBmcyBmcm9tIFwiZnNcIjtcbmltcG9ydCB7IHJlc29sdmUgfSBmcm9tIFwicGF0aFwiO1xuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcbmltcG9ydCB0c2NvbmZpZ1BhdGhzIGZyb20gXCJ2aXRlLXRzY29uZmlnLXBhdGhzXCI7XG5cbmZ1bmN0aW9uIGZpeE1hbmlmZXN0T3V0KGJ1aWxkRGlyOiBzdHJpbmcsIGJyb3dzZXI6IHN0cmluZykge1xuICAgIHJldHVybiB7XG4gICAgICAgIG5hbWU6IFwib3V0LW1hbmlmZXN0LWZpeFwiLFxuICAgICAgICBjbG9zZUJ1bmRsZSgpIHtcbiAgICAgICAgICAgIGNvbnN0IGV4dFBhdGggPSByZXNvbHZlKF9fZGlybmFtZSwgYnVpbGREaXIpO1xuICAgICAgICAgICAgY29uc3QgbWFuaWZlc3RQYXRoID0gYCR7ZXh0UGF0aH0vbWFuaWZlc3QuanNvbmA7XG4gICAgICAgICAgICBjb25zdCBtYW5pZmVzdCA9IEpTT04ucGFyc2UoZnMucmVhZEZpbGVTeW5jKG1hbmlmZXN0UGF0aCwgXCJ1dGYtOFwiKSk7XG5cbiAgICAgICAgICAgIC8vIGZpeCB3b3JsZDpNQUlOIHNjcmlwdHNcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbWFuaWZlc3QuY29udGVudF9zY3JpcHRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgY29udGVudFNjcmlwdCA9IG1hbmlmZXN0LmNvbnRlbnRfc2NyaXB0c1tpXTtcbiAgICAgICAgICAgICAgICBpZiAoY29udGVudFNjcmlwdC53b3JsZCA9PSBcIk1BSU5cIikge1xuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGNvbnRlbnRTY3JpcHQuanMubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGxvYWRlckZpbGVQYXRoID0gY29udGVudFNjcmlwdC5qc1tqXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGxvYWRlciA9IGZzLnJlYWRGaWxlU3luYyhgJHtleHRQYXRofS8ke2xvYWRlckZpbGVQYXRofWAsIFwidXRmLThcIik7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGNvbnRlbnRTY3JpcHRQYXRoUmVnZXggPSAvY2hyb21lXFwucnVudGltZVxcLmdldFVSTFxcKFwiKFteXCJdKylcIlxcKS87XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBtYXRjaCA9IGxvYWRlci5tYXRjaChjb250ZW50U2NyaXB0UGF0aFJlZ2V4KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgY29udGVudFNjcmlwdFBhdGggPSBtYXRjaFsxXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1hbmlmZXN0LmNvbnRlbnRfc2NyaXB0c1tpXS5qc1tqXSA9IGNvbnRlbnRTY3JpcHRQYXRoO1xuICAgICAgICAgICAgICAgICAgICAgICAgZnMudW5saW5rU3luYyhgJHtleHRQYXRofS8ke2xvYWRlckZpbGVQYXRofWApO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBzd2l0Y2ggKGJyb3dzZXIpIHtcbiAgICAgICAgICAgICAgICBjYXNlIFwiZmlyZWZveFwiOlxuICAgICAgICAgICAgICAgICAgICAvLyBmaXggbWFuaWZlc3RcbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlIG1hbmlmZXN0LnZlcnNpb25fbmFtZTtcbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlIG1hbmlmZXN0Lm1pbmltdW1fY2hyb21lX3ZlcnNpb247XG4gICAgICAgICAgICAgICAgICAgIG1hbmlmZXN0LmJhY2tncm91bmQuc2NyaXB0cyA9IFttYW5pZmVzdC5iYWNrZ3JvdW5kLnNlcnZpY2Vfd29ya2VyXTtcbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlIG1hbmlmZXN0LmJhY2tncm91bmQuc2VydmljZV93b3JrZXI7XG5cbiAgICAgICAgICAgICAgICAgICAgbWFuaWZlc3Qud2ViX2FjY2Vzc2libGVfcmVzb3VyY2VzLmZvckVhY2goZWxlbSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkZWxldGUgZWxlbS51c2VfZHluYW1pY191cmw7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIFwiY2hyb21lXCI6XG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBtYW5pZmVzdC5icm93c2VyX3NwZWNpZmljX3NldHRpbmdzO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZzLndyaXRlRmlsZVN5bmMobWFuaWZlc3RQYXRoLCBKU09OLnN0cmluZ2lmeShtYW5pZmVzdCwgbnVsbCwgMikpO1xuICAgICAgICB9LFxuICAgIH07XG59XG5cbmNvbnN0IGJhc2VPdXREaXIgPSBcImRpc3RcIjtcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKCh7fSkgPT4ge1xuICAgIGNvbnN0IGJyb3dzZXI6IHN0cmluZyA9IHByb2Nlc3MuZW52LkJST1dTRVIgfHwgXCJjaHJvbWVcIjtcbiAgICBjb25zdCBvdXREaXIgPSBgJHtiYXNlT3V0RGlyfS8ke2Jyb3dzZXJ9YDtcblxuICAgIHJldHVybiB7XG4gICAgICAgIHBsdWdpbnM6IFtcbiAgICAgICAgICAgIHJlYWN0KCksXG4gICAgICAgICAgICBjcngoeyBtYW5pZmVzdCB9KSxcbiAgICAgICAgICAgIHRzY29uZmlnUGF0aHMoKSxcbiAgICAgICAgICAgIHsgLi4uZml4TWFuaWZlc3RPdXQob3V0RGlyLCBicm93c2VyKSwgZW5mb3JjZTogXCJwb3N0XCIgfSxcbiAgICAgICAgXSxcbiAgICAgICAgcmVzb2x2ZToge1xuICAgICAgICAgICAgYWxpYXM6IHtcbiAgICAgICAgICAgICAgICBcIkBhcHBcIjogXCIvY29udGVudC1zY3JpcHQvYXBwL1wiLFxuICAgICAgICAgICAgICAgIFwiQHNoYXJlZFwiOiBcIi9jb250ZW50LXNjcmlwdC9zaGFyZWRcIixcbiAgICAgICAgICAgICAgICBcIkB3aWRnZXRzXCI6IFwiL2NvbnRlbnQtc2NyaXB0L3dpZGdldHNcIixcbiAgICAgICAgICAgICAgICBcIkBlbnRpdGllc1wiOiBcIi9jb250ZW50LXNjcmlwdC9lbnRpdGllc1wiLFxuICAgICAgICAgICAgICAgIFwiQHRhYnNcIjogXCIvY29udGVudC1zY3JpcHQvdGFic1wiLFxuICAgICAgICAgICAgICAgIFwiQHBsYXllclwiOiBcIi9jb250ZW50LXNjcmlwdC9wbGF5ZXJcIixcbiAgICAgICAgICAgICAgICBzY3JpcHRzOiBcIi9zY3JpcHRzL1wiLFxuICAgICAgICAgICAgICAgIGNvbnN0YW50czogXCIvY29uc3RhbnRzXCIsXG4gICAgICAgICAgICAgICAgdHlwZXM6IFwiL3R5cGVzXCIsXG4gICAgICAgICAgICAgICAgY29uZmlnOiBcImNvbmZpZy50c1wiLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAgYXNzZXRzSW5jbHVkZTogW1wiKiovKi5wbmdcIl0sXG4gICAgICAgIGJ1aWxkOiB7XG4gICAgICAgICAgICBvdXREaXI6IG91dERpcixcbiAgICAgICAgfSxcbiAgICB9O1xufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQUE7QUFBQSxFQUNFLGtCQUFvQjtBQUFBLEVBQ3BCLFNBQVc7QUFBQSxFQUNYLGNBQWdCO0FBQUEsRUFDaEIsTUFBUTtBQUFBLEVBQ1IsWUFBYztBQUFB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
