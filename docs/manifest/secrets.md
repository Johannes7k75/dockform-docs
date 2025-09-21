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

```sh [shell ~vscode-icons:file-type-shell~]
$ age-keygen -o ~/.config/sops/age/keys.txt
```

### 2. Reference the key file in the manifest

Point Dockform to your Age key file inside `dockform.yaml` (directly or via environment variable interpolation):

```yaml [dockform.yaml]
sops:
  age:
    key_file: ${AGE_KEY_FILE}
```

### 3. Create a new encrypted dotenv file

Use Dockform to scaffold a new secrets file:

```sh [shell ~vscode-icons:file-type-shell~]
$ dockform secrets create secrets.env
# A template encrypted dotenv file will be created
```

### 4. Edit the secrets file

Open the file securely with your `$EDITOR`. Dockform decrypts it on the fly and re-encrypts on save:

```sh [shell ~vscode-icons:file-type-shell~]
$ dockform secrets edit secrets.env
```

### 5. Use the secrets in your manifest

Reference the encrypted dotenv file inside your manifest.  
Secrets can be defined globally or scoped to a specific application.

```yaml [dockform.yaml]
secrets:
  sops:
    - app/secrets.env
```

For application-specific secrets:

```yaml [dockform.yaml]
applications:
  web:
    secrets:
      sops:
        - web/secrets.env
```

## Using secrets without SOPS (CI-managed)

If you prefer not to use SOPS, you can manage sensitive values via your CI/CD system’s secret store (e.g., GitHub Actions). Provide secrets as environment variables at runtime and reference them from Compose or the manifest.

- Set CI environment variables from your secret store.
- Add them to Dockform `environment.inline` to ensure Compose receives them during planning and apply.

::: code-group

```yaml [dockform.yaml]
docker:
  context: default
  identifier: production

environment:
  inline:
    # These values are interpolated from CI-provided env vars at load time
    - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
    - OIDC_CLIENT_SECRET=${OIDC_CLIENT_SECRET}

applications:
  app:
    root: ./app
    files: [docker-compose.yaml]
```

```yaml [app/docker-compose.yaml]
services:
  api:
    image: ghcr.io/example/api:latest
    environment:
      # Compose reads values from the process environment (provided by CI or Dockform inline env)
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      OIDC_CLIENT_SECRET: ${OIDC_CLIENT_SECRET}
```

```yaml [ .github/workflows/deploy.yml ]
name: Deploy
on:
  workflow_dispatch:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    env:
      # Provide secrets from GitHub Actions to the process environment
      POSTGRES_PASSWORD: ${{ secrets.POSTGRES_PASSWORD }}
      OIDC_CLIENT_SECRET: ${{ secrets.OIDC_CLIENT_SECRET }}
      # Optional: set a stable run identifier for scoping
      DOCKFORM_RUN_ID: production
    steps:
      - uses: actions/checkout@v4

      - name: Install Dockform
        run: |
          curl -L https://github.com/gcstr/dockform/releases/latest/download/dockform_linux_amd64 -o dockform
          chmod +x dockform
          sudo mv dockform /usr/local/bin/dockform

      - name: Plan
        run: dockform plan -c .

      - name: Apply
        run: dockform apply -c .
```

:::

Notes:
- Environment variable interpolation (`${VAR}`) in `dockform.yaml` occurs at load time using the runner’s environment.
- You can mix CI-managed env vars with SOPS-managed secrets if needed.
