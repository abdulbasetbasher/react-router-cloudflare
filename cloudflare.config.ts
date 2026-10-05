import { defineConfig } from "cf/config";

export default defineConfig({
  worker: {
    "name": "ttbot",
    "compatibilityDate": "2026-10-01",
    "observability": {
      "enabled": true
    },
    "entrypoint": "./app/worker.ts"
  }
});
