---
title: CLI Reference
---

# CLI Reference

This page documents the Dockform command-line interface. 

## Global Options

| Flag             | Default | Description                                                                                                          |
| ---------------- | ------- | -------------------------------------------------------------------------------------------------------------------- |
| `--verbose` `-v` | `false`  | Verbose error output                                                                                                |
| `--config` `-c`  | `""`     | Path to configuration file or directory (default: dockform.yaml, Dockform.yml, Dockform.yaml in current directory) |

## Command Tree

Use `dockform --help` for detailed usage:

```
$ dockform --help
Manage Docker Compose projects declaratively

Usage:
  dockform [command]

Available Commands:
  apply       Apply the desired state
  completion  Generate the autocompletion script for the specified shell
  destroy     Destroy all managed resources
  filesets    Fileset-only operations
  help        Help about any command
  init        Create a template dockform.yml configuration file
  manifest    Work with the manifest file
  plan        Show the plan to reach the desired state
  secrets     Manage SOPS secrets
  validate    Validate configuration and environment

Flags:
  -c, --config string   Path to configuration file or directory (defaults: dockform.yml, dockform.yaml, Dockform.yml, Dockform.yaml in current directory)
  -h, --help            help for dockform
  -v, --verbose         Verbose error output
      --version         version for dockform

Use "dockform [command] --help" for more information about a command.


Project home: https://github.com/gcstr/dockform
```

## Commands

### `apply`

Apply the desired state

**Usage**

```bash
dockform apply
```

**Options**

| Flag                  | Type | Default | Description                                    |
| --------------------- | ---- | ------- | ---------------------------------------------- |
| `--skip-confirmation` | Bool | `false` | Skip confirmation prompt and apply immediately |

### `filesets`

**Usage**

```bash
dockform filesets
```

### `apply`

Apply fileset diffs only

**Usage**

```bash
dockform filesets apply
```

### `init [directory]`

Create a template dockform.yml configuration file

**Usage**

```bash
dockform init [directory]
```

### `manifest`

Work with the manifest file

**Usage**

```bash
dockform manifest
```

### `render`

Render the manifest with environment variables interpolated

**Usage**

```bash
dockform manifest render
```

### `plan`

Show the plan to reach the desired state

**Usage**

```bash
dockform plan
```

**Options**

| Flag         | Type | Default | Description                                                                                |
| ------------ | ---- | ------- | ------------------------------------------------------------------------------------------ |
| `--parallel` | Bool | `false` | Enable parallel processing for faster planning (uses more CPU and Docker daemon resources) |

### `secrets`

Manage SOPS secrets

**Usage**

```bash
dockform secrets
```

### `create <path>`

Create a new SOPS-encrypted dotenv file

**Usage**

```bash
dockform secrets create <path>
```

### `decrypt <path>`

Decrypt a SOPS-encrypted dotenv file and print to stdout

**Usage**

```bash
dockform secrets decrypt <path>
```

### `edit <path>`

Edit a SOPS-encrypted dotenv file interactively

**Usage**

```bash
dockform secrets edit <path>
```

### `rekey`

Re-encrypt all declared SOPS secret files with configured recipients

**Usage**

```bash
dockform secrets rekey
```

### `validate`

Validate configuration and environment

**Usage**

```bash
dockform validate
```

