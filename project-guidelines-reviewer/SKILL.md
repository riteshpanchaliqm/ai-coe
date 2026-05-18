---
name: project-guidelines-reviewer
description: review a project codebase against iqm new project technical guidelines and generate a pre-filled markdown approval checklist. use when asked to inspect, audit, validate, approve, or prepare committee review for a new project repository/codebase, including checks for frontend, backend, database, authentication, api paths, ui base paths, caddy deployment, ai-assisted development tools, and runtime ai capabilities such as rag, vector dbs, embeddings, or llm providers.
---

# Project Guidelines Reviewer

## Purpose

Review a codebase against the IQM New Project Technical Guidelines and produce a pre-filled approval checklist for committee review.

The expected output is a markdown approval document with simple checkbox decisions, comments, and evidence notes. Do not only summarize the repository; map observed implementation evidence to the guidelines.

## Inputs to Use

Use whichever input source is available:

1. Uploaded source archive or project files in the conversation.
2. Connected GitHub repository/code search results when the user identifies a repo, PR, branch, or issue.
3. Plain-text project description when no code is available.

If the codebase is unavailable, produce a checklist with `Needs review` status and clearly identify the missing evidence.

## Review Workflow

1. Identify the project name, app name, likely framework, backend stack, deployment files, and configuration files.
2. Inspect the codebase using the section prompts in `references/`:
   - `frontend.md`
   - `backend.md`
   - `api-ui-paths.md`
   - `database.md`
   - `auth.md`
   - `ai.md`
   - `domain-hosting.md`
   - `deployment-config.md`
3. Record evidence as file paths, config keys, commands, routes, package names, framework files, or code snippets.
4. Generate the final document using `references/output-template.md`.
5. Mark each checklist item as one of:
   - `[x]` met
   - `[ ]` not met
   - `[-]` not applicable
   - `[?]` needs clarification or insufficient evidence

## Evidence Rules

- Prefer direct code/config evidence over README claims.
- Treat `package.json`, `vite.config.*`, `next.config.*`, `svelte.config.*`, Dockerfiles, Caddyfiles, compose files, manifests, `.env.example`, migration folders, and backend route definitions as high-signal evidence.
- Do not infer compliance from a dependency alone when configuration or usage is missing.
- If a requirement is satisfied by convention but not visible in code, mark `[?]` and add a comment.
- If the project uses a non-approved framework, provider, or database, mark `[ ]` and explain the exception required.

## Repository Inspection Hints

Look for common files:

- Frontend: `package.json`, `vite.config.*`, `next.config.*`, `svelte.config.*`, `src/routes`, `src/App.*`, `public/`, `dist/`, `build/`.
- Backend: `pyproject.toml`, `requirements.txt`, `pom.xml`, `build.gradle`, `go.mod`, `main.go`, `src/main/java`, `app/main.py`, route/controller files.
- Database: migrations, SQL files, ORM models, `alembic`, `flyway`, `liquibase`, Prisma configs, JDBC URLs, SQLAlchemy, pgx, psycopg, postgres drivers.
- Auth: references to `X-Token-User-Email`, `X-Token-User-Name`, auth middleware, trusted proxy assumptions, role checks.
- API/UI paths: route prefixes, routers, controller base paths, environment variables such as `API_BASE_PATH`, `BASE_PATH`, `PUBLIC_BASE_PATH`, `NEXT_PUBLIC_BASE_PATH`.
- Caddy/deployment: `Caddyfile`, Dockerfile, compose files, Kubernetes manifests, ECS/task definitions, health endpoints.
- AI: `openai`, `anthropic`, `@google/generative-ai`, Gemini, Bedrock SDKs, LangChain, LlamaIndex, vector DB clients, embedding models, RAG pipelines, prompt templates.

## Section Prompt Usage

Load only the reference prompt needed for the current review section. If the user specifically asks for a single-area review, only use that section plus the output template.

## Output Requirements

Always output a markdown document. Use the final template in `references/output-template.md` unless the user requests another format.

Include:

- Project metadata.
- Overall recommendation: `Approve`, `Approve with comments`, `Reject`, or `Needs more information`.
- Pre-filled committee checklist.
- Section findings with concise comments.
- Evidence table with file paths or observable facts.
- Open questions / exceptions.

Keep committee-facing language direct and actionable.
