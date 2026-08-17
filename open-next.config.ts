// open-next.config.ts
import { defineCloudflareConfig } from "@opennextjs/cloudflare";

export default defineCloudflareConfig({
  // Exclude problematic node modules from the worker bundle on Windows
  buildCommand: "next build",
});