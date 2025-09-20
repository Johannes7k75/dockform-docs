---
title: Dockform Volume Snapshot
---

# `dockform volume snapshot`

Create a snapshot of a Docker volume to local storage

```
dockform volume snapshot <volume> [--output DIR] [--note NOTE]
```

### Description

Snapshots are created by launching a tiny helper container that mounts the volume read-only and streams a `tar` archive back to your machine via stdout. The archive is compressed with `zstd` by default and saved next to your manifest, along with a JSON sidecar containing metadata for validation and restore.

### Flags

```
  -o, --output DIR   Output directory for snapshots (default: ./.dockform/snapshots)
      --note string  Optional note to include in metadata
```

### File layout

```
.dockform/
  snapshots/
    <volume-name>/
      <timestamp>__spec-<8chars>.tar.zst
      <timestamp>__spec-<8chars>.json
```

Where `spec-<8chars>` is a short hash of the volume spec (driver, options, labels) so you can see at a glance which snapshot matches the current desired spec.

### Metadata JSON

```json
{
  "dockform_version": "0.3.0",
  "created_at": "2025-09-20T17:42:05Z",
  "volume_name": "postgres_data",
  "spec_hash": "5e3bf4a1",
  "driver": "local",
  "driver_opts": {"o": "uid=999,gid=999"},
  "labels": {"io.dockform.identifier": "myapp"},
  "uncompressed_bytes": 1243920384,
  "file_count": 15234,
  "checksum": {"algo": "sha256", "tar_zst": "…"},
  "notes": "Auto-snapshot before recreate"
}
```

### Notes

- Works for local and remote Docker contexts; the stream is returned to your client.
- Uses numeric owners and preserves xattrs/ACLs when available.

### SEE ALSO

* [dockform volume](/cli/dockform_volume)


