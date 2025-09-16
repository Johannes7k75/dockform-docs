---
title: Dockform Secrets
---

# `dockform secrets`

Manage SOPS secrets

```
dockform secrets [flags]
```

### Options

```
  -h, --help   help for secrets
```

### Options inherited from parent commands

```
  -c, --config string   Path to configuration file or directory (defaults: dockform.yml, dockform.yaml, Dockform.yml, Dockform.yaml in current directory)
  -v, --verbose         Verbose error output
```

### SEE ALSO

* [dockform](/docs/cli/dockform)	 - Manage Docker Compose projects declaratively
* [dockform secrets create](/docs/cli/dockform_secrets_create)	 - Create a new SOPS-encrypted dotenv file
* [dockform secrets decrypt](/docs/cli/dockform_secrets_decrypt)	 - Decrypt a SOPS-encrypted dotenv file and print to stdout
* [dockform secrets edit](/docs/cli/dockform_secrets_edit)	 - Edit a SOPS-encrypted dotenv file interactively
* [dockform secrets rekey](/docs/cli/dockform_secrets_rekey)	 - Re-encrypt all declared SOPS secret files with configured recipients

