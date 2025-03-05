// module.exports = {
//   preset: "ts-jest",
//   moduleFileExtensions: ["ts", "js", "json"],
//   testEnvironment: "node",
//   testMatch: ["**/?(*.)+(spec|test).[tj]s?(x)"],
//   transform: {
//     "^.+\\.ts$": "ts-jest",
//   },
// };

import type { JestConfigWithTsJest } from "ts-jest";

const config: JestConfigWithTsJest = {
  verbose: true,
  transform: {
    "^.+\\.ts?$": [
      "ts-jest",
      {
        useESM: true,
      },
    ],
  },
  extensionsToTreatAsEsm: [".ts"],
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
};

export default config;
