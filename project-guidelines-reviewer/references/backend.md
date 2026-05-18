# Backend Review Prompt

Check whether the backend satisfies the approved service guidelines.

## Checks

- Approved backend stack: Python/FastAPI, Java/Spring Boot, or Go standard library.
- HTTP API service is present where backend is required.
- Service can run behind Caddy as a proxied upstream.
- Port is configurable or documented.
- Health endpoint is available.
- Application logs include or can include app identity.

## Evidence to collect

- Python: `pyproject.toml`, `requirements.txt`, `app/main.py`, FastAPI imports, uvicorn commands.
- Java: `pom.xml`, `build.gradle`, Spring Boot application class, controller files.
- Go: `go.mod`, `main.go`, `net/http` usage, router setup.
- Dockerfile, compose files, service manifests, start commands.
- `/health`, `/ready`, `/live`, or equivalent endpoints.

## Decision rules

- Mark not met if the backend framework is outside the approved set and no exception is documented.
- Mark needs clarification if a backend is described but no service entrypoint or route definitions are visible.
