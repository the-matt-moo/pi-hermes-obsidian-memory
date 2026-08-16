# Changelog

All notable changes to this project are documented here. The format is based on
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project
adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.9.5] - 2026-08-16

### Changed
- `childExtensionPaths` config-validation warnings now route through
  `ctx.ui.notify` instead of raw `console.warn`, so misconfigured
  `childExtensionPaths` entries surface in Pi's notification layer rather than
  bypassing it on stderr.
- Session-flush and background-review background-task failures, previously
  swallowed by silent `.catch(() => {})` blocks, now emit a `warning` via
  `ctx.ui.notify`.
- Documented the path-traversal guard in `normalizeProjectsMemoryDir`
  (`paths.ts`).

### Notes
- Automatic over-capacity consolidation runs inside `MemoryStore` without a UI
  context, so it retains the `console.warn` fallback for config warnings by
  design.

## [0.9.4]

- Initial published fork of `pi-hermes-memory` (v0.9.4): Obsidian-vault
  storage with cross-machine sync, SQLite FTS5 session/memory search, secret
  and prompt-injection scanning, auto-consolidation, correction detection, and
  procedural skills.
