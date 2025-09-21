---
title: Best Practices
---

# Debugging with `render`

This page shows how to use Dockform’s rendering commands to debug your configuration and Compose files.

The renderer opens a fullscreen pager in TTY (press `q` to quit, `↑`/`↓`/`PgUp`/`PgDn`/`j`/`k` to scroll) with YAML syntax highlighting, line numbers, and a header showing the file path relative to your current working directory. When output is piped or the terminal isn’t interactive, Dockform prints plain YAML instead (no ANSI codes), so you can pipe to grep, jq, or files.

## Manifest rendering

Render the manifest with environment variable interpolation applied. Any missing `${VAR}` will be replaced with an empty string and reported as a warning.

```bash
# From the directory containing your manifest
dockform manifest render

# Or specify a path (file or directory); discovery order:
# dockform.yml, dockform.yaml, Dockform.yml, Dockform.yaml
dockform manifest render -c ./path/to/dir
dockform manifest render -c ./path/to/dockform.yml
```

- **TTY behavior**: Opens a fullscreen pager with highlighted YAML and line numbers.
- **Non‑TTY behavior**: Prints plain YAML with a trailing newline; safe to pipe.
- **Warnings**: Missing environment variables used in ${VAR} are listed.

Examples:

```bash
# Pipe the interpolated manifest to a file
dockform manifest render -c ./infra > manifest.debug.yml

# Grep for resolved values
dockform manifest render | grep identifier
```

## Compose rendering

Render the fully-resolved Docker Compose configuration for a specific application as defined in your Dockform manifest. This command:

- **Loads manifest config** (project, profiles, env files, inline env, SOPS).
- **Resolves application root** and all referenced compose files.
- **Merges multiple compose files** and normalizes to a single YAML.
- **Interpolates compose-style variables**: `${VAR}`, `${VAR:-default}`, `${VAR:?err}`.
- **Respects profiles/extends/anchors** via docker compose config.
- **Masks secrets by default** in the output; opt-in to show them.

Usage:

```bash
# Render an app by name (from your manifest’s applications map)
dockform compose render myapp

# Optional flags
dockform compose render myapp --mask full            # default
dockform compose render myapp --mask partial         # keep 2+2 chars
dockform compose render myapp --mask preserve-length # same length as original
dockform compose render myapp --show-secrets         # OPT-IN: disable masking

# Respect a non-default manifest path
dockform compose render myapp -c ./envs/prod
```

- **TTY behavior**: Opens a fullscreen pager with highlighted YAML, line numbers, and a relative file title (e.g., File: apps/web/docker-compose.yml). If multiple files are merged, the title shows a suffix like (+N).
- **Non‑TTY behavior**: Prints plain YAML; safe to pipe and redirect.
- **Secret masking** (default): Values for key patterns like password, secret, token, key, apikey are masked. Use `--mask` to control the strategy or `--show-secrets` to disable masking entirely.

Examples:

```bash
# Save the fully-resolved compose to inspect diffs
dockform compose render api > compose.debug.yml

# Preview with partial masking
dockform compose render api --mask partial | less -R

# Force showing secrets (e.g., in CI logs avoid using this)
dockform compose render api --show-secrets
```

:::: warning

Avoid rendering secrets. Only use `--show-secrets` when absolutely necessary, and never redirect unmasked output to plain text files (e.g., `compose.debug.yml`). Prefer masked output or secure secret handling to reduce exposure risk.

::::

## Tips

- If the pager opens, press q to exit. Use ? inside some terminals for key hints.
- Titles display relative paths from your current working directory for quick orientation.
- For troubleshooting docker compose config errors, try:
  - `docker compose -f <file> config`
  - `docker compose config --quiet`

## When to use which

- **manifest render**: Verify that environment interpolation and manifest structure are correct (before planning/applying).
- **compose render**: Inspect exactly what Docker Compose will see for a specific app after all merges, profiles, and variables are resolved.



