import { LibuilderConfig } from "@ferstack/libuilderjs";

const config = new LibuilderConfig({
  src: "./src",
  index: "./src/index.ts",
  server_index: "./dist/index.server.ts",
  client_index: "./dist/index.client.ts",
});

export default config;
