# Prompt 06 — later question (Effect-TS)

No ledger entry: this question produced advice only — no artifact, no code change. It was asked
after the harness commit `945971ee137873230ba2029856f757f5990f4a84`.

Session: omp CLI session (model `bifrost/opencode-go/deepseek-v4.1-flash`), 2026-11-08.

Verbatim:

```
Do you think we should use ts effect?
```

Answer given: do not adopt Effect for this milestone. `AGENTS.md` forbids a new framework without
approval; M1 is one record/stop screen; Effect's typed errors and layers would add test-time
runtime, `TestClock` and layer composition without changing the AC assertions.
