---
title: Secrets
---

# Secrets

Dockform leverages the battle-tested [SOPS](https://github.com/getsops/sops) tool to manage secrets in a git-friendly way.  
Currently, Dockform supports the **Age** encryption backend.

This allows you to keep sensitive values (API keys, credentials, tokens, etc.) version-controlled in encrypted form, while editing and using them seamlessly during your workflow.

## Requirements

You need both **SOPS** and **Age** installed:

- [SOPS installation guide](https://github.com/getsops/sops#installation)  
- [Age installation guide](https://github.com/FiloSottile/age#installation)

## Workflow

### 1. Create an Age key file

Generate a new Age key pair and store it locally:

```sh
$ age-keygen -o ~/.config/sops/age/keys.txt
```

### 2. Reference the key file in the manifest

Point Dockform to your Age key file inside `dockform.yaml` (directly or via environment variable interpolation):

```yaml
sops:
  age:
    key_file: ${AGE_KEY_FILE}
```

### 3. Create a new encrypted dotenv file

Use Dockform to scaffold a new secrets file:

```sh
$ dockform secrets create secrets.env
# A template encrypted dotenv file will be created
```

### 4. Edit the secrets file

Open the file securely with your `$EDITOR`. Dockform decrypts it on the fly and re-encrypts on save:

```sh
$ dockform secrets edit secrets.env
```

### 5. Use the secrets in your manifest

Reference the encrypted dotenv file inside your manifest.  
Secrets can be defined globally or scoped to a specific application.

```yaml
secrets:
  sops:
    - app/secrets.env
```

For application-specific secrets:

```yaml
applications:
  web:
    secrets:
      sops:
        - web/secrets.env
```

---

## Summary

- Secrets are stored in encrypted dotenv files managed by SOPS.  
- Age provides the encryption keys.  
- Dockform offers commands to create and edit secrets without exposing raw values.  
- Encrypted files can safely live in git repositories, while being decrypted only at runtime.  

