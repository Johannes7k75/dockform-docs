---
title: Networks
---

# Networks

Dockform manages Docker networks declaratively through the root `networks` map.
This replaces imperative `docker network create` commands with a single source of truth in your manifest.

- **Declarative management**: define desired networks once; Dockform creates any that are missing.
- **Compose-friendly**: use Dockform-managed networks as `external` networks in `docker compose` files.
- **Idempotent**: safe to run repeatedly; only missing networks are created.

## Defining networks in the manifest

Declare top-level networks under `networks:`. Keys are the network names that will be created on the Docker host.

```yaml [dockform.yaml]
docker:
  context: default
  identifier: staging

networks:
  traefik: {}
  app_net: {}
```

- **Name rules**: keys must match `^[a-z0-9_.-]+$`.
- The value is an empty object today (reserved for future options).

## Using networks from compose

Dockform does not inject networks into compose files. Instead, you reference networks that Dockform manages as `external` in your compose files and attach services to them.

```yaml [docker-compose.yaml]
services:
  web:
    image: nginx:alpine
    networks:
      - net

networks:
  net:
    external: true
    # optional: override the actual network name if you template it
    # name: "staging-net"
```

- With `networks.net.external: true`, Docker Compose will expect a pre-existing Docker network named `net` (or the provided `name:`), which Dockform ensures exists during `apply`.
- You may use environment expansion in compose for the `name:` field if needed (e.g., `name: "df_${DOCKFORM_RUN_ID}_net").

## Lifecycle and operations

- **plan**: shows which networks will be created or removed relative to your manifest and labeled resources in the Docker context.
- **apply**:
  - Lists existing labeled networks and creates any missing ones from `networks:`.
  - Labels networks with `io.dockform.identifier=<docker.identifier>`.
  - Proceeds to run `docker compose up` for applications.
- **destroy**: discovers all labeled resources for the current identifier and removes them, including networks.

Notes:
- Dockform checks for existing networks by name; it will not duplicate or rename networks.
- Dockform only manages networks that carry the Dockform label for the active identifier.

## End-to-end example

::: code-group

```yaml [dockform.yaml]
docker:
  context: default
  identifier: staging

applications:
  app:
    root: ./app
    project:
      name: app-staging

networks:
  app-net: {}
```

```yaml [app/docker-compose.yaml]
services:
  web:
    image: nginx:alpine
    networks:
      - app-net

networks:
  app-net:
    external: true
```

:::

- Run `dockform plan` to see the pending network creations.
- Run `dockform apply` to create networks and start services.
