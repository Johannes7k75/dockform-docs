---
title: Dockform Volume Restore
---

# `dockform volume restore`

Restore a snapshot into a Docker volume

```
dockform volume restore <volume> <snapshot-path> [--force] [--stop-containers]
```

### Description

Restores a `tar` or `tar.zst` snapshot into an existing Docker volume. By default, Dockform refuses to restore into a non-empty volume to prevent accidents; use `--force` to clear the destination first. If containers are using the target volume, you must pass `--stop-containers` or stop them yourself.

### Flags

```
      --force             Overwrite non-empty destination volume
      --stop-containers   Stop containers that are using the target volume before restore
```

### Validation

- The volume must exist in your Docker context and be present in the manifest.
- If a JSON sidecar exists, Dockform verifies the archive checksum and warns when the spec hash differs from the current volume spec.

### Examples

```bash
dockform volume restore postgres_data ./.dockform/snapshots/postgres_data/2025-09-20T17-42-05Z__spec-5e3bf4a1.tar.zst --force --stop-containers
```

### SEE ALSO

* [dockform volume](/cli/dockform_volume)


