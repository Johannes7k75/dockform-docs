---
title: Dockform Volume Restore
---

# `dockform volume restore`

Restore a snapshot into a Docker volume

```
dockform volume restore <volume> <snapshot-path> [flags]
```

### Options

```
      --force             Overwrite non-empty destination volume
  -h, --help              help for restore
      --stop-containers   Stop containers using the target volume before restore
```

### Options inherited from parent commands

```
  -c, --config string   Path to configuration file or directory (defaults: dockform.yml, dockform.yaml, Dockform.yml, Dockform.yaml in current directory)
  -v, --verbose         Verbose error output
```

### SEE ALSO

* [dockform volume](/cli/dockform_volume)	 - Manage Docker volumes (snapshots, restore)

