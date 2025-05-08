import { defineConfig } from "orval";

export default defineConfig({
  smartpreco: {
    output: {
      client: "react-query",
      mode: "tags-split",
      target: "./api",
      schemas: "./api/model",
      mock: true,
    },
    input: {
      target: "https://api.smartpreco.mindsnap.tech/api-json",
    },
  },
});
