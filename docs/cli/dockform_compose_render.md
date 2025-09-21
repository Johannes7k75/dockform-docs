---
title: Dockform Compose Render
---

# `dockform compose render`

Render an application's docker compose config fully resolved

```
dockform compose render [application] [flags]
```

### Options

```
  -h, --help           help for render
      --mask string    Secret masking strategy: full|partial|preserve-length (default "full")
      --show-secrets   Show secrets inline (dangerous)
```

### Options inherited from parent commands

```
  -c, --config string   Path to configuration file or directory (defaults: dockform.yml, dockform.yaml, Dockform.yml, Dockform.yaml in current directory)
  -v, --verbose         Verbose error output
```

### SEE ALSO

* [dockform compose](/cli/dockform_compose)	 - Work with docker compose files for applications

