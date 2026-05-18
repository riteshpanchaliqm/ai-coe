# API and UI Path Review Prompt

Check whether API and UI paths can safely coexist on shared domains.

## API checks

- API has a unique base path.
- API follows `/api/v<version>/<app-name>/...`.
- API path includes application name.
- API avoids generic shared paths such as `/api/users`, `/api/items`, or `/api/data`.
- API versioning is defined.

## UI checks

- UI base path is configurable.
- UI can run on a dedicated subdomain.
- UI can run under shared paths such as `tools.iqm.services/<app-name>`.
- UI assets and navigation work under the configured base path.

## Evidence to collect

- Backend router/controller prefixes.
- FastAPI `APIRouter(prefix=...)`, Spring `@RequestMapping`, Go route registration.
- Frontend router basename/base config.
- Environment variables: `APP_NAME`, `BASE_PATH`, `API_BASE_PATH`, `PUBLIC_BASE_PATH`, `NEXT_PUBLIC_*`.
- Caddy route or reverse proxy paths.

## Decision rules

- Mark API compliant only if both version and app name appear in the base path.
- Mark not met for unscoped `/api` usage unless an exception is documented.
