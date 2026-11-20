import { spawnSync } from "node:child_process";
import { mkdtempSync, readdirSync, readFileSync, rmSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import libCoverage from "istanbul-lib-coverage";
import libReport from "istanbul-lib-report";
import reports from "istanbul-reports";
import v8ToIstanbul from "v8-to-istanbul";

const FRONTEND_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const STORY_FILES = [
  "src/audio/constants.ts",
  "src/audio/upload.ts",
  "src/data/clips.ts",
  "src/utils/formatDuration.ts",
];
const MIN_LINE_COVERAGE_PCT = 80;

const DEFAULT_TESTS = [
  "tests/acceptance/ac-01-record.spec.ts",
  "tests/unit",
  "tests/integration",
  "tests/property",
];

function extractInlineSourceMap(source) {
  const match = source.match(/\/\/# sourceMappingURL=data:application\/json[^,]*,([A-Za-z0-9+/=]+)\s*$/);
  if (!match) return null;
  return JSON.parse(Buffer.from(match[1], "base64").toString("utf8"));
}

async function main() {
  const covDir = mkdtempSync(path.join(os.tmpdir(), "yappify-pw-cov-"));
  const targets = process.argv.slice(2);
  const testArgs = targets.length > 0 ? targets : DEFAULT_TESTS;

  try {
    const pw = spawnSync("npx", ["playwright", "test", ...testArgs], {
      cwd: FRONTEND_DIR,
      stdio: "inherit",
      env: { ...process.env, PW_COVERAGE_DIR: covDir },
    });

    if (pw.status !== 0) {
      process.exitCode = pw.status ?? 1;
      return;
    }

    const coverageMap = libCoverage.createCoverageMap({});
    const files = readdirSync(covDir).filter((f) => f.endsWith(".json"));

    for (const file of files) {
      const entries = JSON.parse(readFileSync(path.join(covDir, file), "utf8"));
      for (const entry of entries) {
        const pathname = new URL(entry.url).pathname.replace(/^\/+/, "");
        if (!STORY_FILES.includes(pathname)) continue;
        const absPath = path.join(FRONTEND_DIR, pathname);
        const originalSource = readFileSync(absPath, "utf8");
        const sourcemap = extractInlineSourceMap(entry.source ?? "");
        const converter = v8ToIstanbul(
          absPath,
          0,
          sourcemap
            ? { source: entry.source, originalSource, sourceMap: { sourcemap } }
            : { source: entry.source ?? originalSource },
        );
        await converter.load();
        converter.applyCoverage(entry.functions);
        coverageMap.merge(converter.toIstanbul());
      }
    }

    const context = libReport.createContext({
      dir: FRONTEND_DIR,
      coverageMap,
      defaultSummarizer: "flat",
    });

    console.log("\n=== S-7 Story Coverage Report ===");
    reports.create("text", { maxCols: 120 }).execute(context);

    const summary = coverageMap.getCoverageSummary();
    const linesPct = summary.lines.pct;
    const branchesPct = summary.branches.pct;

    console.log("\nUncovered lines & branches by file:");
    for (const relPath of STORY_FILES) {
      const absPath = path.join(FRONTEND_DIR, relPath);
      if (!coverageMap.files().includes(absPath)) {
        console.log(`- ${relPath}: NOT EXECUTED (0% lines, 0% branches)`);
        continue;
      }
      const fc = coverageMap.fileCoverageFor(absPath);
      const lineCov = fc.getLineCoverage();
      const missingLines = Object.entries(lineCov)
        .filter(([, count]) => count === 0)
        .map(([line]) => Number(line))
        .sort((a, b) => a - b);

      const uncoveredBranches = [];
      for (const [id, counts] of Object.entries(fc.b)) {
        const meta = fc.branchMap[id];
        counts.forEach((count, idx) => {
          if (count === 0) {
            const loc = meta.locations?.[idx] ?? meta.loc;
            uncoveredBranches.push(`line ${loc.start.line} (branch ${id}#${idx}, ${meta.type})`);
          }
        });
      }

      const fileSum = fc.toSummary();
      console.log(
        `- ${relPath}: lines ${fileSum.lines.covered}/${fileSum.lines.total} (${fileSum.lines.pct}%), branches ${fileSum.branches.covered}/${fileSum.branches.total} (${fileSum.branches.pct}%)` +
          ` | missing lines: ${missingLines.length ? missingLines.join(", ") : "none"}` +
          ` | missing branches: ${uncoveredBranches.length ? uncoveredBranches.join("; ") : "none"}`,
      );
    }

    console.log(
      `\nTotal S-7 story coverage: lines=${linesPct}% (minimum=${MIN_LINE_COVERAGE_PCT}%), branches=${branchesPct}%`,
    );

    if (linesPct < MIN_LINE_COVERAGE_PCT) {
      console.error(
        `FAIL: Story line coverage ${linesPct}% is below the ${MIN_LINE_COVERAGE_PCT}% minimum.`,
      );
      process.exitCode = 1;
    }
  } finally {
    rmSync(covDir, { recursive: true, force: true });
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
