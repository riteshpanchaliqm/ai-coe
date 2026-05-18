# Domain and Hosting Review Prompt

Check whether the proposed domain family and hosting model fit the guideline.

## Checks

- Internal or POC apps use `*.iqm.services`.
- Client-facing apps use `*.iqm.com`.
- AI or workflow apps use `*.iqm.ai`.
- Shared domains such as `tools.iqm.services` or `apps.iqm.services` are supported with unique API and UI paths.
- Application can coexist safely with other apps on shared domains.

## Evidence to collect

- Proposal or README domain target.
- Caddy routes, environment variables, deployment manifests.
- App name and path scoping.

## Decision rules

- Mark needs clarification if the codebase does not identify intended domain or app type.
- Mark not met if the selected domain conflicts with the stated app type and no exception is documented.
