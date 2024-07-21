import { LibuilderConfig } from "@ferstack/libuilderjs";

const config = new LibuilderConfig({
  src: "./src",
  server_index: "./dist/index.server.ts",
  client_index: "./dist/index.client.ts",
  index: "./dist/index.ts",
});

export default config;
