# Graph Report - pi-hermes-obsidian-memory  (2026-08-16)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 924 nodes · 2222 edges · 36 communities (33 shown, 3 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 74 edges (avg confidence: 0.77)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `6bcfe47a`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Community 0
- Community 1
- Community 2
- Community 3
- Community 4
- Community 5
- Community 6
- Community 7
- Community 8
- Community 9
- Community 10
- Community 11
- Community 12
- Community 13
- Community 14
- Community 15
- Community 16
- Community 17
- Community 18
- Community 19
- Community 20
- Community 21
- Community 22
- Community 23
- Community 24
- Community 25
- Community 26
- Community 27
- Community 28
- Community 29
- Community 30
- Community 31
- Community 32
- Community 33
- Community 34
- Community 35

## God Nodes (most connected - your core abstractions)
1. `DatabaseManager` - 80 edges
2. `MemoryStore` - 72 edges
3. `SkillsManagerModal` - 40 edges
4. `SkillStore` - 34 edges
5. `AtomicLockCoordinator` - 19 edges
6. `keywords` - 19 edges
7. `StandingInstructions` - 17 edges
8. `MemoryResult` - 17 edges
9. `execChildPrompt()` - 17 edges
10. `SkillScope` - 15 edges

## Surprising Connections (you probably didn't know these)
- `RunDirectMemoryCompletionOptions` --references--> `MemoryConfig`  [EXTRACTED]
  src/handlers/review-memory-ops.ts → src/types.ts
- `SkillBatchActionResult` --references--> `SkillIndex`  [EXTRACTED]
  src/handlers/skills-command.ts → src/types.ts
- `SkillModalRow` --references--> `SkillScope`  [EXTRACTED]
  src/handlers/skills-command.ts → src/types.ts
- `SkillsManagerCallbacks` --references--> `SkillScope`  [EXTRACTED]
  src/handlers/skills-command.ts → src/types.ts
- `registerMemoryTool()` --indirect_call--> `memoryResultView()`  [INFERRED]
  src/tools/memory-tool.ts → src/tools/tool-result-views.ts

## Import Cycles
- None detected.

## Communities (36 total, 3 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.05
Nodes (70): MEMORY_TOOL_DESCRIPTION, ReviewMemoryOperation, INVISIBLE_CHARS, MEMORY_THREAT_PATTERNS, scanSecrets(), SECRET_PATTERNS, buildFallbackFts5Query(), buildNaturalLanguageFallbackQuery() (+62 more)

### Community 1 - "Community 1"
Cohesion: 0.05
Nodes (68): SKILL_TOOL_DESCRIPTION, buildReason(), collectStrings(), containsAny(), findJsonlFiles(), getCwd(), getSessionId(), getTimestamp() (+60 more)

### Community 2 - "Community 2"
Cohesion: 0.06
Nodes (34): buildSkillRows(), buildUnifiedSkillRows(), categoryForScope(), categoryOrder(), cloneFilters(), collectLoadedSkillsFromCommands(), compareSkillRows(), ConfirmDialog (+26 more)

### Community 3 - "Community 3"
Cohesion: 0.09
Nodes (35): confirmDeleteSelectedSkills(), deleteSelectedSkills(), formatSkillsList(), moveSelectedSkills(), registerSkillsCommand(), summarizeAction(), scanContent(), formatPatchList() (+27 more)

### Community 4 - "Community 4"
Cohesion: 0.06
Nodes (57): registerIndexSessionsCommand(), formatBackfillResult(), notifyBestEffort(), NotifyFn, NotifyLevel, scheduleSessionBackfill(), ScheduleSessionBackfillOptions, SESSION_BACKFILL_MAX_FILES (+49 more)

### Community 6 - "Community 6"
Cohesion: 0.12
Nodes (4): normalizeMemoryLookupText(), MemoryStore, ConsolidationResult, MemoryResult

### Community 7 - "Community 7"
Cohesion: 0.09
Nodes (36): appendOwnExtensionArgs(), AUTH_ADAPTER_NAME_PATTERNS, AUTH_ADAPTER_PACKAGE_NAMES, basePromptArgs(), buildChildPiPromptArgs(), CHILD_PROCESS_WATCHDOG_PATH, childExtensionPaths(), ChildLlmConfig (+28 more)

