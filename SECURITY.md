# Security

This extension treats local configuration, including `childExtensionPaths`, as trusted executable configuration. Paths are resolved and validated; missing and non-file entries are ignored, and valid external extensions are allowed with a warning.

Memory Markdown and the SQLite mirror are stored under the configured memory directory and agent storage root. Markdown remains canonical; SQLite reconciliation is transactional per affected scope, and startup/full sync repairs a failed mirror update.

The content scanner is defense-in-depth against prompt injection and accidental credential persistence, not a secrets manager. Do not store credentials in memory or configuration; use environment variables or a secrets manager.

Session-anchor discovery canonicalizes the sessions root and skips symlink targets outside it. Do not rely on this policy as a substitute for filesystem permissions.

When reporting security issues, do not include secret values. Provide the affected version, platform, minimal reproduction, and redacted paths or samples.
