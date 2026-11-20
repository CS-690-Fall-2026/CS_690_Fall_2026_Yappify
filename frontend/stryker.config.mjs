/** @type {import('@stryker-mutator/api/core').PartialStrykerOptions} */
export default {
  packageManager: "npm",
  mutate: [
    "src/audio/upload.ts",
    "src/data/clips.ts",
    "src/utils/formatDuration.ts",
    "src/audio/constants.ts",
  ],
  testRunner: "command",
  commandRunner: {
    command: "CI=1 npx playwright test --max-failures=1 tests/unit tests/integration tests/property",
  },
  concurrency: 1,
  timeoutMS: 30000,
  cleanTempDir: "always",
  ignorePatterns: ["dist", "test-results", "playwright-report", ".stryker-tmp"],
  reporters: ["clear-text", "json"],
  jsonReporter: {
    fileName: "/tmp/stryker-mutation.json",
  },
};