### Community 8 - "Community 8"
Cohesion: 0.16
Nodes (25): DIRECT_FLUSH_SYSTEM_PROMPT, FLUSH_PROMPT, entriesForTarget(), registerConsolidateCommand(), BackgroundReviewOptions, buildDirectReviewUserPrompt(), buildSubprocessReviewPrompt(), ReviewPromptInput (+17 more)

### Community 9 - "Community 9"
Cohesion: 0.09
Nodes (30): DEFAULT_CONFIG, DEFAULT_CONFIG_PATH, isMemoryOverflowStrategy(), isReviewTransport(), isSessionSearchVariant(), isThinkingLevel(), loadConfig(), MEMORY_OVERFLOW_STRATEGIES (+22 more)

### Community 10 - "Community 10"
Cohesion: 0.13
Nodes (21): BunDatabaseInstance, createBunMigrationDatabaseCtor(), DATABASE_FILES, databaseFilesAt(), DatabaseGenerationMoveError, ExtensionRootMigrationResult, FileIdentity, getDatabaseCtor() (+13 more)

### Community 11 - "Community 11"
Cohesion: 0.16
Nodes (10): STANDING_MAX_CHARS, STANDING_MAX_ENTRIES, formatList(), registerStandingPinCommand(), SUBCOMMANDS, normalizeInstruction(), parseInstructions(), StandingInstructionRender (+2 more)

### Community 12 - "Community 12"
Cohesion: 0.14
Nodes (23): BackgroundReviewDeps, applyReviewOperations(), ApplyReviewOperationsResult, AUTH_REJECTION_PATTERN, buildDirectReviewCompletionOptions(), DirectReviewResult, effectiveThinkingOverride(), extractJsonPayload() (+15 more)

### Community 13 - "Community 13"
Cohesion: 0.23
Nodes (10): DEFAULT_PROJECTS_MEMORY_DIR, expandHome(), isSafeRelativeDirectory(), normalizeConfiguredMemoryDir(), normalizeProjectsMemoryDir(), resolveAgentRoot(), resolveDefaultGlobalDir(), resolveObsidianConfigPath() (+2 more)

### Community 14 - "Community 14"
Cohesion: 0.10
Nodes (19): BunDatabaseInstance, createBunCompatDatabaseCtor(), DATABASE_FILE_SUFFIXES, DatabaseCorruptionError, DatabaseCtor, DatabaseFileSuffix, DatabaseLike, DatabaseRecoveryOptions (+11 more)

### Community 15 - "Community 15"
Cohesion: 0.10
Nodes (19): files, scripts, src, docs/PUBLISHING.md, docs/ROADMAP.md, LICENSE, README.md, SECURITY.md (+11 more)

### Community 16 - "Community 16"
Cohesion: 0.11
Nodes (21): INTERVIEW_PROMPT, MEMORY_FILE, STANDING_FILE, registerInterviewCommand(), registerLearnMemoryCommand(), registerSwitchProjectCommand(), registerProjectSkillDiscoveryHandler(), resolveProjectSkillDiscovery() (+13 more)

### Community 17 - "Community 17"
Cohesion: 0.27
Nodes (7): MEMORY_POLICY_PROMPT, MEMORY_POLICY_PROMPT_COMPACT, appendStandingBlock(), registerPreviewContextCommand(), buildPromptContext(), MemoryPolicyConfig, resolveMemoryPolicyPrompt()

### Community 18 - "Community 18"
Cohesion: 0.11
Nodes (19): keywords, agent, auto-consolidation, content-scanner, context-fencing, correction-detection, fts5, hermes (+11 more)

### Community 19 - "Community 19"
Cohesion: 0.17
Nodes (17): CONSOLIDATION_PROMPT, DEFAULT_CONSOLIDATION_TIMEOUT_MS, DIRECT_CONSOLIDATION_SYSTEM_PROMPT, acquireConsolidationLock(), buildConsolidationPrompt(), ConsolidationLlmConfig, ConsolidationLock, ConsolidationLockAttempt (+9 more)

### Community 20 - "Community 20"
Cohesion: 0.15
Nodes (11): AtomicLockCoordinatorOptions, AtomicLockOptions, currentProcessIncarnation, DatabaseCtor, DatabaseLike, getDatabaseCtor(), pendingReleases, probeProcessIncarnation() (+3 more)

