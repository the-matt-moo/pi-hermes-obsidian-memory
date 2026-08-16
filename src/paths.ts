import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import { DEFAULT_PROJECTS_MEMORY_DIR } from "./constants.js";

export const AGENT_ROOT = resolveAgentRoot();

const OBSIDIAN_MEMORY_FOLDER = "pi";
const FALLBACK_GLOBAL_DIR_NAME = "pi-hermes-obsidian-memory";

export function resolveObsidianConfigPath(): string {
  const platform = process.platform;
  if (platform === "win32") {
    return path.join(process.env.APPDATA ?? path.join(os.homedir(), "AppData", "Roaming"), "obsidian", "obsidian.json");
  }
  if (platform === "darwin") {
    return path.join(os.homedir(), "Library", "Application Support", "obsidian", "obsidian.json");
  }
  return path.join(
    process.env.XDG_CONFIG_HOME ?? path.join(os.homedir(), ".config"),
    "obsidian",
    "obsidian.json",
  );
}

export function resolveObsidianVaultPath(configPath?: string): string | null {
  const obsidianConfig = configPath ?? resolveObsidianConfigPath();
  try {
    const raw = fs.readFileSync(obsidianConfig, "utf-8");
    const parsed = JSON.parse(raw) as { vaults?: Record<string, { path?: string; open?: boolean }> };
    if (!parsed.vaults || typeof parsed.vaults !== "object") return null;

    const entries = Object.values(parsed.vaults);
    const openVault = entries.find((v) => v.open && typeof v.path === "string" && v.path.trim());
    const anyVault = entries.find((v) => typeof v.path === "string" && v.path.trim());
    const vault = openVault ?? anyVault;
    if (!vault?.path) return null;

    const vaultPath = path.resolve(vault.path);
    if (!fs.existsSync(vaultPath)) return null;
    return vaultPath;
  } catch {
    return null;
  }
}

export function resolveDefaultGlobalDir(): string {
  const vaultPath = resolveObsidianVaultPath();
  if (vaultPath) {
    return path.join(vaultPath, OBSIDIAN_MEMORY_FOLDER);
  }
  return path.join(AGENT_ROOT, FALLBACK_GLOBAL_DIR_NAME);
}

export function resolveAgentRoot(env: Record<string, string | undefined> = process.env): string {
  const configured = env.PI_CODING_AGENT_DIR?.trim();
  return configured ? path.resolve(expandHome(configured)) : path.join(os.homedir(), ".pi", "agent");
}

export function expandHome(input: string): string {
  if (input === "~") return os.homedir();
  if (input.startsWith("~/") || input.startsWith("~\\")) {
    return path.join(os.homedir(), input.slice(2));
  }
  return input;
}

export function normalizeConfiguredMemoryDir(input: string): string | undefined {
  const trimmed = input.trim();
  if (!trimmed) return undefined;

  const expanded = expandHome(trimmed);
  if (path.isAbsolute(expanded)) return path.normalize(expanded);
  return path.resolve(AGENT_ROOT, expanded);
}

function isSafeRelativeDirectory(input: string): boolean {
  const segments = input.split(/[\\/]+/).filter(Boolean);
  return segments.length === 1 && segments[0] !== "." && segments[0] !== "..";
}

export function normalizeProjectsMemoryDir(input: string): string | undefined {
  const trimmed = input.trim();
  if (!trimmed) return undefined;

  const expanded = expandHome(trimmed);
  let relative = expanded;

  if (path.isAbsolute(expanded)) {
    const resolved = path.resolve(expanded);
    const relativeToAgentRoot = path.relative(AGENT_ROOT, resolved);
    if (
      relativeToAgentRoot === ""
      || relativeToAgentRoot.startsWith("..")
      || path.isAbsolute(relativeToAgentRoot)
    ) {
      return undefined;
    }
    relative = relativeToAgentRoot;
  }

  const normalized = path.normalize(relative).replace(/^[\\/]+|[\\/]+$/g, "");
  // Path-traversal guard: only a single non-dot, non-parent segment beneath
  // AGENT_ROOT is accepted; isSafeRelativeDirectory() rejects ".", "..", and
  // nested paths, so a configured value cannot escape the agent storage root.
  if (!isSafeRelativeDirectory(normalized)) return undefined;
  return normalized;
}

export function resolveProjectsRoot(projectsMemoryDir = DEFAULT_PROJECTS_MEMORY_DIR): string {
  const normalized = normalizeProjectsMemoryDir(projectsMemoryDir) ?? DEFAULT_PROJECTS_MEMORY_DIR;
  return path.join(AGENT_ROOT, normalized);
}
