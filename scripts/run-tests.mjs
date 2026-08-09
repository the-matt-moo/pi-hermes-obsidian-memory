import { readdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const testDir = fileURLToPath(new URL("../tests/", import.meta.url));
const files = readdirSync(testDir)
  .filter((name) => name.endsWith(".test.ts"))
  .map((name) => join(testDir, name));
const result = spawnSync(process.execPath, ["--import", "tsx", "--test", ...files], { stdio: "inherit" });
process.exit(result.status ?? 1);
