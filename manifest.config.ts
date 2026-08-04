import { defineManifest } from "@crxjs/vite-plugin";

export default defineManifest({
  manifest_version: 3,

  name: "Font Inspector",
  version: "1.0.0",
  description: "Inspect and identify fonts used on any webpage.",

  action: {},

  permissions: ["activeTab"],

  host_permissions: ["<all_urls>"],

  icons: {
    "16": "icons/icon16.png",
    "32": "icons/icon32.png",
    "48": "icons/icon48.png",
    "128": "icons/icon128.png",
  },

  background: {
    service_worker: "src/background/background.tsx",
    type: "module",
  },

  content_scripts: [
    {
      matches: ["<all_urls>"],
      js: ["src/content/content.tsx"],
      run_at: "document_idle",
    },
  ],
});
