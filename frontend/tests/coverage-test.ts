import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { test as base, expect, type Page } from "@playwright/test";

export { expect, type Page };

const COVERAGE_DIR = process.env.PW_COVERAGE_DIR;
const ACTIVE_MUTANT = process.env.__STRYKER_ACTIVE_MUTANT__;
const STORY_SOURCE_RE = /\/src\/(audio\/(constants|upload)|data\/clips|utils\/formatDuration)\.ts$/;

/**
 * Playwright `test` fixture that:
 * - forwards Stryker's `__STRYKER_ACTIVE_MUTANT__` env var into Chromium when running mutation tests;
 * - records Chromium V8 JS coverage for S-7 story files when `PW_COVERAGE_DIR` is set;
 * - otherwise behaves identically to `@playwright/test`.
 */
export const test =
  COVERAGE_DIR || ACTIVE_MUTANT !== undefined
    ? base.extend<{ page: Page }>({
        page: async ({ page }, use, testInfo) => {
          if (ACTIVE_MUTANT !== undefined) {
            await page.addInitScript((mutantId) => {
              const g = globalThis as { __stryker__?: { activeMutant?: string } };
              g.__stryker__ = g.__stryker__ ?? {};
              g.__stryker__.activeMutant = mutantId;
            }, ACTIVE_MUTANT);
          }

          if (COVERAGE_DIR) {
            await page.coverage.startJSCoverage({
              resetOnNavigation: false,
              reportAnonymousScripts: false,
            });
          }

          await use(page);

          if (COVERAGE_DIR) {
            const entries = await page.coverage.stopJSCoverage();
            const storyEntries = entries.filter((entry) => {
              try {
                return STORY_SOURCE_RE.test(new URL(entry.url).pathname);
              } catch {
                return false;
              }
            });
            if (storyEntries.length > 0) {
              mkdirSync(COVERAGE_DIR, { recursive: true });
              const outFile = path.join(
                COVERAGE_DIR,
                `cov-${process.pid}-${testInfo.workerIndex}-${Date.now()}-${Math.random().toString(36).slice(2)}.json`,
              );
              writeFileSync(outFile, JSON.stringify(storyEntries), "utf8");
            }
          }
        },
      })
    : base;
