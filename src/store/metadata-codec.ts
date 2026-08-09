export interface MemoryMetadata {
  text: string;
  created: string;
  lastReferenced: string;
  project: string | null;
}

const METADATA_PATTERN = /^(.*?)\s*<!--\s*created=([^,]+),\s*last=([^,>]+)(?:,\s*project64=([A-Za-z0-9_-]+))?\s*-->\s*$/;

function today(): string {
  return new Date().toISOString().split("T")[0];
}

export function encodeMemoryMetadata(
  text: string,
  created: string,
  lastReferenced: string,
  project?: string,
): string {
  const projectMetadata = project?.trim()
    ? `, project64=${Buffer.from(project.trim(), "utf-8").toString("base64url")}`
    : "";
  return `${text} <!-- created=${created}, last=${lastReferenced}${projectMetadata} -->`;
}

/** Decode metadata, retaining the legacy today's-date fallback for malformed entries. */
export function decodeMemoryMetadata(raw: string): MemoryMetadata {
  const match = raw.match(METADATA_PATTERN);
  if (match) {
    let project: string | null = null;
    if (match[4]) {
      try { project = Buffer.from(match[4], "base64url").toString("utf-8").trim() || null; } catch {}
    }
    return {
      text: match[1].trim(),
      created: match[2].trim(),
      lastReferenced: match[3].trim(),
      project,
    };
  }

  const fallback = today();
  return { text: raw.trim(), created: fallback, lastReferenced: fallback, project: null };
}
