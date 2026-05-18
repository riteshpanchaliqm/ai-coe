# Frontend Review Prompt

Check whether the frontend satisfies the approved UI guidelines.

## Checks

- Approved framework: React, Svelte, or Next.js.
- Static build supported.
- Build command present and practical.
- Static output directory identifiable.
- UI can be hosted under a configurable base path.
- Assets and routes are base-path aware.
- Root-relative links or asset references are avoided or configurable.

## Evidence to collect

- `package.json` dependencies and scripts.
- Framework config files such as `vite.config.*`, `next.config.*`, `svelte.config.*`.
- Router configuration.
- Environment variables controlling base path.
- References to `/assets`, `/dashboard`, `/settings`, or other root-relative paths.

## Decision rules

- Mark met only when an approved framework and static build path are visible.
- Mark base path met only when an explicit setting or framework config supports it.
- For Next.js, check whether static export is supported or whether SSR is intentionally required as an exception.