### Community 21 - "Community 21"
Cohesion: 0.19
Nodes (15): COMBINED_REVIEW_PROMPT, CORRECTION_DIRECTIVE_WORDS, CORRECTION_NEGATIVE_PATTERNS, CORRECTION_SAVE_PROMPT, CORRECTION_STRONG_PATTERNS, CORRECTION_WEAK_PATTERNS, DIRECT_CORRECTION_SYSTEM_PROMPT, DIRECT_REVIEW_SYSTEM_PROMPT (+7 more)

### Community 22 - "Community 22"
Cohesion: 0.29
Nodes (12): ExtensionRootMigrationOptions, migrateExtensionRoot(), BackfillCounters, isSafeProjectName(), migrateThenSyncMarkdownMemories(), MigrationSyncOptions, readEntries(), realpathIfPresent() (+4 more)

### Community 23 - "Community 23"
Cohesion: 0.27
Nodes (8): acquireMigrationLease(), AtomicLockLease, canonicalStoragePath(), canonicalStoragePathSync(), pathParts(), acquireMarkdownMutationLock(), canonicalMarkdownIdentity(), withMarkdownMutationLock()

### Community 25 - "Community 25"
Cohesion: 0.24
Nodes (9): BetterSqlite3DatabaseCtor, BetterSqlite3LoadError, clearBetterSqlite3RequireCache(), formatBetterSqlite3AbiError(), isNativeModuleAbiMismatch(), loadBetterSqlite3(), resolveBetterSqlite3PackageRoot(), SqliteNativeLoadOptions (+1 more)

### Community 26 - "Community 26"
Cohesion: 0.20
Nodes (9): description, license, main, name, repository, type, url, type (+1 more)

### Community 27 - "Community 27"
Cohesion: 0.22
Nodes (9): devDependencies, tsx, typebox, @types/better-sqlite3, typescript, tsx, typebox, @types/better-sqlite3 (+1 more)

### Community 28 - "Community 28"
Cohesion: 0.25
Nodes (6): FLOOR_PACKAGES, pkg, repoRoot, scopeDir, scratch, stashDir

### Community 29 - "Community 29"
Cohesion: 0.29
Nodes (7): better-sqlite3, @earendil-works/pi-tui, dependencies, better-sqlite3, @earendil-works/pi-tui, strip-ansi, strip-ansi

### Community 30 - "Community 30"
Cohesion: 0.29
Nodes (7): @earendil-works/pi-ai, @earendil-works/pi-coding-agent, @earendil-works/pi-ai, @earendil-works/pi-coding-agent, peerDependencies, @earendil-works/pi-ai, @earendil-works/pi-coding-agent

### Community 31 - "Community 31"
Cohesion: 0.38
Nodes (6): child, signalTree(), terminateTree(), timeout, timeoutMs, [timeoutValue, cancellationPath, command, ...args]

### Community 32 - "Community 32"
Cohesion: 0.50
Nodes (4): scripts, check, check:min-sdk, test

### Community 33 - "Community 33"
Cohesion: 0.50
Nodes (3): files, result, testDir

### Community 34 - "Community 34"
Cohesion: 0.67
Nodes (3): pi, extensions, ./src/index.ts

## Knowledge Gaps
- **200 isolated node(s):** `MemoryMetadata`, `SearchMatch`, `SessionSearchOptions`, `SessionSearchResult`, `MarkdownMemoryReconcileResult` (+195 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `DatabaseManager` connect `Community 5` to `Community 0`, `Community 1`, `Community 4`, `Community 8`, `Community 12`, `Community 14`, `Community 16`, `Community 19`, `Community 21`, `Community 22`, `Community 23`, `Community 24`?**
  _High betweenness centrality (0.135) - this node is a cross-community bridge._
- **Why does `MemoryStore` connect `Community 6` to `Community 0`, `Community 8`, `Community 9`, `Community 12`, `Community 13`, `Community 16`, `Community 17`, `Community 19`, `Community 21`?**
  _High betweenness centrality (0.090) - this node is a cross-community bridge._
- **Why does `SkillsManagerModal` connect `Community 2` to `Community 3`?**
  _High betweenness centrality (0.056) - this node is a cross-community bridge._
- **What connects `MemoryMetadata`, `SearchMatch`, `SessionSearchOptions` to the rest of the system?**
  _200 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.053482221569203646 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.050580997949419004 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.0578386605783866 - nodes in this community are weakly interconnected._