---
title: Debugging & Troubleshooting
---

# Debugging & Troubleshooting

This page covers Dockform's debugging and troubleshooting tools to help you identify and resolve configuration issues, environment problems, and deployment failures.

Dockform provides several diagnostic commands to help you understand what's happening in your setup:

- **Environment validation** - Check your system setup and dependencies
- **Configuration inspection** - Examine how your manifest is processed and resolved
- **Compose debugging** - See exactly what Docker Compose receives after all processing

## Overview of debugging tools

| Command | Purpose | When to use |
|---------|---------|-------------|
| `dockform doctor` | Environment health check | Setup validation, troubleshooting failures |
| `dockform manifest render` | Inspect processed manifest | Debug environment interpolation, validate structure |
| `dockform compose render` | View resolved Compose config | Debug application-specific issues, inspect final output |

## Environment validation with `doctor`

::: info Upcoming Feature
The `dockform doctor` command is currently in development on the [`feat/doctor` branch](https://github.com/gcstr/dockform/tree/feat/doctor) and will be available in a future release.
:::

The `dockform doctor` command performs comprehensive environment and configuration checks to ensure your system is properly set up for Dockform operations. This diagnostic tool helps identify and troubleshoot common setup issues before they cause problems during deployment.

```bash [shell ~vscode-icons:file-type-shell~]
# Run comprehensive environment diagnostics
$ dockform doctor

# Run with verbose output for detailed information
$ dockform doctor -v

# Check specific configuration file
$ dockform doctor -c ./path/to/dockform.yml
```

### What it checks

The doctor command performs a comprehensive health check of your Dockform environment. It validates that Docker and Docker Compose are accessible, checks for required dependencies like SOPS and encryption backends (Age/GnuPG), verifies your manifest configuration and file structure, and tests Docker permissions for network and volume operations. The command provides clear pass/warn/fail status for each check, helping you quickly identify and resolve setup issues before they impact your deployments.

### Example output


<<< @/more/doctor.ansi

### Integration with workflows

The doctor command is designed to be used:

- **Before deployment**: Run `dockform doctor` before `plan` or `apply` to catch issues early
- **In CI/CD pipelines**: Add as a validation step to ensure environment consistency
- **During troubleshooting**: When Dockform operations fail unexpectedly
- **After environment changes**: When updating Docker, SOPS, or key configurations

### CI/CD usage

In CI environments, use doctor to validate your setup:

```yaml [workflow.yaml]
- name: Validate Dockform environment
  run: dockform doctor -v
  env:
    AGE_KEY_FILE: /tmp/age-key.txt
```

The command exits with a non-zero status code if critical errors are found, making it suitable for CI pipeline gates.

## Configuration inspection

### Manifest rendering

Render the manifest with environment variable interpolation applied. Any missing `${VAR}` will be replaced with an empty string and reported as a warning.

```bash [shell ~vscode-icons:file-type-shell~]
# From the directory containing your manifest
$ dockform manifest render

# Or specify a path (file or directory); discovery order:
# dockform.yml, dockform.yaml, Dockform.yml, Dockform.yaml
$ dockform manifest render -c ./path/to/dir
$ dockform manifest render -c ./path/to/dockform.yml
```

- **TTY behavior**: Opens a fullscreen pager with highlighted YAML and line numbers.
- **Non‑TTY behavior**: Prints plain YAML with a trailing newline; safe to pipe.
- **Warnings**: Missing environment variables used in ${VAR} are listed.

Examples:

```bash [shell ~vscode-icons:file-type-shell~]
# Pipe the interpolated manifest to a file
$ dockform manifest render -c ./infra > manifest.debug.yml

# Grep for resolved values
$ dockform manifest render | grep identifier
```

### Compose rendering

Render the fully-resolved Docker Compose configuration for a specific application as defined in your Dockform manifest. This command:

- **Loads manifest config** (project, profiles, env files, inline env, SOPS).
- **Resolves application root** and all referenced compose files.
- **Merges multiple compose files** and normalizes to a single YAML.
- **Interpolates compose-style variables**: `${VAR}`, `${VAR:-default}`, `${VAR:?err}`.
- **Respects profiles/extends/anchors** via docker compose config.
- **Masks secrets by default** in the output; opt-in to show them.

Usage:

```bash [shell ~vscode-icons:file-type-shell~]
# Render an app by name (from your manifest’s applications map)
$ dockform compose render myapp

# Optional flags
$ dockform compose render myapp --mask full            # default
$ dockform compose render myapp --mask partial         # keep 2+2 chars
$ dockform compose render myapp --mask preserve-length # same length as original
$ dockform compose render myapp --show-secrets         # OPT-IN: disable masking

# Respect a non-default manifest path
$ dockform compose render myapp -c ./envs/prod
```

- **TTY behavior**: Opens a fullscreen pager with highlighted YAML, line numbers, and a relative file title (e.g., File: apps/web/docker-compose.yml). If multiple files are merged, the title shows a suffix like (+N).
- **Non‑TTY behavior**: Prints plain YAML; safe to pipe and redirect.
- **Secret masking** (default): Values for key patterns like password, secret, token, key, apikey are masked. Use `--mask` to control the strategy or `--show-secrets` to disable masking entirely.

Examples:

```bash [shell ~vscode-icons:file-type-shell~]
# Save the fully-resolved compose to inspect diffs
$ dockform compose render api > compose.debug.yml

# Preview with partial masking
$ dockform compose render api --mask partial | less -R

# Force showing secrets (e.g., in CI logs avoid using this)
$ dockform compose render api --show-secrets
```

::: warning

Avoid rendering secrets. Only use `--show-secrets` when absolutely necessary, and never redirect unmasked output to plain text files (e.g., `compose.debug.yml`). Prefer masked output or secure secret handling to reduce exposure risk.

:::

## Rendering behavior

Both `manifest render` and `compose render` commands share common behavior patterns:

### TTY vs Non-TTY output

- **TTY behavior**: Opens a fullscreen pager with YAML syntax highlighting, line numbers, and a header showing the file path relative to your current working directory. Press `q` to quit, `↑`/`↓`/`PgUp`/`PgDn`/`j`/`k` to scroll.
- **Non-TTY behavior**: Prints plain YAML with a trailing newline (no ANSI codes), safe to pipe to grep, jq, or redirect to files.

### Tips for effective debugging

- **Pager navigation**: If the pager opens, press `q` to exit. Use `?` inside some terminals for key hints.
- **File orientation**: Titles display relative paths from your current working directory for quick orientation.
- **Pipeline-friendly**: All render commands work well with standard Unix tools:
  ```bash
  # Search for specific values
  $ dockform manifest render | grep identifier
  
  # Save for inspection
  $ dockform compose render api > debug-compose.yml
  
  # Process with jq (if converted to JSON)
  $ dockform manifest render | yq eval -o=json | jq '.applications'
  ```

## Additional troubleshooting

### Docker Compose issues

For troubleshooting docker compose config errors independently:
- `docker compose -f <file> config` - validate and resolve a specific Compose file
- `docker compose config --quiet` - suppress warnings during validation

## Quick reference

### When to use which tool

| Scenario | Recommended command | Purpose |
|----------|-------------------|---------|
| **Initial setup** | `dockform doctor` | Validate environment and dependencies |
| **Configuration not working** | `dockform manifest render` | Check environment interpolation and structure |
| **App-specific issues** | `dockform compose render <app>` | Inspect final Compose configuration |
| **Secrets not loading** | `dockform doctor` + `dockform compose render --show-secrets` | Validate SOPS setup and check secret injection |
| **Environment variables missing** | `dockform manifest render` | See which variables are unresolved |
| **Compose syntax errors** | `docker compose -f <file> config` | Validate raw Compose files |

### Common debugging workflow

1. **Start with environment validation**: `dockform doctor` to ensure all dependencies are properly configured
2. **Check manifest processing**: `dockform manifest render` to verify environment interpolation
3. **Inspect application config**: `dockform compose render <app>` to see the final configuration
4. **Test deployment**: `dockform plan` to preview changes before applying

This systematic approach helps identify issues at each layer of Dockform's processing pipeline.
