// manifest.json
var manifest_default = {
  manifest_version: 3,
  version: "0.2.0",
  version_name: "0.2 alpha (Oly)",
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
    }
  ]
};

// vite.config.ts
import { crx } from "file:///C:/Users/nikit/Documents/github/ShareTube/chrome-extension/node_modules/@crxjs/vite-plugin/dist/index.mjs";
import react from "file:///C:/Users/nikit/Documents/github/ShareTube/chrome-extension/node_modules/@vitejs/plugin-react/dist/index.mjs";
import { defineConfig } from "file:///C:/Users/nikit/Documents/github/ShareTube/chrome-extension/node_modules/vite/dist/node/index.js";
import tsconfigPaths from "file:///C:/Users/nikit/Documents/github/ShareTube/chrome-extension/node_modules/vite-tsconfig-paths/dist/index.js";
var vite_config_default = defineConfig({
  plugins: [react(), crx({ manifest: manifest_default }), tsconfigPaths()],
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
      config: "config.ts"
    }
  },
  assetsInclude: ["**/*.png"],
  build: {
    terserOptions: {
      format: {
        comments: false
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsibWFuaWZlc3QuanNvbiIsICJ2aXRlLmNvbmZpZy50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsie1xuICBcIm1hbmlmZXN0X3ZlcnNpb25cIjogMyxcbiAgXCJ2ZXJzaW9uXCI6IFwiMC4yLjBcIixcbiAgXCJ2ZXJzaW9uX25hbWVcIjogXCIwLjIgYWxwaGEgKE9seSlcIixcbiAgXCJuYW1lXCI6IFwiU2hhcmVUdWJlXCIsXG4gIFwic2hvcnRfbmFtZVwiOiBcIlNUXCIsXG4gIFwiZGVzY3JpcHRpb25cIjogXCJBIGJyb3dzZXIgZXh0ZW5zaW9uIHRoYXRzIGxldHMgeW91IHdhdGNoIHlvdHViZSB2aWRlb3Mgd2l0aCBmcmllbmRzIGluIHJlYWwtdGltZSEgXCIsXG4gIFwicGVybWlzc2lvbnNcIjogW1wic3RvcmFnZVwiLCBcImFjdGl2ZVRhYlwiLCBcInRhYnNcIiwgXCJzY3JpcHRpbmdcIiwgXCJ3ZWJOYXZpZ2F0aW9uXCJdLFxuICBcIm1pbmltdW1fY2hyb21lX3ZlcnNpb25cIjogXCIxMTZcIixcbiAgXCJpY29uc1wiOiB7XG4gICAgXCIxNlwiOiBcImFzc2V0cy9pY29uMTYucG5nXCIsXG4gICAgXCIzMlwiOiBcImFzc2V0cy9pY29uMzIucG5nXCIsXG4gICAgXCI0OFwiOiBcImFzc2V0cy9pY29uNDgucG5nXCIsXG4gICAgXCIxMjhcIjogXCJhc3NldHMvaWNvbjEyOC5wbmdcIlxuICB9LFxuICBcImJhY2tncm91bmRcIjoge1xuICAgIFwic2VydmljZV93b3JrZXJcIjogXCIuL2JhY2tncm91bmQtc2NyaXB0L2luZGV4LnRzXCJcbiAgfSxcbiAgXCJjb250ZW50X3NjcmlwdHNcIjogW1xuICAgIHtcbiAgICAgIFwibWF0Y2hlc1wiOiBbXCJodHRwczovLyoueW91dHViZS5jb20vKlwiXSxcbiAgICAgIFwianNcIjogW1wiY29udGVudC1zY3JpcHQvaW5kZXgudHNcIl0sXG4gICAgICBcInJ1bl9hdFwiOiBcImRvY3VtZW50X3N0YXJ0XCJcbiAgICB9XG4gIF1cbn1cbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcbmlraXRcXFxcRG9jdW1lbnRzXFxcXGdpdGh1YlxcXFxTaGFyZVR1YmVcXFxcY2hyb21lLWV4dGVuc2lvblwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcbmlraXRcXFxcRG9jdW1lbnRzXFxcXGdpdGh1YlxcXFxTaGFyZVR1YmVcXFxcY2hyb21lLWV4dGVuc2lvblxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvbmlraXQvRG9jdW1lbnRzL2dpdGh1Yi9TaGFyZVR1YmUvY2hyb21lLWV4dGVuc2lvbi92aXRlLmNvbmZpZy50c1wiO2ltcG9ydCBtYW5pZmVzdCBmcm9tIFwiLi9tYW5pZmVzdC5qc29uXCI7XHJcbmltcG9ydCB7IGNyeCB9IGZyb20gXCJAY3J4anMvdml0ZS1wbHVnaW5cIjtcclxuaW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdFwiO1xyXG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xyXG5pbXBvcnQgdHNjb25maWdQYXRocyBmcm9tIFwidml0ZS10c2NvbmZpZy1wYXRoc1wiO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcclxuICAgIHBsdWdpbnM6IFtyZWFjdCgpLCBjcngoeyBtYW5pZmVzdCB9KSwgdHNjb25maWdQYXRocygpXSxcclxuICAgIHJlc29sdmU6IHtcclxuICAgICAgICBhbGlhczoge1xyXG4gICAgICAgICAgICBcIkBhcHBcIjogXCIvY29udGVudC1zY3JpcHQvYXBwL1wiLFxyXG4gICAgICAgICAgICBcIkBzaGFyZWRcIjogXCIvY29udGVudC1zY3JpcHQvc2hhcmVkXCIsXHJcbiAgICAgICAgICAgIFwiQHdpZGdldHNcIjogXCIvY29udGVudC1zY3JpcHQvd2lkZ2V0c1wiLFxyXG4gICAgICAgICAgICBcIkBlbnRpdGllc1wiOiBcIi9jb250ZW50LXNjcmlwdC9lbnRpdGllc1wiLFxyXG4gICAgICAgICAgICBcIkB0YWJzXCI6IFwiL2NvbnRlbnQtc2NyaXB0L3RhYnNcIixcclxuICAgICAgICAgICAgXCJAcGxheWVyXCI6IFwiL2NvbnRlbnQtc2NyaXB0L3BsYXllclwiLFxyXG4gICAgICAgICAgICBjb25zdGFudHM6IFwiL2NvbnN0YW50c1wiLFxyXG4gICAgICAgICAgICB0eXBlczogXCIvdHlwZXNcIixcclxuICAgICAgICAgICAgY29uZmlnOiBcImNvbmZpZy50c1wiLFxyXG4gICAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAgYXNzZXRzSW5jbHVkZTogW1wiKiovKi5wbmdcIl0sXHJcbiAgICBidWlsZDoge1xyXG4gICAgICAgIHRlcnNlck9wdGlvbnM6IHtcclxuICAgICAgICAgICAgZm9ybWF0OiB7XHJcbiAgICAgICAgICAgICAgICBjb21tZW50czogZmFsc2UsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgfSxcclxuICAgIH0sXHJcbn0pO1xyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQUE7QUFBQSxFQUNFLGtCQUFvQjtBQUFBLEVBQ3BCLFNBQVc7QUFBQSxFQUNYLGNBQWdCO0FBQUEsRUFDaEIsTUFBUTtBQUFBLEVBQ1IsWUFBYztBQUFBLEVBQ2QsYUFBZTtBQUFBLEVBQ2YsYUFBZSxDQUFDLFdBQVcsYUFBYSxRQUFRLGFBQWEsZUFBZTtBQUFBLEVBQzVFLHdCQUEwQjtBQUFBLEVBQzFCLE9BQVM7QUFBQSxJQUNQLE1BQU07QUFBQSxJQUNOLE1BQU07QUFBQSxJQUNOLE1BQU07QUFBQSxJQUNOLE9BQU87QUFBQSxFQUNUO0FBQUEsRUFDQSxZQUFjO0FBQUEsSUFDWixnQkFBa0I7QUFBQSxFQUNwQjtBQUFBLEVBQ0EsaUJBQW1CO0FBQUEsSUFDakI7QUFBQSxNQUNFLFNBQVcsQ0FBQyx5QkFBeUI7QUFBQSxNQUNyQyxJQUFNLENBQUMseUJBQXlCO0FBQUEsTUFDaEMsUUFBVTtBQUFBLElBQ1o7QUFBQSxFQUNGO0FBQ0Y7OztBQ3hCQSxTQUFTLFdBQVc7QUFDcEIsT0FBTyxXQUFXO0FBQ2xCLFNBQVMsb0JBQW9CO0FBQzdCLE9BQU8sbUJBQW1CO0FBRTFCLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQ3hCLFNBQVMsQ0FBQyxNQUFNLEdBQUcsSUFBSSxFQUFFLDJCQUFTLENBQUMsR0FBRyxjQUFjLENBQUM7QUFBQSxFQUNyRCxTQUFTO0FBQUEsSUFDTCxPQUFPO0FBQUEsTUFDSCxRQUFRO0FBQUEsTUFDUixXQUFXO0FBQUEsTUFDWCxZQUFZO0FBQUEsTUFDWixhQUFhO0FBQUEsTUFDYixTQUFTO0FBQUEsTUFDVCxXQUFXO0FBQUEsTUFDWCxXQUFXO0FBQUEsTUFDWCxPQUFPO0FBQUEsTUFDUCxRQUFRO0FBQUEsSUFDWjtBQUFBLEVBQ0o7QUFBQSxFQUNBLGVBQWUsQ0FBQyxVQUFVO0FBQUEsRUFDMUIsT0FBTztBQUFBLElBQ0gsZUFBZTtBQUFBLE1BQ1gsUUFBUTtBQUFBLFFBQ0osVUFBVTtBQUFBLE1BQ2Q7QUFBQSxJQUNKO0FBQUEsRUFDSjtBQUNKLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
