# New Project Guidelines Approval Checklist

## Project Information

- [ ] Project name provided  
- [ ] Application owner identified  
- [ ] Target domain identified  
- [ ] Deployment environment identified

## Technology Stack

- [ ] Frontend uses an approved framework: React, Svelte, or Next.js  
- [ ] Frontend supports static build  
- [ ] Backend uses an approved stack: FastAPI, Spring Boot, or Go stdlib  
- [ ] Backend is deployable behind Caddy

## Database

- [ ] Application uses PostgreSQL  
- [ ] Application is compatible with RDS-hosted PostgreSQL  
- [ ] Database connection is environment-configured  
- [ ] Schema migration approach is defined

## Authentication

- [ ] Authentication is handled through Google via Caddy Proxy  
- [ ] Application uses `X-Token-User-Email` for authenticated user identity  
- [ ] Application uses `X-Token-User-Name` for display name where required  
- [ ] Application does not trust auth headers outside the approved proxy path  
- [ ] Authorization rules are defined where required

## Domain and Hosting

- [ ] Internal or POC application uses `*.iqm.services`  
- [ ] Client-facing application uses `*.iqm.com`  
- [ ] AI or workflow application uses `*.iqm.ai`  
- [ ] Shared domain usage has been identified if applicable  
- [ ] Application can coexist with other apps on shared domains

## API Path

- [ ] API has a unique base path  
- [ ] API path follows `/api/v<version>/<app-name>/...`  
- [ ] API path includes the application name  
- [ ] API does not use a generic shared path such as `/api/users` or `/api/data`  
- [ ] API versioning approach is defined

## UI Path

- [ ] UI supports configurable base path  
- [ ] UI can run on a dedicated subdomain  
- [ ] UI can run under a shared domain path  
- [ ] UI does not hardcode root-relative routes  
- [ ] UI asset paths work with configured base path

## Configuration

- [ ] `APP_NAME` is defined  
- [ ] `BASE_PATH` is defined  
- [ ] `API_BASE_PATH` is defined  
- [ ] `DATABASE_URL` is environment-configured  
- [ ] Auth header names are configurable or documented

## Deployment Readiness

- [ ] Static frontend build has been verified  
- [ ] Backend health endpoint is available  
- [ ] Caddy proxy configuration is planned or available  
- [ ] Application logs include application identity  
- [ ] Required secrets and environment variables are identified

## Committee Review

- [ ] Approved  
- [ ] Approved with comments  
- [ ] Rejected

## Committee Comments

```


```

