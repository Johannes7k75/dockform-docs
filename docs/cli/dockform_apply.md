---
title: Dockform Apply
---

# `dockform apply`

Apply the desired state

```
dockform apply [flags]
```

### Options

```
  -h, --help                help for apply
      --sequential          Use sequential processing instead of the default parallel processing (slower but uses less CPU and Docker daemon resources)
      --skip-confirmation   Skip confirmation prompt and apply immediately
```

### Options inherited from parent commands

```
  -c, --config string   Path to configuration file or directory (defaults: dockform.yml, dockform.yaml, Dockform.yml, Dockform.yaml in current directory)
  -v, --verbose         Verbose error output
```

### SEE ALSO

* [dockform](/docs/cli/dockform)	 - Manage Docker Compose projects declaratively

