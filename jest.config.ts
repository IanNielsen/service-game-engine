import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  extensionsToTreatAsEsm: [".ts"],
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        useESM: true,
        tsconfig: "tsconfig.test.json",
      },
    ],
  },
  testMatch: ["**/__tests__/**/*.test.ts"],
  collectCoverageFrom: ["src/**/*.ts", "!src/**/*.test.ts"],
};

export default config;
