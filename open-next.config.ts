// open-next.config.ts
import { defineCloudflareConfig } from "@opennextjs/cloudflare";

export default defineCloudflareConfig({
  default: {
    override: {
      wrapper: "cloudflare-pages",
    },
  },
  // Force esbuild to treat these packages as external to prevent bundling errors
  middleware: {
    external: ["jose", "@panva/hkdf"],
  },
});