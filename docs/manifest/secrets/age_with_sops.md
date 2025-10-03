---
title: Age with SOPS
---

# Age with SOPS

Dockform supports encrypting secrets with SOPS using the **Age** backend, in addition to **PGP (GnuPG)**. Age is a modern, simple file encryption tool designed to be easy to use and secure by default. This page explains configuration, workflows, CI patterns, and troubleshooting.

## Prerequisites

- `sops` installed
- `age` installed for the Age backend
- An Age key file containing your private key (and corresponding public key for encryption)

::: tip

Run `dockform doctor` to confirm:
- SOPS presence
- Age installation and availability

:::

## Configuration

Define Age options under `sops.age`:

```yaml [dockform.yaml]
sops:
  age:
    key_file: ${AGE_KEY_FILE}      # path to your Age private key file
    recipients: ["age1..."]        # optional; Age public keys
```

You can combine with PGP recipients:

```yaml [dockform.yaml]
sops:
  age:
    key_file: ${AGE_KEY_FILE}
    recipients: ["age1ql3z7hjy54pw3hyww5ayyfg7zqgvc7w3j2elw8zmrj2kg5sfn9aqmcac8p"]
  pgp:
    keyring_dir: "~/.gnupg"
    recipients: ["0xFPR..."]
```

Dockform passes both sets to SOPS: `--age=<list>` and `--pgp=<list>`.

## Key Management

### Configuration Options

- **`key_file`**: Path to your Age private key file. Supports environment variable interpolation.
- **`recipients`**: Array of Age public keys (starting with `age1`). Optional when `key_file` is provided - Dockform can derive the public key from the private key file.

::: tip Key Derivation

If you only specify `key_file` and leave `recipients` empty, Dockform automatically derives the public key from your private key file. This is convenient for single-user setups.

:::

## Workflow

### 1. Generate an Age key pair

Create a new Age key pair and store it securely:

```sh
$ age-keygen -o ~/.config/sops/age/keys.txt
Public key: age1ql3z7hjy54pw3hyww5ayyfg7zqgvc7w3j2elw8zmrj2kg5sfn9aqmcac8p
```

The output shows your public key, which you can share with others who need to encrypt files for you.

### 2. Configure the manifest

Point Dockform to your Age key file in `dockform.yaml`:

```yaml [dockform.yaml]
sops:
  age:
    key_file: ${AGE_KEY_FILE}
```

Set the environment variable:

```sh
$ export AGE_KEY_FILE=~/.config/sops/age/keys.txt
```

### 3. Create encrypted secrets

Use Dockform to create a new encrypted dotenv file:

```sh
$ dockform secrets create secrets.env
# A template encrypted dotenv file will be created
```

### 4. Edit secrets

Open and edit the encrypted file securely:

```sh
$ dockform secrets edit secrets.env
```

Dockform decrypts the file temporarily, opens it in your `$EDITOR`, then re-encrypts it when you save and exit.

## Commands

All standard Dockform secrets commands work with Age:

- **Create**: `dockform secrets create secrets.env`
- **Edit**: `dockform secrets edit secrets.env`
- **Decrypt**: `dockform secrets decrypt secrets.env`
- **Rekey**: `dockform secrets rekey`

All commands honor `sops.age.*` settings from your manifest.

## Multi-recipient Encryption

For team environments, you can encrypt files for multiple Age recipients:

```yaml [dockform.yaml]
sops:
  age:
    key_file: ${AGE_KEY_FILE}
    recipients:
      - age1ql3z7hjy54pw3hyww5ayyfg7zqgvc7w3j2elw8zmrj2kg5sfn9aqmcac8p  # Alice
      - age1lggyhqrw2nlhcxprm67z43rta9q6mzraxqzncsx8xr524wgx5uxqzd7zt2  # Bob
      - age1pf8ulhqsqpcy2auq0q6t2qr9pxt2hr3h4aq7qr9pxt2hr3h4aq7qr9pxt2  # CI system
```

When you run `dockform secrets create` or `dockform secrets rekey`, files will be encrypted for all specified recipients.

## CI and Headless Usage

Age works seamlessly in CI environments without additional configuration. Simply provide the private key file:

### GitHub Actions Example

```yaml [workflow.yaml]
name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Age key
        run: |
          mkdir -p ~/.config/sops/age
          echo "${{ secrets.AGE_PRIVATE_KEY }}" > ~/.config/sops/age/keys.txt
          chmod 600 ~/.config/sops/age/keys.txt
        
      - name: Install tools
        run: |
          # Install Age
          curl -L https://github.com/FiloSottile/age/releases/latest/download/age-v1.1.1-linux-amd64.tar.gz | tar xz
          sudo mv age/age* /usr/local/bin/
          
          # Install SOPS
          curl -L https://github.com/getsops/sops/releases/latest/download/sops-v3.8.1.linux.amd64 -o sops
          chmod +x sops && sudo mv sops /usr/local/bin/
          
          # Install Dockform
          curl -L https://github.com/gcstr/dockform/releases/latest/download/dockform_linux_amd64 -o dockform
          chmod +x dockform && sudo mv dockform /usr/local/bin/

      - name: Deploy
        env:
          AGE_KEY_FILE: ~/.config/sops/age/keys.txt
        run: |
          dockform apply --skip-confirmation
```

