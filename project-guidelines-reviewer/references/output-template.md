# [Project Name] Approval Checklist Review

## Review Summary

**Project name:** [name or needs clarification]  
**Repository / source:** [repo, upload, or description]  
**Reviewer:** ChatGPT using project-guidelines-reviewer  
**Review date:** [date]  
**Overall recommendation:** [Approve / Approve with comments / Reject / Needs more information]

## Committee Decision

- [ ] Approved
- [ ] Approved with comments
- [ ] Rejected

## Committee Comments

```text

```

## Pre-Filled Approval Checklist

### Project Information

- [ ] Project name provided — [comment]
- [ ] Application owner identified — [comment]
- [ ] Target domain identified — [comment]
- [ ] Deployment environment identified — [comment]

### Technology Stack

- [ ] Frontend uses an approved framework: React, Svelte, or Next.js — [comment]
- [ ] Frontend supports static build — [comment]
- [ ] Backend uses an approved stack: FastAPI, Spring Boot, or Go stdlib — [comment]
- [ ] Backend is deployable behind Caddy — [comment]

### AI-Assisted Development Tools

- [ ] AI-assisted development tools are disclosed, if used — [comment]
- [ ] Expected AI development tool usage is documented — [comment]
- [ ] Generated code review controls are documented — [comment]

### Runtime AI Capabilities

- [ ] Runtime AI capabilities are disclosed, if required — [comment]
- [ ] LLM provider or model platform is documented, if applicable — [comment]
- [ ] RAG, embeddings, or vector search needs are documented, if applicable — [comment]
- [ ] Vector database requirement is documented, if applicable — [comment]
- [ ] Data sent to AI providers is classified and reviewed, if applicable — [comment]

### Database

- [ ] Application uses PostgreSQL where persistence is required — [comment]
- [ ] Application is compatible with RDS-hosted PostgreSQL — [comment]
- [ ] Database connection is environment-configured — [comment]
- [ ] Schema migration approach is defined — [comment]

### Authentication

- [ ] Authentication is handled through Google via Caddy Proxy — [comment]
- [ ] Application uses `X-Token-User-Email` for authenticated user identity — [comment]
- [ ] Application uses `X-Token-User-Name` for display name where required — [comment]
- [ ] Application does not trust auth headers outside the approved proxy path — [comment]
- [ ] Authorization rules are defined where required — [comment]

### Domain and Hosting

- [ ] Internal or POC application uses `*.iqm.services` — [comment]
- [ ] Client-facing application uses `*.iqm.com` — [comment]
- [ ] AI or workflow application uses `*.iqm.ai` — [comment]
- [ ] Shared domain usage has been identified if applicable — [comment]
- [ ] Application can coexist with other apps on shared domains — [comment]

### API Path

- [ ] API has a unique base path — [comment]
- [ ] API path follows `/api/v<version>/<app-name>/...` — [comment]
- [ ] API path includes the application name — [comment]
- [ ] API does not use a generic shared path such as `/api/users` or `/api/data` — [comment]
- [ ] API versioning approach is defined — [comment]

### UI Path

- [ ] UI supports configurable base path — [comment]
- [ ] UI can run on a dedicated subdomain — [comment]
- [ ] UI can run under a shared domain path — [comment]
- [ ] UI does not hardcode root-relative routes — [comment]
- [ ] UI asset paths work with configured base path — [comment]

### Configuration

- [ ] `APP_NAME` is defined — [comment]
- [ ] `BASE_PATH` is defined — [comment]
- [ ] `API_BASE_PATH` is defined — [comment]
- [ ] `DATABASE_URL` is environment-configured — [comment]
- [ ] Auth header names are configurable or documented — [comment]

### Deployment Readiness

- [ ] Static frontend build has been verified — [comment]
- [ ] Backend health endpoint is available — [comment]
- [ ] Caddy proxy configuration is planned or available — [comment]
- [ ] Application logs include application identity — [comment]
- [ ] Required secrets and environment variables are identified — [comment]

## Evidence Table

| Area | Evidence | Status |
|---|---|---|
| Frontend | [file path / fact] | [met/not met/needs review/n/a] |
| Backend | [file path / fact] | [met/not met/needs review/n/a] |
| AI | [file path / fact] | [met/not met/needs review/n/a] |
| Database | [file path / fact] | [met/not met/needs review/n/a] |
| Auth | [file path / fact] | [met/not met/needs review/n/a] |
| API/UI Paths | [file path / fact] | [met/not met/needs review/n/a] |
| Deployment | [file path / fact] | [met/not met/needs review/n/a] |

## Open Questions / Exceptions

- [question or exception]
