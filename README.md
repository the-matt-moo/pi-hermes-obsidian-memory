# Pi Hermes Obsidian Memory

Persistent memory, session search, and secret scanning for [Pi](https://github.com/earendil-works/pi-coding-agent).

Inspired by [pi-hermes-memory](https://github.com/chandra447/pi-hermes-memory) by Chandra Teja, originally ported from the [Hermes agent](https://github.com/nousresearch/hermes-agent) by Nous Research.

Pi forgets everything when you close a session. This extension fixes that.

## Disclaimer

Created for personal use; published for posterity, sharing, and people who need similar functionality. Caveat emptor: provided as-is, with no guarantees or warranties. I am not responsible for issues arising from anyone else's use.

## Differences from pi-hermes-memory

This is a fork of [pi-hermes-memory](https://github.com/chandra447/pi-hermes-memory) (v0.9.4) with the following changes:

| Area | pi-hermes-memory | pi-hermes-obsidian-memory |
|---|---|---|
| **Storage directory** | `~/.pi/agent/pi-hermes-memory/` | Obsidian vault `<vault>/pi/` (auto-detected), falls back to `~/.pi/agent/pi-hermes-obsidian-memory/` |
| **Cross-machine sync** | None — local only | Memories sync across machines via Obsidian Sync (or any vault sync) |
| **Vault detection** | N/A | Reads `obsidian.json` config, prefers open vault, cross-platform (Win/Mac/Linux) |
| **npm tarball size** | ~500KB+ (includes docs/images) | ~153KB (images and versioned docs excluded) |
| **ESM compliance** | Inline `require("node:fs")` in shutdown handler | Uses already-imported `fs` module consistently |
| **Type safety** | `(result as any).warnings` cast in memory tool | Cast removed; uses `MemoryResult.warnings` directly |
| **npm package name** | `pi-hermes-memory` | `pi-hermes-obsidian-memory` |

**Migration note**: Because the storage directory changed, installing this package alongside or after `pi-hermes-memory` creates a separate memory store. Existing memories in `~/.pi/agent/pi-hermes-memory/` are **not** automatically migrated. To carry over existing data, copy your `MEMORY.md`, `USER.md`, `STANDING.md`, `failures.md`, `sessions.db`, and `skills/` directory to your Obsidian vault's `pi/` folder (or to `~/.pi/agent/pi-hermes-obsidian-memory/` if no vault is detected).

## Prerequisites

- **Node.js** >= 18
- **Pi CLI** (`@earendil-works/pi-coding-agent` >= 0.80.1)
- **npm** (ships with Node.js)
- **SQLite** — handled automatically via `better-sqlite3` (native addon, compiled on install)

### Platform Notes

If Pi is installed via Homebrew and `better-sqlite3` was compiled against a different Node ABI, you may see:

```
was compiled against a different Node.js version using NODE_MODULE_VERSION ...
```

The extension attempts one automatic `npm rebuild better-sqlite3`. If that fails:

```bash
cd ~/.pi/agent/npm/node_modules/better-sqlite3
npm rebuild better-sqlite3
```

## Installation

```bash
# From npm
pi install npm:pi-hermes-obsidian-memory

# From GitHub
pi install git:github.com/the-matt-moo/pi-hermes-obsidian-memory

# Local development (no install)
pi -e /path/to/pi-hermes-obsidian-memory/src/index.ts
```

## Quick Start

```bash
# Install the extension
pi install npm:pi-hermes-obsidian-memory

# Index past sessions into searchable database (one-time)
/memory-index-sessions

# Backfill older Markdown memories into SQLite search (optional)
/memory-sync-markdown

# Interactive tutorial
/learn-memory-tool

# Pre-fill your user profile
/memory-interview
```

Once installed, the extension works automatically. No manual configuration required.

### Obsidian Vault Integration

The extension auto-detects your Obsidian vault and stores memories in `<vault>/pi/`. This means your memories, user profile, standing instructions, skills, and session database sync across every machine where you use Obsidian Sync (or any vault sync tool).

**Detection priority:**
1. Open vault (from Obsidian's config)
2. Any configured vault
3. Fallback: `~/.pi/agent/pi-hermes-obsidian-memory/`

**Config locations read** (platform-specific):
- Windows: `%APPDATA%/obsidian/obsidian.json`
- macOS: `~/Library/Application Support/obsidian/obsidian.json`
- Linux: `$XDG_CONFIG_HOME/obsidian/obsidian.json` (default `~/.config/`)

Override with `"memoryDir"` in config to use any custom path.

## Features

| Feature | Description |
|---|---|
| **Persistent Memory** | Facts, preferences, corrections saved to Markdown files across sessions |
| **Session Search** | Full-text search across all past conversations via SQLite FTS5 |
| **Failure Memory** | Categorized lessons: failures, corrections, insights, conventions, tool quirks |
| **Procedural Skills** | Reusable how-to procedures saved as Pi-native `SKILL.md` files |
| **Background Learning** | Auto-reviews every 10 turns (or 15 tool calls) and saves notable facts |
| **Correction Detection** | Detects user corrections and saves immediately |
| **Auto-Consolidation** | Merges memory entries when full instead of erroring |
| **Secret Scanning** | Blocks API keys, tokens, SSH keys, and credentials from being saved |
| **Memory Aging** | Entries carry timestamps; consolidation knows what is stale |
| **Two-Tier Memory** | Global + per-project memory, both searchable |
| **Standing Instructions** | Pinned rules injected into every session regardless of memory mode |
| **Context Fencing** | `<memory-context>` tags prevent injection through stored memories |

### Engineering Strengths

Independent review found these notable design strengths:

- Parameterized SQL and quoted recovery identifiers; no SQL injection surface found.
- SQLite WAL mode, busy timeout, foreign keys, targeted indexes, and FTS5 sync triggers.
- Atomic same-directory Markdown writes with external-write conflict detection and retries.
- SQLite-backed cross-process locks for memory mutation and consolidation.
- Bounded session backfill and anchor-search work to limit startup and query cost.
- Content scanning, context fencing, and structural provenance for standing instructions.
- Minimal runtime dependency surface; production dependency audit is clean.
- Owner-only (`0600`) temporary prompt and recovery-state files.
- Direct Obsidian filesystem integration with no local REST/HTTP attack surface.

## How It Works

### Memory Architecture

The extension manages three types of knowledge:

| Type | Storage | Token Cost |
|---|---|---|
| **Memory** (`MEMORY.md`) | Facts: env details, project conventions, tool quirks | 5,000 chars max |
| **User Profile** (`USER.md`) | Who you are: name, preferences, communication style | 5,000 chars max |
| **Skills** (`SKILL.md`) | Procedures: how to do something, reusable across sessions | Unlimited |

### Memory Modes

By default, the extension injects a `<memory-policy>` into the system prompt that tells the agent *when* to call `memory_search`. Full memory content is **not** injected — the agent searches on demand, keeping first-turn token usage low.

Set `"memoryMode": "legacy-inject"` to restore full memory injection into the system prompt.

### Tools Provided

| Tool | Purpose |
|---|---|
| `memory_add` | Save a new durable memory entry |
| `memory_replace` | Replace an existing entry by substring match |
| `memory_remove` | Remove an existing entry by substring match |
| `memory_search` | Search durable memories (user, global, project, failure) |
| `session_search` | Search past conversation messages |
| `skill_manage` | Create, view, patch, update, delete procedural skills |

**Memory targets**: `memory` (global notes), `user` (profile), `project` (repo-specific), `failure` (categorized lessons).

### Failure Categories

| Category | Example |
|---|---|
| `failure` | "Tried localStorage for tokens — XSS vulnerability" |
| `correction` | "Use pnpm, not npm" |
| `insight` | "Auth0 SDK handles refresh tokens automatically" |
| `preference` | "Prefers dark theme" |
| `convention` | "Monorepo uses turborepo" |
| `tool-quirk` | "CI needs --frozen-lockfile" |

## Commands

| Command | Description |
|---|---|
| `/memory-insights` | Show everything stored in memory and user profile |
| `/memory-skills` | Interactive TUI for skill search, move, and delete |
| `/memory-consolidate` | Manually trigger memory consolidation |
| `/memory-interview` | Answer questions to pre-fill your user profile |
| `/memory-switch-project` | List all project memories and their entry counts |
| `/memory-index-sessions` | Bulk-import past sessions into the search database |
| `/memory-sync-markdown` | Backfill Markdown memories into SQLite search |
| `/memory-preview-context` | Preview what memory policy or blocks are injected |
| `/memory-pin` | Pin standing instructions injected into every session |
| `/learn-memory-tool` | Interactive tutorial for the memory system |

### Standing Instructions

Standing instructions are rules pinned by the user that are injected into **every** session. Unlike regular memory, they do not depend on the agent choosing to call `memory_search`.

```bash
/memory-pin never run find / or other root-wide filesystem searches
/memory-pin                     # list pinned instructions
/memory-pin remove 2            # remove one
/memory-pin clear               # remove all
```

Budget: 20 entries, 2,000 characters. Stored in `STANDING.md`. Background review and consolidation never write there — only `/memory-pin` or manual editing can.

## Configuration

Create `~/.pi/agent/hermes-memory-config.json`:

```json
{
  "memoryMode": "policy-only",
  "memoryCharLimit": 5000,
  "userCharLimit": 5000,
  "projectCharLimit": 5000,
  "nudgeInterval": 10,
  "nudgeToolCalls": 15,
  "reviewEnabled": true,
  "reviewTransport": "direct",
  "memoryOverflowStrategy": "auto-consolidate",
  "correctionDetection": true,
  "standingInstructionsEnabled": true,
  "flushOnCompact": true,
  "flushOnShutdown": true
}
```

All settings are optional. Defaults are sensible for most users.

### Full Configuration Reference

| Setting | Default | Description |
|---|---|---|
| `memoryMode` | `policy-only` | `policy-only` injects memory policy; `legacy-inject` injects full memory content |
| `memoryPolicyStyle` | `full` | Policy verbosity: `full`, `compact`, `custom`, or `none` |
| `memoryPolicyCustomText` | — | Custom policy text when `memoryPolicyStyle` is `custom` |
| `memoryCharLimit` | `5000` | Max characters in `MEMORY.md` |
| `userCharLimit` | `5000` | Max characters in `USER.md` |
| `projectCharLimit` | `5000` | Max characters in project-scoped `MEMORY.md` |
| `memoryDir` | Auto-detected Obsidian vault `<vault>/pi/`, or `~/.pi/agent/pi-hermes-obsidian-memory` | Override extension storage directory |
| `projectsMemoryDir` | `projects-memory` | Subdirectory under `~/.pi/agent/` for project memory |
| `nudgeInterval` | `10` | Turns between background auto-reviews |
| `nudgeToolCalls` | `15` | Tool calls between auto-reviews (OR with turns) |
| `reviewEnabled` | `true` | Enable/disable background learning loop |
| `reviewTransport` | `direct` | `direct` uses in-process LLM with subprocess fallback; `subprocess` forces `pi -p` |
| `reviewRecentMessages` | `0` | Recent messages in background review (0 = all) |
| `memoryOverflowStrategy` | `auto-consolidate` | When full: `auto-consolidate`, `reject`, or `fifo-evict` |
| `consolidationTimeoutMs` | `180000` | Max time for consolidation (ms) |
| `correctionDetection` | `true` | Detect user corrections for immediate save |
| `failureInjectionEnabled` | `true` | Inject recent failure memories (legacy mode only) |
| `failureInjectionMaxAgeDays` | `7` | Max age for injected failures (legacy mode only) |
| `failureInjectionMaxEntries` | `5` | Max injected failures (legacy mode only) |
| `flushOnCompact` | `true` | Flush memories before context compaction |
| `flushOnShutdown` | `true` | Flush memories on session shutdown |
| `flushMinTurns` | `6` | Minimum turns before flush triggers |
| `flushRecentMessages` | `0` | Recent messages in session flush (0 = all) |
| `standingInstructionsEnabled` | `true` | Enable `/memory-pin` standing instructions |
| `sessionSearch` | `{"variant":"legacy"}` | Session search variant: `legacy` or `anchors` |
| `llmModelOverride` | — | Override model for background review/flush/correction |
| `llmThinkingOverride` | — | Override thinking level: `off`, `minimal`, `low`, `medium`, `high`, `xhigh` |
| `childExtensionPaths` | — | Extra extension paths for child Pi processes |

## Data Locations

When an Obsidian vault is detected:
```
<obsidian-vault>/
└── pi/                        # Global extension storage (syncs via Obsidian)
    ├── MEMORY.md              # Agent notes (env facts, patterns, lessons)
    ├── USER.md                # User profile (name, preferences, habits)
    ├── STANDING.md            # Pinned standing instructions
    ├── failures.md            # Categorized failure/lesson memories
    ├── sessions.db            # SQLite database (sessions + extended memory)
    └── skills/                # Global procedural skills
        └── <slug>/SKILL.md
```

Fallback (no vault detected):
```
~/.pi/agent/
├── pi-hermes-obsidian-memory/ # Global extension storage
│   ├── MEMORY.md
│   ├── USER.md
│   ├── STANDING.md
│   ├── failures.md
│   ├── sessions.db
│   └── skills/
│       └── <slug>/SKILL.md
├── projects-memory/           # Per-project memories
│   └── <project>/
│       ├── MEMORY.md
│       └── skills/
│           └── <slug>/SKILL.md
└── hermes-memory-config.json  # User configuration
```

Memory files are plain Markdown. Entries are separated by `§` (section sign). You can read and edit them directly.

## Security

### Content Scanning

Every memory and skill write passes through a content scanner before being accepted:

- **Threat patterns**: Blocks prompt injection attempts (`ignore previous instructions`, role hijacking, etc.)
- **Secret detection**: Blocks API keys (OpenAI, Anthropic, AWS, GitHub, Slack, Notion), bearer tokens, SSH private keys, password assignments, and environment variable names that indicate secrets
- **Invisible unicode**: Blocks zero-width characters and bidirectional text markers that could be used for injection

### Context Fencing

Memory blocks are wrapped in `<memory-context>` XML tags with a guard note stating the content is NOT new user input. This prevents the LLM from treating stored facts as instructions.

### Standing Instructions Safety

Standing instruction writes go through the same `scanContent()` injection/exfiltration scan. Background review, consolidation, and correction detection never write to `STANDING.md` — only the user (via `/memory-pin` or direct file editing) can.

## Known Limitations

- **`§` delimiter**: Memory entries are separated by `§`. If an entry naturally contains `§`, it splits incorrectly on reload.
- **Background review cost**: Each review cycle costs one LLM API call.
- **Session search requires indexing**: Past sessions must be indexed first. Run `/memory-index-sessions` or let auto-indexing run on shutdown.
- **Core memory limits still apply**: SQLite search mirroring does not bypass the 5,000-char Markdown limit.
- **Project skill visibility**: Project skills are exposed via `resources_discover`. A new skill may not appear until the next session.

## Development

Development requires a full git checkout (the npm package omits tests and TypeScript config):

```bash
git clone https://github.com/the-matt-moo/pi-hermes-obsidian-memory.git
cd pi-hermes-obsidian-memory
npm install
npm run check    # TypeScript type checking
npm test         # Run test suite
```

## License

MIT — see [LICENSE](LICENSE).

## Credits

Inspired by [pi-hermes-memory](https://github.com/chandra447/pi-hermes-memory) by Chandra Teja, originally ported from the [Hermes agent](https://github.com/nousresearch/hermes-agent) by Nous Research.