## Team Collaboration

### Sharing Public Keys

Age public keys are safe to share and can be committed to your repository:

```yaml
# dockform.yaml - safe to commit
sops:
  age:
    key_file: ${AGE_KEY_FILE}  # private, via env var
    recipients:
      - age1ql3z7hjy54pw3hyww5ayyfg7zqgvc7w3j2elw8zmrj2kg5sfn9aqmcac8p  # alice@company.com
      - age1lggyhqrw2nlhcxprm67z43rta9q6mzraxqzncsx8xr524wgx5uxqzd7zt2  # bob@company.com
      - age1pf8ulhqsqpcy2auq0q6t2qr9pxt2hr3h4aq7qr9pxt2hr3h4aq7qr9pxt2  # ci-system
```

### Adding New Team Members

1. New team member generates their Age key pair:
   ```sh
   $ age-keygen -o ~/.config/sops/age/keys.txt
   ```

2. They share their public key (the `age1...` string)

3. Add their public key to the `recipients` list in `dockform.yaml`

4. Rekey existing secrets to include the new recipient:
   ```sh
   $ dockform secrets rekey
   ```

## Migrating from deprecated `sops.recipients`

::: warning Deprecation

Top-level `sops.recipients` is deprecated. Move entries to one of:
- `sops.age.recipients` (must start with `age1`)
- `sops.pgp.recipients` (fingerprint, keyid, or UID/email)

:::

**Before:**
```yaml
sops:
  recipients:
    - age1ql3z7hjy54pw3hyww5ayyfg7zqgvc7w3j2elw8zmrj2kg5sfn9aqmcac8p
```

**After:**
```yaml
sops:
  age:
    key_file: ${AGE_KEY_FILE}
    recipients:
      - age1ql3z7hjy54pw3hyww5ayyfg7zqgvc7w3j2elw8zmrj2kg5sfn9aqmcac8p
```

## Troubleshooting

### Common Issues

- **Age not found**: Install Age from [GitHub releases](https://github.com/FiloSottile/age/releases) or your package manager.
- **Key file not found**: Verify the `AGE_KEY_FILE` environment variable points to your private key file.
- **Permission denied**: Ensure your Age key file has appropriate permissions (`chmod 600`).
- **Invalid recipients**: Age public keys must start with `age1`. Dockform validates this before calling SOPS.
- **SOPS errors**: Run `dockform doctor` to verify SOPS installation and configuration.

### Key File Format

Age private key files should contain a single private key:

```
# created: 2023-01-01T00:00:00Z
# public key: age1ql3z7hjy54pw3hyww5ayyfg7zqgvc7w3j2elw8zmrj2kg5sfn9aqmcac8p
AGE-SECRET-KEY-1GXUZ4GQPQG7ZQGQG7ZQGQG7ZQGQG7ZQGQG7ZQGQG7ZQGQG7ZQGQG7ZQGQG7Z
```

### Debugging SOPS Integration

To debug SOPS operations, you can run SOPS directly:

```sh
# Test decryption
$ SOPS_AGE_KEY_FILE=${AGE_KEY_FILE} sops -d secrets.env

# Test encryption
$ echo "TEST_VAR=value" | SOPS_AGE_KEY_FILE=${AGE_KEY_FILE} sops -e --age age1ql3z... /dev/stdin
```

## Security Considerations

- **Private key protection**: Keep your Age private key file secure and never commit it to version control.
- **Key rotation**: Regularly rotate Age keys, especially in team environments.
- **Backup keys**: Store backup copies of your Age private key in a secure location.
- **CI security**: Use your CI system's secret management for storing Age private keys.
- **File permissions**: Set restrictive permissions on key files (`chmod 600`).
- **Encrypted files only**: Never commit plaintext secrets - always use encrypted `.env` files.

## Comparison with PGP

| Feature | Age | PGP |
|---------|-----|-----|
| Setup complexity | Simple | Complex |
| Key management | File-based | Keyring-based |
| CI integration | Native | Requires agent setup |
| Key size | Compact | Large |
| Dependencies | Minimal | GnuPG ecosystem |
| Learning curve | Gentle | Steep |
| Team collaboration | Easy key sharing | Complex key distribution |

Age is recommended for new projects and teams that prioritize simplicity and modern cryptography.
