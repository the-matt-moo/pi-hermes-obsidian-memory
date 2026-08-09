import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, symlinkSync, writeFileSync, rmSync, utimesSync, readdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { scanContent, scanSecrets } from "../src/store/content-scanner.js";
import { decodeMemoryMetadata, encodeMemoryMetadata } from "../src/store/metadata-codec.js";
import { getSessionFiles } from "../src/store/session-parser.js";
import { searchSessionAnchors } from "../src/store/session-anchor-search.js";
import { DatabaseManager } from "../src/store/db.js";
import { searchSessions } from "../src/store/session-search.js";
import { reconcileMarkdownMemoryScope } from "../src/store/sqlite-memory-store.js";
import { MemoryStore } from "../src/store/memory-store.js";
import { buildChildPiPromptArgs } from "../src/handlers/pi-child-process.js";

function tempDir(): string {
  return mkdtempSync(join(tmpdir(), "hermes-audit-"));
}

function sessionLine(text: string): string {
  return JSON.stringify({ type: "message", id: "m1", timestamp: "2026-08-09T12:00:00.000Z", message: { role: "user", content: text } });
}

test("scanner detects requested credentials without flagging benign examples", () => {
  // Build credential-shaped fixtures at runtime so repository secret scanning
  // does not mistake synthetic test data for live credentials.
  const stripeKey = ["sk", "live", "1".repeat(24)].join("_");
  const twilioAccount = `AC${"1".repeat(32)}`;
  const twilioAuth = "1234567890abcdef".repeat(2);
  const samples = [
    stripeKey,
    '{"type":"service_account","private_key":"-----BEGIN PRIVATE KEY-----"}',
    "https://x.blob.core.windows.net/a?sv=2022-11-02&ss=b&srt=sco&sp=r&sig=abc123",
    `Twilio ${twilioAccount} authToken=${twilioAuth}`,
  ];
  for (const sample of samples) assert.notEqual(scanContent(sample), null);
  const detected = scanSecrets(samples.join("\\n"));
  for (const id of ["stripe_live_secret_key", "gcp_service_account", "azure_sas_token", "twilio_account_sid", "twilio_auth_token"]) {
    assert.ok(detected.includes(id), `missing ${id}`);
  }
  assert.deepEqual(scanSecrets("Stripe test key sk_test_documentation_only"), []);
  assert.equal(scanContent('type: "service"'), null);
});

test("Markdown reconciliation removes SQLite orphans transactionally", () => {
  const dir = tempDir();
  const manager = new DatabaseManager(dir);
  const entry = encodeMemoryMetadata("canonical", "2026-08-01", "2026-08-09");
  reconcileMarkdownMemoryScope(manager, [entry], "memory");
  assert.equal(manager.getDb().prepare("SELECT COUNT(*) AS count FROM memories").get().count, 1);
  reconcileMarkdownMemoryScope(manager, [], "memory");
  assert.equal(manager.getDb().prepare("SELECT COUNT(*) AS count FROM memories").get().count, 0);
  manager.close();
  rmSync(dir, { recursive: true, force: true });
});

test("metadata codec preserves project metadata and malformed fallback", () => {
  const encoded = encodeMemoryMetadata("note", "2026-08-01", "2026-08-09", "my project");
  assert.deepEqual(decodeMemoryMetadata(encoded), {
    text: "note", created: "2026-08-01", lastReferenced: "2026-08-09", project: "my project",
  });
  const malformed = decodeMemoryMetadata("legacy note <!-- created=bad");
  assert.equal(malformed.text, "legacy note <!-- created=bad");
  assert.equal(malformed.created, new Date().toISOString().slice(0, 10));
});

test("memory recovery pruning retires stale recovery artifacts during a write", async () => {
  const dir = tempDir();
  const recovery = join(dir, ".MEMORY.md.recovery-1-123e4567-e89b-12d3-a456-426614174000");
  writeFileSync(recovery, "old");
  const old = new Date(Date.now() - 8 * 24 * 60 * 60 * 1000);
  utimesSync(recovery, old, old);
  const store = new MemoryStore({ memoryDir: dir, memoryCharLimit: 5000, userCharLimit: 5000, projectCharLimit: 5000 } as any);
  await store.loadFromDisk();
  assert.equal((await store.add("memory", "new entry")).success, true);
  const names = readdirSync(dir);
  assert.equal(names.some((name) => name.includes(".recovery-")), false);
  assert.equal(names.some((name) => name.includes(".retired-")), true);
  rmSync(dir, { recursive: true, force: true });
});

test("session parser finds root and project JSONL files using directory entries", () => {
  const dir = tempDir();
  mkdirSync(join(dir, "project"));
  writeFileSync(join(dir, "root.jsonl"), "{}");
  writeFileSync(join(dir, "project", "nested.jsonl"), "{}");
  writeFileSync(join(dir, "project", "ignore.txt"), "");
  assert.deepEqual(getSessionFiles(dir).sort(), [join(dir, "project", "nested.jsonl"), join(dir, "root.jsonl")].sort());
  rmSync(dir, { recursive: true, force: true });
});

test("session discovery and anchor search do not follow a symlink outside sessions root", () => {
  const dir = tempDir();
  const outside = tempDir();
  writeFileSync(join(outside, "outside.jsonl"), sessionLine("needle outside"));
  mkdirSync(join(dir, "inside"));
  const insideFile = join(dir, "inside", "inside.jsonl");
  writeFileSync(insideFile, sessionLine("needle inside"));
  symlinkSync(outside, join(dir, "escape"), "junction");

  assert.deepEqual(getSessionFiles(dir), [insideFile]);
  const result = searchSessionAnchors("all:\n- needle\n", { sessionsDir: dir });
  assert.equal(result.success, true);
  assert.equal(result.ranges.length, 1);
  assert.match(result.ranges[0].path, /inside[\\/]inside\.jsonl$/);
  rmSync(dir, { recursive: true, force: true });
  rmSync(outside, { recursive: true, force: true });
});

test("session search returns bounded snippets while preserving full content", () => {
  const dir = tempDir();
  const manager = new DatabaseManager(dir);
  const db = manager.getDb();
  db.prepare("INSERT INTO sessions (id, project, cwd, started_at, ended_at, message_count) VALUES (?, ?, ?, ?, ?, ?)").run("s1", "p", "/p", "2026-08-09", null, 1);
  const content = `${"x".repeat(500)} needle ${"y".repeat(500)}`;
  db.prepare("INSERT INTO messages (id, session_id, role, content, timestamp) VALUES (?, ?, ?, ?, ?)").run("m1", "s1", "user", content, "2026-08-09T12:00:00Z");
  const results = searchSessions(manager, "needle");
  assert.equal(results.length, 1);
  assert.equal(results[0].content, content);
  assert.ok(results[0].snippet.length < content.length);
  manager.close();
  rmSync(dir, { recursive: true, force: true });
});

test("child extension paths reject missing and non-file entries and allow external files", () => {
  const dir = tempDir();
  const extension = join(dir, "external.ts");
  writeFileSync(extension, "export default {};");
  const args = buildChildPiPromptArgs("prompt", { childExtensionPaths: [extension, join(dir, "missing"), dir] } as any);
  assert.ok(args.includes(extension));
  assert.ok(!args.includes(join(dir, "missing")));
  assert.ok(!args.includes(dir));
  rmSync(dir, { recursive: true, force: true });
});
