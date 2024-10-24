import type { Configuration } from "webpack";

import { rules } from "./webpack.rules";
import { plugins } from "./webpack.plugins";

export const mainConfig: Configuration = {
  entry: "./src/main/main.ts",
  module: {
    rules,
  },
  plugins,
  resolve: {
    extensions: [".js", ".ts", ".tsx", ".css", ".json"],
  },
};
