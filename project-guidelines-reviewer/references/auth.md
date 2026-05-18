# Authentication and Authorization Review Prompt

Check whether the project relies on Google authentication via Caddy Proxy and trusted headers.

## Checks

- Authentication is expected through Caddy Proxy.
- Application reads `X-Token-User-Email` for authenticated identity.
- Application reads `X-Token-User-Name` for display name when needed.
- Application does not trust these headers outside the approved proxy path.
- Authorization rules are defined where required.
- Unauthenticated backend routes are intentionally limited to health/static/public endpoints.

## Evidence to collect

- Middleware, request context, auth utilities, dependency injection, filters, interceptors.
- Header reads for `X-Token-User-Email` and `X-Token-User-Name`.
- Caddyfile or deployment route applying auth.
- Role or permission checks.
- Public route allowlists.

## Decision rules

- Mark met only when the trusted headers are read or the app explicitly documents proxy-only authentication.
- Mark needs clarification if the app has its own OAuth flow or local auth alongside Caddy auth.
- Mark not met if the app accepts caller-supplied identity headers directly on an exposed backend.
