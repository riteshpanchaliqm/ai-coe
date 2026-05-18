# Database Review Prompt

Check whether the data layer satisfies the PostgreSQL/RDS guideline.

## Checks

- Application uses PostgreSQL when persistence is required.
- Database is compatible with RDS-hosted PostgreSQL.
- `DATABASE_URL` or equivalent connection config is environment-based.
- Migration approach is defined.
- No hardcoded local-only database assumption is required for production.
- Vector DB requirement is separately declared when runtime AI needs embeddings/RAG/vector search.

## Evidence to collect

- Database drivers: psycopg, asyncpg, SQLAlchemy PostgreSQL URLs, pgx, JDBC postgres, Spring datasource, Prisma postgres.
- Migration folders/tools: Alembic, Flyway, Liquibase, SQL migration files.
- `.env.example`, config files, deployment manifests.
- Vector DB clients: pgvector, Pinecone, Weaviate, Qdrant, Milvus, OpenSearch vector, Chroma.

## Decision rules

- Mark not applicable if the app has no persistence requirement.
- Mark not met if production persistence uses a non-PostgreSQL database without an exception.
- Mark needs clarification if code includes SQLite/local DB defaults without production override evidence.
