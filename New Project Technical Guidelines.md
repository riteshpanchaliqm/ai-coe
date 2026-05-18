# New Project Technical Guidelines

[**1\. Standard Architecture	2**](#standard-architecture)

[**2\. Approved Technology Stack	2**](#approved-technology-stack)

[2.1. Frontend	2](#frontend)

[2.2. Backend	3](#backend)

[**3\. AI-Assisted Development Tools	3**](#ai-assisted-development-tools)

[**4\. Runtime AI Capabilities	4**](#runtime-ai-capabilities)

[**5\. Database	5**](#database)

[**6\. Authentication	5**](#authentication)

[**7\. Shared Subdomain Usage	6**](#shared-subdomain-usage)

[**8\. Domain Guidelines	6**](#domain-guidelines)

[8.1. Internal or Proof-of-Concept Applications	6](#internal-or-proof-of-concept-applications)

[8.2. Client-Facing Applications	7](#client-facing-applications)

[8.3. AI or Workflow-Based Applications	7](#ai-or-workflow-based-applications)

[**9\. API Path Requirements	7**](#api-path-requirements)

[**10\. UI Base Path Requirement	8**](#ui-base-path-requirement)

[**11\. Application Naming	10**](#application-naming)

[**12\. Recommended Project Defaults	10**](#recommended-project-defaults)

[**13\. Minimum Readiness Checklist	11**](#minimum-readiness-checklist)

[**14\. Example Deployment Layout	12**](#example-deployment-layout)

[14.1. Dedicated subdomain	12](#dedicated-subdomain)

[14.2. Shared tools domain	12](#shared-tools-domain)

[**15\. Core Principle	13**](#core-principle)

# 

1. ## Standard Architecture {#standard-architecture}

All new projects should follow a simple, deployable-by-default architecture:

![flowchart TD    A\[User Browser\] --\> B\[Caddy Server\]    B --\> C\[Static UI build\]    C --\> D\[Backend API service\]    D --\> E\[(PostgreSQL / RDS)\]][image1]

The preferred deployment model is:

* **Frontend:** static build served behind Caddy  
* **Backend:** API service proxied through Caddy  
* **Authentication:** handled at the Caddy proxy layer  
* **Database:** PostgreSQL hosted on AWS RDS

Applications should avoid introducing custom infrastructure unless there is a clear project-level requirement.

2. ## Approved Technology Stack {#approved-technology-stack}

   1. ### Frontend {#frontend}

Approved frontend options:

* React  
* Svelte  
* Next.js

Frontend applications should support static builds wherever possible.

For Next.js projects, static export or deployable static assets should be preferred unless server-side rendering is explicitly required.

2. ### Backend {#backend}

Approved backend options:

* Python with FastAPI  
* Java with Spring Boot  
* Go using the standard library

Backend services should expose HTTP APIs and should be deployable behind Caddy as proxied upstream services.

3. ## AI-Assisted Development Tools {#ai-assisted-development-tools}

Projects must disclose any AI-assisted development tools that will be used during design, development, testing, documentation, code review, or debugging.

Examples include:

* GitHub Copilot  
* Cursor  
* Kiro  
* Claude Code  
* ChatGPT  
* Other coding assistants or AI-based development tools

AI-assisted development tools may be used, but generated output must be reviewed by the project team before commit, merge, or deployment.

The project proposal should identify:

* which AI tools will be used  
* what they will be used for  
* whether they will access project code, internal documentation, client data, or production data  
* what review controls are in place before generated code is accepted

AI-generated code, configuration, documentation, and tests remain the responsibility of the project team.

4. ## Runtime AI Capabilities {#runtime-ai-capabilities}

Projects must declare whether the application requires any runtime AI capabilities.

Runtime AI capabilities include, but are not limited to:

* LLM text generation  
* Chat or assistant interfaces  
* Retrieval-augmented generation, or RAG  
* Embeddings  
* Vector search  
* Document processing  
* Image or multimodal processing  
* Agentic workflows  
* Classification, extraction, or summarization

If runtime AI capabilities are required, the project proposal should identify the intended provider or platform.

Examples include:

* OpenAI  
* Anthropic  
* Google Gemini  
* AWS Bedrock  
* Local or self-hosted models (preferably Ollama)

Applications using RAG, embeddings, or semantic search must also declare whether a vector database or vector search capability is required.

The project proposal should identify:

* the AI capability being added  
* the LLM provider or model platform  
* whether RAG or embeddings are required  
* whether a vector database is required  
* what data sources will be used for retrieval  
* what type of data will be sent to the AI provider  
* expected usage volume, if known  
* any AI-specific risks, controls, or review requirements

Projects that send client data, personal data, sensitive data, or regulated data to an AI provider require explicit review before approval.

5. ## Database {#database}

The standard database for new projects is:

***PostgreSQL hosted on AWS RDS***

The database will be provisioned and provided as part of the infrastructure.

Projects should not create or manage their own production databases unless explicitly approved.

Application teams are responsible for:

* Defining schema migrations  
* Managing application-level database access  
* Avoiding direct dependency on local-only database behavior  
* Ensuring compatibility with PostgreSQL

---

6. ## Authentication {#authentication}

Authentication should be handled through **Google authentication via Caddy Proxy**.

Applications should not implement their own primary Google OAuth flow unless there is a specific exception.

Once authenticated, Caddy will forward trusted user identity headers to the backend and/or frontend service.

Applications may rely on the following trusted headers:

```
X-Token-User-Email
X-Token-User-Name
```

Expected usage:

* `X-Token-User-Email` should be treated as the authenticated user’s unique identity.  
* `X-Token-User-Name` may be used for display purposes.  
* Authorization logic, if required, should be implemented by the application.  
* Applications should not trust these headers unless the request is coming through the approved Caddy proxy path.

7. ## Shared Subdomain Usage {#shared-subdomain-usage}

Common shared subdomains may be used for hosting multiple applications, and is preferred.

Examples:

```
tools.iqm.services
apps.iqm.services
```

Because these domains may host multiple applications, every project must support configurable API and UI paths.

This ensures applications can coexist safely under the same domain without path conflicts.

8. ## Domain Guidelines {#domain-guidelines}

If the shared subdomain is not feasible, the following domain patterns are available.

1. ### Internal or Proof-of-Concept Applications {#internal-or-proof-of-concept-applications}

```
*.iqm.services
```

Use this for:

* Internal tools  
* Proofs of concept  
* Admin utilities  
* Engineering-facing applications  
* Non-client-facing experiments

Example:

```
mytool.iqm.services
```

---

2. ### Client-Facing Applications {#client-facing-applications}

```
*.iqm.com
```

Use this for:

* Production client-facing applications  
* External-facing customer portals  
* Public or semi-public business applications

Example:

```
portal.iqm.com
```

---

3. ### AI or Workflow-Based Applications {#ai-or-workflow-based-applications}

```
*.iqm.ai
```

Use this for:

* AI-powered tools  
* Agentic workflows  
* Automation platforms  
* LLM-backed applications  
* Workflow orchestration products

Example:

```
assistant.iqm.ai
```

9. ## API Path Requirements {#api-path-requirements}

Every backend API must use a unique base path.

The recommended format is:

```
/api/v<version>/<app-name>/...
```

Example:

```
/api/v1/inventory/...
/api/v1/reporting/...
/api/v2/workflow-runner/...
```

Rules:

* API paths must be unique across all apps hosted on the same domain.  
* The app name must be included in the API path.  
* API versioning should be included where relevant.  
* Generic paths such as `/api/users`, `/api/items`, or `/api/data` should be avoided.  
* Applications must not assume they own the entire `/api` namespace.

Recommended pattern:

```
/api/v1/<app-name>/<resource>
```

Example:

```
/api/v1/ticketing/tickets
/api/v1/ticketing/users
/api/v1/ticketing/reports
```

---

10. ## UI Base Path Requirement {#ui-base-path-requirement}

All frontend applications must support a configurable base path.

This is required so the same UI can be hosted either:

* on its own subdomain, or  
* under a shared domain path.

Examples:

```
https://myapp.iqm.services/
https://tools.iqm.services/myapp/
https://apps.iqm.services/workflows/
```

Frontend applications must not hardcode root-relative assumptions unless they are explicitly configurable.

Avoid hardcoded paths like:

```
/assets/logo.svg
/dashboard
/settings
```

Prefer base-path-aware routing and asset handling.

For example:

```
<BASE_PATH>/dashboard
<BASE_PATH>/settings
<BASE_PATH>/assets/logo.svg
```

Each frontend should expose a configuration option such as:

```
BASE_PATH=/myapp
```

or equivalent framework-specific configuration.

---

11. ## Application Naming {#application-naming}

Each application should have a short, stable, URL-safe application name.

The application name should be used consistently across:

* API base path  
* UI base path  
* deployment name  
* service name  
* logging metadata  
* database schema or namespace where applicable

Example:

```
Application name: inventory

UI path:
https://tools.iqm.services/inventory/

API path:
/api/v1/inventory/...
```

---

12. ## Recommended Project Defaults {#recommended-project-defaults}

Each new project should define the following configuration values from the beginning:

```
APP_NAME=
BASE_PATH=
API_BASE_PATH=
DATABASE_URL=
AUTH_USER_EMAIL_HEADER=X-Token-User-Email
AUTH_USER_NAME_HEADER=X-Token-User-Name
```

Example:

```
APP_NAME=inventory
BASE_PATH=/inventory
API_BASE_PATH=/api/v1/inventory
DATABASE_URL=postgresql://...
AUTH_USER_EMAIL_HEADER=X-Token-User-Email
AUTH_USER_NAME_HEADER=X-Token-User-Name
```

---

13. ## Minimum Readiness Checklist {#minimum-readiness-checklist}

Before a project is considered ready for deployment, it should confirm the following:

| Area | Requirement |
| :---- | :---- |
| Frontend | Static build is supported |
| Frontend | UI supports configurable base path |
| Backend | API is served under a unique app-specific path |
| Backend | API path follows `/api/v<version>/<app-name>/...` |
| Auth | App uses trusted Caddy auth headers |
| Auth | App does not expose unauthenticated backend routes unless intentional |
| AI | AI-assisted development tools are disclosed, if used |
| AI | Runtime AI capabilities are disclosed, if required |
| AI | LLM provider, RAG, embeddings, and vector database needs are documented, if applicable |
| AI | Data sent to AI providers is classified and reviewed, if applicable |
| Database | Uses PostgreSQL |
| Database | Works with RDS-provided connection details |
| Domain | Correct domain family is selected |
| Proxy | App is deployable behind Caddy |
| Config | Environment-based configuration is supported |

---

14. ## Example Deployment Layout {#example-deployment-layout}

    1. ### Dedicated subdomain {#dedicated-subdomain}

```
https://inventory.iqm.services/
```

Frontend:

```
/
```

API:

```
/api/v1/inventory/...
```

---

2. ### Shared tools domain {#shared-tools-domain}

```
https://tools.iqm.services/inventory/
```

Frontend:

```
/inventory/
```

API:

```
/api/v1/inventory/...
```

15. ## Core Principle {#core-principle}

Every new project should be designed so that it can run independently, but also coexist safely with other applications on a shared domain.

That means:

```
Unique API namespace
Configurable UI base path
Proxy-compatible authentication
Static frontend deployment
PostgreSQL-backed persistence
```

These should be treated as default requirements for all new projects unless an explicit exception is approved.  


[image1]: <data:image/png;base64,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>