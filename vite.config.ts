import { cpSync } from "node:fs";
import path from "node:path";
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, type Plugin } from "vite";

import { cloudflare } from "@cloudflare/vite-plugin";

// The Cloudflare plugin forces the client build into .cloudflare/output, but
// React Router's SSR build reads the client manifest from build/client.
function mirrorClientBuild(): Plugin {
  let root = process.cwd();
  return {
    name: "mirror-client-build",
    apply: "build",
    applyToEnvironment: (environment) => environment.name === "client",
    configResolved(config) {
      root = config.root;
    },
    writeBundle(options) {
      if (!options.dir) return;
      cpSync(options.dir, path.join(root, "build/client"), { recursive: true });
    },
  };
}

export default defineConfig({
  plugins: [
    tailwindcss(),
    reactRouter(),
    cloudflare({
      viteEnvironment: {
        name: "ssr",
      },
    }),
    mirrorClientBuild(),
  ],
  resolve: {
    tsconfigPaths: true,
  },
});
