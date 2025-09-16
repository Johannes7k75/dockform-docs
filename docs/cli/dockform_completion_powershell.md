---
title: Dockform Completion Powershell
---

# `dockform completion powershell`

Generate the autocompletion script for powershell

### Synopsis

Generate the autocompletion script for powershell.

To load completions in your current shell session:

	dockform completion powershell | Out-String | Invoke-Expression

To load completions for every new session, add the output of the above command
to your powershell profile.


```
dockform completion powershell [flags]
```

### Options

```
  -h, --help              help for powershell
      --no-descriptions   disable completion descriptions
```

### Options inherited from parent commands

```
  -c, --config string   Path to configuration file or directory (defaults: dockform.yml, dockform.yaml, Dockform.yml, Dockform.yaml in current directory)
  -v, --verbose         Verbose error output
```

### SEE ALSO

* [dockform completion](/docs/cli/dockform_completion)	 - Generate the autocompletion script for the specified shell

