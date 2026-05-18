# Deployment and Configuration Review Prompt

Check whether the project is deployable with the standard Caddy/static/proxied architecture.

## Checks

- Frontend static build can be served by Caddy.
- Backend can be proxied by Caddy.
- Caddy configuration is planned or present.
- Required environment variables are documented.
- Required secrets are documented.
- Health endpoint is available.
- App name, base path, API base path, database URL, and auth header names are configured or documented.

## Evidence to collect

- `Caddyfile`, Dockerfile, compose files, deployment manifests.
- `.env.example`, README config section, Helm values, ECS/task definitions.
- Health endpoint implementation.
- Secret references and config maps.

## Decision rules

- Mark needs clarification if deployment files are absent but local start commands exist.
- Mark not met if configuration is hardcoded and cannot be changed per environment.
