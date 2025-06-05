import { defineConfig } from "orval";

export default defineConfig({
  smartpreco: {
    output: {
      client: "react-query",
      mode: "tags-split",
      target: "./api",
      schemas: "./api/model",
      mock: true,
      prettier: true,
      override: {
        mutator: {
          path: "./api/axios.ts",
          name: "axiosInstance",
        },
      },
    },
    input: {
      target: "https://api.smartpreco.mindsnap.tech/api-json",
    },
  },
});
